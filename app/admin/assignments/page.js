"use client";
import AssignmentClient from "./AssignmentClient";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar Mejorado */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo y Título con más espacio */}
          <div className="flex items-center space-x-3 w-72">
            <div className="p-1.5 bg-white rounded-full shadow-md">
              <img
                src="/logo.png"
                alt="Hombres de Blanco"
                className="h-9 w-9 rounded-full"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
              Hombres de Blanco
            </h1>
          </div>

          <div className="flex items-center">
            {/* Navegación Principal con espaciado reducido */}
            <nav className="hidden md:flex items-center space-x-3">
              {[
                { 
                  name: 'Asignaciones', 
                  current: true,
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                      />
                    </svg>
                  )
                },
                { 
                  name: 'Dashboard', 
                  current: false,
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                      />
                    </svg>
                  )
                },
                { 
                  name: 'RR.HH.', 
                  current: false,
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                      />
                    </svg>
                  )
                },
                { 
                  name: 'Inventario', 
                  current: false,
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                      />
                    </svg>
                  )
                },
                { 
                  name: 'Calendario', 
                  current: false,
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  )
                },
                { 
                  name: 'Reportes', 
                  current: false,
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                  )
                }
              ].map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-sm font-medium
                    ${item.current 
                      ? 'bg-blue-800 text-white' 
                      : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Separador más cercano */}
            <div className="h-6 w-px bg-blue-400/50 mx-4 hidden md:block"></div>

            {/* Botón de Cerrar Sesión */}
            <button 
              onClick={() => {/* Función para cerrar sesión */}}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg 
                        text-blue-100 hover:bg-blue-800/50 hover:text-white
                        transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              <span className="hidden md:inline text-sm font-medium">
                Cerrar Sesión
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow">
        <AssignmentClient />
      </main>
    </div>
  );
}
