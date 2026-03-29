import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_ADMIN  = `${import.meta.env.VITE_API_URL}/api/admin/paginas`;
const API_INIT   = `${import.meta.env.VITE_API_URL}/api/admin/paginas/inicializar`;

const NIVELES = ["TODOS", "STANDARD", "DEVELOPER", "ADMIN"];

const NIVEL_INFO = {
  TODOS:     { label: "Todos",     icon: "✓", color: "#e2e8f0", desc: "Acceso libre para cualquier visitante" },
  STANDARD:  { label: "Standard+", icon: "◆", color: "#4ade80", desc: "Requiere cuenta Standard o superior"   },
  DEVELOPER: { label: "Developer+",icon: "⚡", color: "#60a5fa", desc: "Requiere cuenta Developer o superior"  },
  ADMIN:     { label: "Solo Admin", icon: "🔒", color: "#fbbf24", desc: "Acceso exclusivo para administradores" },
};

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ── Slider de permiso ─────────────────────────────────────────────────────────
function SliderPermiso({ permiso, onChange }) {
  const idx = NIVELES.indexOf(permiso);

  return (
    <div className="ll-perm-slider-wrap">
      <div className="ll-perm-slider-labels">
        {NIVELES.map((n, i) => (
          <span
            key={n}
            className={`ll-perm-label ${i === idx ? "active" : ""}`}
            style={{ color: i === idx ? NIVEL_INFO[n].color : "var(--text-muted)" }}
          >
            {NIVEL_INFO[n].icon} {NIVEL_INFO[n].label}
          </span>
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={3}
        value={idx}
        className="ll-perm-range"
        style={{ "--thumb-color": NIVEL_INFO[permiso].color }}
        onChange={(e) => onChange(NIVELES[parseInt(e.target.value)])}
      />
      <p className="ll-perm-desc">{NIVEL_INFO[permiso].desc}</p>
    </div>
  );
}

// ── Item de página ────────────────────────────────────────────────────────────
function ItemPagina({ pagina, permisoLocal, onChange }) {
  const [abierto, setAbierto] = useState(false);
  const info    = NIVEL_INFO[permisoLocal];
  const cambio  = permisoLocal !== pagina.permiso;

  return (
    <div className={`ll-perm-item ${abierto ? "open" : ""} ${cambio ? "ll-perm-item--changed" : ""}`}>
      <button className="ll-perm-item-header" onClick={() => setAbierto(!abierto)}>
        <div className="ll-perm-item-left">
          <span className="ll-perm-item-ruta">{pagina.ruta}</span>
          <span className="ll-perm-item-nombre">{pagina.nombre}</span>
        </div>
        <div className="ll-perm-item-right">
          <span className="ll-perm-badge" style={{ color: info.color, borderColor: info.color }}>
            {info.icon} {info.label}
          </span>
          {cambio && <span className="ll-perm-changed-dot" title="Cambio pendiente" />}
          <span className={`ll-chevron ${abierto ? "open" : ""}`}>›</span>
        </div>
      </button>

      {abierto && (
        <div className="ll-perm-item-body">
          <SliderPermiso permiso={permisoLocal} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

// ── Modal de confirmación ─────────────────────────────────────────────────────
function ModalConfirmar({ cambios, paginas, onClose, onConfirm }) {
  return (
    <div className="ll-modal-overlay" onClick={onClose}>
      <div className="ll-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ll-modal-header">
          <h2 className="ll-modal-title">
            <span className="ll-hero-eyebrow" style={{ fontSize: "0.75rem" }}>// confirmar cambios</span>
            Actualizar permisos
          </h2>
          <button className="ll-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ll-modal-body">
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.85rem" }}>
            Se aplicarán los siguientes cambios:
          </p>
          <div className="ll-perm-cambios-list">
            {Object.entries(cambios).map(([id, nuevoPermiso]) => {
              const pagina        = paginas.find((p) => p.id === id);
              const permisoAntes  = NIVEL_INFO[pagina.permiso];
              const permisoDespues = NIVEL_INFO[nuevoPermiso];
              return (
                <div key={id} className="ll-perm-cambio-row">
                  <span className="ll-perm-cambio-nombre">{pagina.nombre}</span>
                  <div className="ll-perm-cambio-flechas">
                    <span style={{ color: permisoAntes.color }}>{permisoAntes.icon} {permisoAntes.label}</span>
                    <span className="ll-perm-arrow">→</span>
                    <span style={{ color: permisoDespues.color }}>{permisoDespues.icon} {permisoDespues.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ll-modal-footer">
          <button className="ll-btn ll-btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="ll-btn ll-btn--primary" onClick={onConfirm}>Confirmar cambios</button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function GestionPermisos() {
  const { usuario } = useAuth();

  const [paginas,     setPaginas]     = useState([]);
  const [cargando,    setCargando]    = useState(true);
  const [error,       setError]       = useState("");
  const [permsLocal,  setPermsLocal]  = useState({});  // { [id]: permiso }
  const [modal,       setModal]       = useState(false);
  const [toastMsg,    setToastMsg]    = useState("");
  const [guardando,   setGuardando]   = useState(false);

  const mostrarToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const cargarPaginas = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      // Primero inicializa si no existen
      await fetch(API_INIT, { method: "POST", headers: authHeaders(usuario.token) });
      // Luego carga
      const res  = await fetch(API_ADMIN, { headers: authHeaders(usuario.token) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al cargar páginas."); return; }
      setPaginas(data);
      // Inicializa estado local igual al de la BD
      const inicial = {};
      data.forEach((p) => { inicial[p.id] = p.permiso; });
      setPermsLocal(inicial);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, [usuario.token]);

  useEffect(() => { cargarPaginas(); }, [cargarPaginas]);

  // Cambios pendientes — diferencia entre local y BD
  const cambiosPendientes = Object.entries(permsLocal).reduce((acc, [id, val]) => {
    const pagina = paginas.find((p) => p.id === id);
    if (pagina && pagina.permiso !== val) acc[id] = val;
    return acc;
  }, {});

  const hayCAmbios = Object.keys(cambiosPendientes).length > 0;

  const guardarCambios = async () => {
    setModal(false);
    setGuardando(true);
    try {
      await Promise.all(
        Object.entries(cambiosPendientes).map(([id, permiso]) =>
          fetch(`${API_ADMIN}/${id}/permiso`, {
            method: "PUT",
            headers: authHeaders(usuario.token),
            body: JSON.stringify({ permiso }),
          })
        )
      );
      mostrarToast("✅ Permisos actualizados correctamente.");
      cargarPaginas();
    } catch {
      mostrarToast("❌ Error al guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="ll-hero ll-hero--top">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-scanline"  aria-hidden="true" />

      <div className="ll-page-content">

        <div className="ll-page-header">
          <div>
            <p className="ll-hero-eyebrow">// panel de administración</p>
            <h1 className="ll-page-title">
              Gestión de <span className="ll-hero-accent">permisos</span>
            </h1>
          </div>
          {hayCAmbios && (
            <button
              className="ll-btn ll-btn--primary"
              onClick={() => setModal(true)}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : `Guardar cambios (${Object.keys(cambiosPendientes).length})`}
            </button>
          )}
        </div>

        {/* Leyenda */}
        <div className="ll-perm-leyenda">
          {NIVELES.map((n) => (
            <span key={n} className="ll-perm-leyenda-item" style={{ color: NIVEL_INFO[n].color }}>
              {NIVEL_INFO[n].icon} {NIVEL_INFO[n].label}
            </span>
          ))}
        </div>

        {cargando && (
          <div className="ll-status-msg">
            <span className="ll-spinner" /> Cargando páginas...
          </div>
        )}
        {!cargando && error && (
          <div className="ll-status-msg ll-status-msg--error">{error}</div>
        )}

        {!cargando && !error && (
          <div className="ll-perm-list">
            {paginas.map((p) => (
              <ItemPagina
                key={p.id}
                pagina={p}
                permisoLocal={permsLocal[p.id] ?? p.permiso}
                onChange={(val) => setPermsLocal((prev) => ({ ...prev, [p.id]: val }))}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <ModalConfirmar
          cambios={cambiosPendientes}
          paginas={paginas}
          onClose={() => setModal(false)}
          onConfirm={guardarCambios}
        />
      )}

      {toastMsg && <div className="ll-toast">{toastMsg}</div>}
    </main>
  );
}