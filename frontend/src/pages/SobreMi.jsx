export default function SobreMi() {
  return (
    <main className="ll-hero ll-hero--top">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-scanline" aria-hidden="true" />

      <div className="sm-container">

        {/* ── ENCABEZADO ── */}
        <div className="sm-header">
          <div className="sm-header-text">
            <p className="ll-hero-eyebrow">// sobre_mi.exe</p>
            <h1 className="ll-hero-title">
              Luis <span className="ll-hero-accent">Ramos Rivas</span>
            </h1>
            <p className="sm-role">Ingeniero en Sistemas Computacionales</p>
            <p className="sm-location">📍 Culiacán, Sinaloa</p>
          </div>

          <div className="sm-actions">
            <a
              href="/cv.pdf"
              download="CV_Luis_Ramos.pdf"
              className="sm-btn-download"
            >
              ↓ Descargar CV
            </a>
            <div className="sm-contacts">
              <a href="tel:6671683904" className="sm-contact-link">📞 667 168 39 04</a>
              <a href="mailto:luisvoz2599@gmail.com" className="sm-contact-link">📧 luisvoz2599@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="ll-hero-line sm-divider" />

        {/* ── PERFIL ── */}
        <section className="sm-section">
          <h2 className="sm-section-title">// perfil</h2>
          <p className="sm-text">
            Recién graduado en Sistemas Computacionales, con experiencia práctica
            y gusto por la informática y el soporte técnico. Formación tanto
            académica como autodidacta en desarrollo de software. Con iniciativa
            y compromiso para asumir nuevos retos, enfocado en la mejora continua
            y en aprender nuevas herramientas que permitan trabajar de forma más
            eficiente.
          </p>
        </section>

        {/* ── GRID PRINCIPAL ── */}
        <div className="sm-grid">

          {/* Experiencia */}
          <section className="sm-section sm-section--wide">
            <h2 className="sm-section-title">// experiencia_laboral</h2>

            <div className="sm-job">
              <div className="sm-job-header">
                <span className="sm-job-company">Compudepot.mx</span>
                <span className="sm-job-period">Oct 2023 – Feb 2026</span>
              </div>
              <p className="sm-job-role">Encargado del Laboratorio de Reparación</p>
              <ul className="sm-list">
                <li>Diagnóstico, desarme y reparación de equipos electrónicos a nivel componente</li>
                <li>Reemplazo de piezas, mantenimiento preventivo y correctivo</li>
                <li>Ensamble de equipos desde cero y pruebas de funcionamiento</li>
                <li>Recuperación de información en unidades dañadas</li>
                <li>Creación y administración de servidores NAS en red local</li>
                <li>Ensamble y pruebas de rigs de minería y renderizado</li>
              </ul>
            </div>

            <div className="sm-job">
              <div className="sm-job-header">
                <span className="sm-job-company">Siesa Digital</span>
                <span className="sm-job-period">Mar 2021 – Sep 2023</span>
              </div>
              <p className="sm-job-role">Operador y Atención al Cliente</p>
              <ul className="sm-list">
                <li>Operación de impresoras y copiadoras de distintos formatos</li>
                <li>Producción de planos arquitectónicos, impresiones fotográficas, vinil y lienzos</li>
                <li>Edición básica en AutoCAD, Photoshop, CorelDRAW, Illustrator y Premiere</li>
                <li>Atención directa al cliente</li>
              </ul>
            </div>
          </section>

          {/* Columna derecha */}
          <div className="sm-sidebar">

            {/* Educación */}
            <section className="sm-section">
              <h2 className="sm-section-title">// educación</h2>
              <div className="sm-edu">
                <p className="sm-edu-school">UTEL</p>
                <p className="sm-edu-degree">Ing. en Sistemas Computacionales</p>
                <p className="sm-edu-period">2022 – 2025</p>
              </div>
              <div className="sm-edu">
                <p className="sm-edu-school">CBTis #224</p>
                <p className="sm-edu-degree">Especialidad en Programación</p>
                <p className="sm-edu-period">2015 – 2017</p>
              </div>
              <div className="sm-edu">
                <p className="sm-edu-school">Sec. Técnica #64</p>
                <p className="sm-edu-degree">Especialidad en Informática</p>
                <p className="sm-edu-period">2012 – 2015</p>
              </div>
            </section>

            {/* Skills */}
            <section className="sm-section">
              <h2 className="sm-section-title">// stack</h2>
              <div className="sm-tags">
                {["Java","C#","Python","Spring Boot","React.js","Bootstrap",
                  "SQL","MongoDB","Postman","HTML","CSS","JavaScript"].map(s => (
                  <span key={s} className="sm-tag">{s}</span>
                ))}
              </div>
            </section>

            {/* Idiomas */}
            <section className="sm-section">
              <h2 className="sm-section-title">// idiomas</h2>
              <div className="sm-lang"><span>Inglés escrito</span><span className="sm-lang-level">Alto</span></div>
              <div className="sm-lang"><span>Inglés hablado</span><span className="sm-lang-level">Intermedio</span></div>
              <div className="sm-lang"><span>Japonés</span><span className="sm-lang-level">Principiante</span></div>
            </section>

            {/* Aficiones */}
            <section className="sm-section">
              <h2 className="sm-section-title">// aficiones</h2>
              <div className="sm-tags">
                {["🎹 Piano", "📚 Lectura", "🎮 Videojuegos"].map(a => (
                  <span key={a} className="sm-tag sm-tag--dim">{a}</span>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
