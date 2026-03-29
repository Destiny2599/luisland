import { useState } from "react";

const SECCIONES = [
  {
    titulo: "Crear y agregar página",
    contenido: [
      {
        tipo: "paso",
        titulo: "1. Crear el archivo",
        texto: "Crea un nuevo archivo en frontend/src/pages/ con el nombre de tu página, por ejemplo MiPagina.jsx",
        codigo: `export default function MiPagina() {
  return (
    <main className="ll-hero ll-hero--top">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-scanline"  aria-hidden="true" />
      <div className="ll-page-content">
        <p className="ll-hero-eyebrow">// sección</p>
        <h1 className="ll-page-title">
          Mi<span className="ll-hero-accent">Página</span>
        </h1>
        {/* Tu contenido aquí */}
      </div>
    </main>
  );
}`,
      },
      {
        tipo: "paso",
        titulo: "2. Importar en App.jsx",
        texto: "Agrega el import al inicio de App.jsx junto a los demás imports de páginas:",
        codigo: `import MiPagina from "./pages/MiPagina.jsx";`,
      },
      {
        tipo: "paso",
        titulo: "3. Agregar la ruta",
        texto: "Dentro del bloque <Routes> en App.jsx agrega la ruta protegida con los roles que corresponda:",
        codigo: `<Route path="/mi-pagina" element={
  <PrivateRoute rolesPermitidos={["ADMIN", "DEVELOPER"]}>
    <MiPagina />
  </PrivateRoute>
} />`,
      },
      {
        tipo: "paso",
        titulo: "4. Agregar al menú",
        texto: "En NAV_ITEMS busca el grupo donde quieres que aparezca (Información, Herramientas o Experimentos) y agrega la opción:",
        codigo: `{ label: "Mi Página", to: "/mi-pagina", roles: ["ADMIN", "DEVELOPER"] },`,
      },
      {
        tipo: "paso",
        titulo: "5. Subir a producción",
        texto: "Guarda los cambios, haz commit y push. Vercel redesplegará automáticamente el frontend:",
        codigo: `git add .
git commit -m "feat: agregar MiPagina"
git push`,
      },
    ],
  },
  {
    titulo: "Estructura de carpetas",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: guía de cómo está organizado el proyecto LuisLand.",
      },
    ],
  },
  {
    titulo: "Sistema de roles",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: explicación de los roles ADMIN, DEVELOPER y STANDARD.",
      },
    ],
  },
  {
    titulo: "Estilos y variables CSS",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: guía de variables CSS disponibles y clases reutilizables.",
      },
    ],
  },
  {
    titulo: "Conectar con el backend",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: cómo hacer peticiones autenticadas al backend desde el frontend.",
      },
    ],
  },
  {
    titulo: "Crear endpoint en Spring Boot",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: guía paso a paso para agregar un nuevo endpoint al backend.",
      },
    ],
  },
  {
    titulo: "Despliegue en producción",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: cómo subir cambios a Railway (backend) y Vercel (frontend).",
      },
    ],
  },
  {
    titulo: "Variables de entorno",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: guía de variables de entorno en local y en producción.",
      },
    ],
  },
  {
    titulo: "MongoDB y Atlas",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: cómo gestionar la base de datos en MongoDB Atlas.",
      },
    ],
  },
  {
    titulo: "Trabajar desde otro equipo",
    contenido: [
      {
        tipo: "texto",
        texto: "Próximamente: checklist completo para configurar un equipo nuevo.",
      },
    ],
  },
];

function Bloque({ bloque }) {
  if (bloque.tipo === "texto") {
    return (
      <p className="ll-guia-texto">{bloque.texto}</p>
    );
  }

  return (
    <div className="ll-guia-paso">
      <h3 className="ll-guia-paso-titulo">{bloque.titulo}</h3>
      <p className="ll-guia-texto">{bloque.texto}</p>
      {bloque.codigo && (
        <pre className="ll-guia-code"><code>{bloque.codigo}</code></pre>
      )}
    </div>
  );
}

function Acordeon({ seccion, index, abierto, onToggle }) {
  return (
    <div className={`ll-acordeon ${abierto ? "ll-acordeon--abierto" : ""}`}>
      <button className="ll-acordeon-header" onClick={onToggle}>
        <span className="ll-acordeon-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="ll-acordeon-titulo">{seccion.titulo}</span>
        <span className={`ll-acordeon-chevron ${abierto ? "open" : ""}`}>›</span>
      </button>

      {abierto && (
        <div className="ll-acordeon-body">
          {seccion.contenido.map((bloque, i) => (
            <Bloque key={i} bloque={bloque} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GuiaRapida() {
  const [abierto, setAbierto] = useState(null);

  const toggle = (i) => setAbierto(abierto === i ? null : i);

  return (
    <main className="ll-hero ll-hero--top">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-scanline"  aria-hidden="true" />

      <div className="ll-page-content">
        <div className="ll-page-header">
          <div>
            <p className="ll-hero-eyebrow">// documentación interna</p>
            <h1 className="ll-page-title">
              Guía rápida del <span className="ll-hero-accent">Website</span>
            </h1>
          </div>
        </div>

        <div className="ll-acordeon-lista">
          {SECCIONES.map((sec, i) => (
            <Acordeon
              key={i}
              index={i}
              seccion={sec}
              abierto={abierto === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}