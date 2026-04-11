import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Inicio", path: "/tutor" },
  { label: "Mis alumnos", path: "/tutor/alumnos" },
  { label: "Actividades", path: "/tutor/actividades" },
  { label: "Agregar Ejercicios/Alumnos", path: "/tutor/agregar" },
  { label: "Mi perfil", path: "/tutor/perfil" },
];

export default function NavbarTutor() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Desktop */}
      <ul className="navbar__list">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === "/tutor"}
              className={({ isActive }) =>
                isActive ? "navbar__link navbar__link--active" : "navbar__link"
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Hamburger button */}
      <button
        className="navbar__hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Abrir menú"
      >
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="navbar__mobile">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/tutor"}
                className={({ isActive }) =>
                  isActive
                    ? "navbar__mobile-link navbar__mobile-link--active"
                    : "navbar__mobile-link"
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .navbar {
          background-color: #3B82F6;
          padding: 0 2rem;
          position: relative;
        }

        .navbar__list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0.5rem;
        }

        .navbar__link {
          display: block;
          padding: 1.1rem 1.2rem;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background 0.2s, color 0.2s;
          border-bottom: 3px solid transparent;
        }

        .navbar__link:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }

        .navbar__link--active {
          color: #ffffff;
          border-bottom: 3px solid #ffffff;
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Hamburger */
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 1rem 0;
        }

        .hamburger-line {
          display: block;
          width: 25px;
          height: 2px;
          background-color: #ffffff;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }

        /* Mobile menu */
        .navbar__mobile {
          display: flex;
          flex-direction: column;
          list-style: none;
          margin: 0;
          padding: 0.5rem 0;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: #3B82F6;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .navbar__mobile-link {
          display: block;
          padding: 0.85rem 1.5rem;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background 0.2s;
        }

        .navbar__mobile-link:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }

        .navbar__mobile-link--active {
          background-color: rgba(255, 255, 255, 0.2);
          border-left: 4px solid #ffffff;
        }

        @media (max-width: 768px) {
          .navbar__list {
            display: none;
          }
          .navbar__hamburger {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}