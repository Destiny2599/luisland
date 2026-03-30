import { useState } from "react";

// ── Bloque de contenido ───────────────────────────────────────────────────────
export function Bloque({ bloque }) {
  if (bloque.tipo === "texto") {
    return <p className="ll-guia-texto">{bloque.texto}</p>;
  }

  return (
    <div className="ll-guia-paso">
      {bloque.titulo && (
        <h3 className="ll-guia-paso-titulo">{bloque.titulo}</h3>
      )}
      {bloque.texto && (
        <p className="ll-guia-texto">{bloque.texto}</p>
      )}
      {bloque.codigo && (
        <pre className="ll-guia-code"><code>{bloque.codigo}</code></pre>
      )}
    </div>
  );
}

// ── Acordeón ──────────────────────────────────────────────────────────────────
// Recibe un array de secciones con esta forma:
// [
//   {
//     titulo: "Mi sección",
//     contenido: [
//       { tipo: "texto", texto: "Descripción..." },
//       { tipo: "paso", titulo: "Paso 1", texto: "...", codigo: "..." },
//     ]
//   }
// ]
export default function Acordeon({ secciones }) {
  const [abierto, setAbierto] = useState(null);

  const toggle = (i) => setAbierto(abierto === i ? null : i);

  return (
    <div className="ll-acordeon-lista">
      {secciones.map((sec, i) => (
        <div
          key={i}
          className={`ll-acordeon ${abierto === i ? "ll-acordeon--abierto" : ""}`}
        >
          <button className="ll-acordeon-header" onClick={() => toggle(i)}>
            <span className="ll-acordeon-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="ll-acordeon-titulo">{sec.titulo}</span>
            <span className={`ll-acordeon-chevron ${abierto === i ? "open" : ""}`}>›</span>
          </button>

          {abierto === i && (
            <div className="ll-acordeon-body">
              {sec.contenido.map((bloque, j) => (
                <Bloque key={j} bloque={bloque} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}