import Acordeon from "../components/Acordeon";

const SECCIONES = [
  
      {
        titulo: "titulo",
        contenido: [{texto: "ejemplo"},],

      },

      {
        titulo: "titulo",
        contenido: [{texto: "ejemplo"},],

      },
      {
        titulo: "titulo",
        contenido: [{texto: "ejemplo"},],

      },
      {
        titulo: "titulo",
        contenido: [{texto: "ejemplo"},],

      },

];

export default function SpringBoot() {
  return (
    <main className="ll-hero ll-hero--top">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-scanline"  aria-hidden="true" />

      <div className="ll-page-content">
        <div className="ll-page-header">
          <div>
            <p className="ll-hero-eyebrow">// Datos sobre SpringBoot</p>
            <h1 className="ll-page-title">
              Guía rápida sobre como utilizar <span className="ll-hero-accent">SpringBoot</span>
            </h1>
          </div>
        </div>

        <Acordeon secciones={SECCIONES} />
      </div>
    </main>
  );
}