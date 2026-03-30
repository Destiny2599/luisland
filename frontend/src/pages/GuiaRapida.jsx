import Acordeon from "../components/Acordeon";

const SECCIONES = [
  //#1 Creacion de Pagina
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
        texto: "En NAV_ITEMS busca el grupo donde quieres que aparezca y agrega la opción:",
        codigo: `{ label: "Mi Página", to: "/mi-pagina", roles: ["ADMIN", "DEVELOPER"] },`,
      },
      {
        tipo: "paso",
        titulo: "5. Subir a producción",
        texto: "Guarda los cambios, haz commit y push. Vercel redesplegará automáticamente:",
        codigo: `git add .
git commit -m "feat: agregar MiPagina"
git push`,
      },
    ],
  },
  //#2 Uso de Acordeon}
  {
      titulo: "Reutilización de Componente Acordeón",
      contenido: [
        {
          tipo: "paso",
          titulo: "1. Ubicación del componente",
          texto: "El componente Acordeon ya está creado y listo para usarse en cualquier página. Se encuentra en:",
          codigo: `frontend/src/components/Acordeon.jsx`,
        },
        {
          tipo: "paso",
          titulo: "2. Importarlo en tu página",
          texto: "Al inicio de tu página agrega el import:",
          codigo: `import Acordeon from "../components/Acordeon";`,
        },
        {
          tipo: "paso",
          titulo: "3. Definir las secciones",
          texto: "Crea un array SECCIONES con la información que quieres mostrar. Cada sección tiene un título y un array de bloques de contenido. Hay dos tipos de bloques:",
          codigo: `const SECCIONES = [
    {
      titulo: "Mi primera sección",
      contenido: [
        // Tipo texto — solo muestra un párrafo
        { tipo: "texto", texto: "Descripción de la sección." },
  
        // Tipo paso — muestra título, texto y bloque de código
        {
          tipo: "paso",
          titulo: "Paso 1",
          texto: "Descripción del paso.",
          codigo: \`// Tu código aquí\`,
        },
      ],
    },
  ];`,
      },
      {
        tipo: "paso",
        titulo: "4. Usar el componente",
        texto: "Dentro del JSX de tu página agrega el componente pasándole el array SECCIONES:",
        codigo: `export default function MiPagina() {
  return (
    <main className="ll-hero ll-hero--top">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-scanline"  aria-hidden="true" />
      <div className="ll-page-content">
        <p className="ll-hero-eyebrow">// mi sección</p>
        <h1 className="ll-page-title">
          Mi <span className="ll-hero-accent">Página</span>
        </h1>
        <Acordeon secciones={SECCIONES} />
      </div>
    </main>
  );
}`,
      },
      {
        tipo: "texto",
        texto: "El componente maneja automáticamente el estado de apertura y cierre de cada sección. Solo necesitas preocuparte por el contenido.",
      },
    ],
  },



  {
    titulo: "Estructura de carpetas",
    contenido: [
      { tipo: "texto", texto: "Próximamente: guía de cómo está organizado el proyecto LuisLand." },
    ],
  },
  {
    titulo: "Sistema de roles",
    contenido: [
      { tipo: "texto", texto: "Próximamente: explicación de los roles ADMIN, DEVELOPER y STANDARD." },
    ],
  },
  {
    titulo: "Estilos y variables CSS",
    contenido: [
      { tipo: "texto", texto: "Próximamente: guía de variables CSS disponibles y clases reutilizables." },
    ],
  },
  {
    titulo: "Conectar con el backend",
    contenido: [
      { tipo: "texto", texto: "Próximamente: cómo hacer peticiones autenticadas al backend desde el frontend." },
    ],
  },
  {
    titulo: "Crear endpoint en Spring Boot",
    contenido: [
      { tipo: "texto", texto: "Próximamente: guía paso a paso para agregar un nuevo endpoint al backend." },
    ],
  },
  {
    titulo: "Despliegue en producción",
    contenido: [
      { tipo: "texto", texto: "Próximamente: cómo subir cambios a Railway (backend) y Vercel (frontend)." },
    ],
  },
  {
    titulo: "Variables de entorno",
    contenido: [
      { tipo: "texto", texto: "Próximamente: guía de variables de entorno en local y en producción." },
    ],
  },
  {
    titulo: "MongoDB y Atlas",
    contenido: [
      { tipo: "texto", texto: "Próximamente: cómo gestion ar la base de datos en MongoDB Atlas." },
    ],
  },
  {
    titulo: "Trabajar desde otro equipo",
    contenido: [
      { tipo: "texto", texto: "Próximamente: checklist completo para configurar un equipo nuevo." },
    ],
  },
];

export default function GuiaRapida() {
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

        <Acordeon secciones={SECCIONES} />
      </div>
    </main>
  );
}