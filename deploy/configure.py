"""Genera secretos de la demo en el servidor. No imprime ni sobrescribe secretos."""
import argparse
from pathlib import Path
import re
import secrets
import os

parser = argparse.ArgumentParser()
parser.add_argument('--domain', required=True)
parser.add_argument('--project', required=True)
args = parser.parse_args()
if not re.fullmatch(r'[a-zA-Z0-9.-]+', args.domain) or not re.fullmatch(r'[a-z][a-z0-9-]+', args.project):
    parser.error('Dominio o proyecto inválido.')
os.umask(0o077)
target = Path(__file__).resolve().parents[1] / '.env.demo'
with target.open('x', encoding='utf-8') as archivo:
    archivo.write(f'APP_DOMAIN={args.domain}\nGOOGLE_CLOUD_PROJECT={args.project}\n')
    archivo.write(f'DB_PASSWORD=Aa1{secrets.token_hex(24)}\nSECRET_KEY={secrets.token_hex(48)}\n')
    archivo.write('GOOGLE_VISION_ENABLED=true\n')
print('Configuración creada en .env.demo con permisos privados.')
