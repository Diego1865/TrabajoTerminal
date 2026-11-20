"""Ejecuta Bash con Git, Docker y HTTP simulados; no usa la VM ni Cloud SQL."""
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "deploy-main.sh"
SHA = "a" * 40
OLD = "b" * 40
BASH = os.environ.get("TEST_BASH") or shutil.which("bash")

HARNESS = r'''
source "$DEPLOY_SCRIPT"
git() {
    printf 'git %s\n' "$*" >> "$CALLS"
    case "$*" in
        'branch --show-current') echo main ;;
        'status --porcelain') if [[ "$SCENARIO" == dirty ]]; then echo ' M .gitignore'; fi ;;
        'rev-parse --is-shallow-repository') echo false ;;
        'rev-parse origin/main')
            if [[ "$SCENARIO" == stale ]]; then echo "$OLD_SHA"; else echo "$TARGET_SHA"; fi ;;
        'rev-parse HEAD') echo "$OLD_SHA" ;;
        'merge-base --is-ancestor '*) [[ "$SCENARIO" != diverged ]] ;;
    esac
}
docker() {
    printf 'docker %s\n' "$*" >> "$CALLS"
    case "$*" in
        *'config --format json') echo '{"services":{"web":{"environment":{"APP_DOMAIN":"example.invalid"}}}}' ;;
        *'build frontend') [[ "$SCENARIO" != build_fail ]] ;;
        *'run --rm --no-deps -T --interactive=false backend python -c '*) [[ "$SCENARIO" != ocr_fail ]] ;;
        *'run --rm --no-deps -T --interactive=false db-init') [[ "$SCENARIO" != migration_fail ]] ;;
        *'up -d '*) [[ "$SCENARIO" != unhealthy ]] ;;
    esac
}
curl() {
    printf 'curl %s\n' "$*" >> "$CALLS"
    if [[ "$*" == *'/api/tutor/perfil'* ]]; then
        if [[ "$SCENARIO" == api_fail ]]; then printf 502; else printf 401; fi
    fi
}
flock() { [[ "$SCENARIO" != locked ]]; }
install() { mkdir -p "$STATE_DIR"; }
python3() { "$TEST_PYTHON" "$@"; }
deploy_main "$TARGET_SHA" "$APP_DIR" "$STATE_DIR" "$LOCK_FILE"
'''


@unittest.skipUnless(BASH, "Se requiere Bash")
class DeploymentTests(unittest.TestCase):
    def test_stdin_entrypoint_matches_file_without_deploying(self):
        # El workflow usa bash -s: BASH_SOURCE puede estar vacío con set -u.
        # Un SHA inválido detiene la ejecución antes de acceder a la VM o Docker.
        direct = subprocess.run([BASH, SCRIPT.as_posix(), "invalid"],
                                text=True, encoding="utf-8", capture_output=True, timeout=30)
        streamed = subprocess.run([BASH, "-s", "--", "invalid"],
                                  input=SCRIPT.read_text(encoding="utf-8"),
                                  text=True, encoding="utf-8", capture_output=True, timeout=30)
        self.assertEqual(direct.returncode, 1, direct.stderr)
        self.assertTrue("Ejecuta el despliegue con sudo." in direct.stderr or
                        "Se requiere el SHA completo" in direct.stderr, direct.stderr)
        self.assertEqual(streamed.returncode, direct.returncode, streamed.stderr)
        self.assertEqual(streamed.stderr, direct.stderr)

    def deploy(self, scenario, sha=SHA):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            app = root / "app"
            (app / "deploy").mkdir(parents=True)
            (app / ".env.demo").write_text("APP_DOMAIN=example.invalid\n")
            (app / "deploy" / "respaldo-nube.sh").write_text(
                '#!/usr/bin/env bash\nprintf "backup\\n" >> "$CALLS"\n'
                '[[ "$SCENARIO" != backup_fail ]]\n', encoding="utf-8"
            )
            state = root / "state"
            state.mkdir()
            (state / "current").write_text(OLD + "\n")
            calls = root / "calls"
            env = dict(os.environ, SCENARIO=scenario, TARGET_SHA=sha, OLD_SHA=OLD,
                       DEPLOY_SCRIPT=SCRIPT.as_posix(), TEST_PYTHON=Path(sys.executable).as_posix(),
                       APP_DIR=app.as_posix(), STATE_DIR=state.as_posix(),
                       LOCK_FILE=(root / "lock").as_posix(), CALLS=calls.as_posix())
            result = subprocess.run([BASH, "-c", HARNESS], env=env, text=True,
                                    capture_output=True, timeout=30)
            log = calls.read_text() if calls.exists() else ""
            current = (state / "current").read_text().strip()
            previous = (state / "previous").read_text().strip() if (state / "previous").exists() else None
            return result, log, current, previous

    def test_success_orders_build_backup_migrations_and_health(self):
        result, log, current, previous = self.deploy("ok")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertLess(log.index("build frontend"), log.index("validar_credenciales_ocr"))
        self.assertLess(log.index("validar_credenciales_ocr"), log.index("backup\n"))
        self.assertLess(log.index("backup\n"), log.index("run --rm --no-deps -T --interactive=false db-init"))
        self.assertLess(log.index("run --rm --no-deps -T --interactive=false db-init"), log.index("up -d"))
        self.assertIn("--wait --wait-timeout 180", log)
        self.assertIn("/api/tutor/perfil", log)
        self.assertEqual((current, previous), (SHA, OLD))

    def test_preflight_failures_never_start_docker(self):
        for scenario in ("dirty", "diverged", "locked"):
            with self.subTest(scenario=scenario):
                result, log, current, _ = self.deploy(scenario)
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn("docker ", log)
                self.assertEqual(current, OLD)

    def test_superseded_commit_is_skipped(self):
        result, log, current, _ = self.deploy("stale")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn("git merge --ff-only", log)
        self.assertNotIn("docker ", log)
        self.assertEqual(current, OLD)

    def test_bad_sha_is_rejected_before_git(self):
        result, log, current, _ = self.deploy("ok", "main; echo invalid")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(log, "")
        self.assertEqual(current, OLD)

    def test_failed_build_or_backup_prevents_migrations(self):
        for scenario in ("build_fail", "backup_fail"):
            with self.subTest(scenario=scenario):
                result, log, current, _ = self.deploy(scenario)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("build frontend", log)
                if scenario == "backup_fail":
                    self.assertIn("backup\n", log)
                self.assertNotIn("--interactive=false db-init", log)
                self.assertNotIn("up -d", log)
                self.assertEqual(current, OLD)

    def test_failed_migration_prevents_replacing_services(self):
        result, log, current, _ = self.deploy("migration_fail")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("run --rm --no-deps -T --interactive=false db-init", log)
        self.assertNotIn("up -d", log)
        self.assertEqual(current, OLD)

    def test_invalid_ocr_configuration_prevents_backups_and_migrations(self):
        result, log, current, _ = self.deploy("ocr_fail")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("validar_credenciales_ocr", log)
        self.assertNotIn("backup\n", log)
        self.assertNotIn("--interactive=false db-init", log)
        self.assertNotIn("up -d", log)
        self.assertEqual(current, OLD)

    def test_unhealthy_app_does_not_record_success(self):
        for scenario in ("unhealthy", "api_fail"):
            with self.subTest(scenario=scenario):
                result, log, current, _ = self.deploy(scenario)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("up -d", log)
                if scenario == "api_fail":
                    self.assertIn("/api/tutor/perfil", log)
                self.assertEqual(current, OLD)


if __name__ == "__main__":
    unittest.main()
