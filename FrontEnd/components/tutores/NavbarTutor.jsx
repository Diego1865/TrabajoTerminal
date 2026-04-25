import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Inicio", path: "/tutor" },
  { label: "Mis alumnos", path: "/tutor/alumnos" },
  { label: "Actividades", path: "/tutor/actividades" },
  { label: "Agregar Ejercicios/Alumnos", path: "/tutor/agregar" },
  { label: "Perfil", path: "/tutor/perfil" },
];

export default function NavbarTutor() {
  return (
    <nav className="flex justify-center mb-8 mt-4 px-2 w-full">
      <div 
        className="flex bg-gray-200 p-1 rounded-full shadow-inner overflow-x-auto max-w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/tutor"}
            className={({ isActive }) =>
              `px-4 sm:px-8 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}