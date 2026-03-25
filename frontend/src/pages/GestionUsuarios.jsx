import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API   = "http://localhost:8080/api/admin/usuarios";
const ROLES = ["ADMIN", "DEVELOPER", "VISITANTE"];

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ── Badge de rol (con variante Master) ───────────────────────────────────────
function RolBadge({ rol, esMaster }) {
  const colores = {
    ADMIN:     "ll-badge--admin",
    DEVELOPER: "ll-badge--dev",
    VISITANTE: "ll-badge--vis",
  };

  return (
    <span className={`ll-badge ${colores[rol] ?? ""}`}>
      {rol}
      {esMaster && <span className="ll-badge-master"> · MASTER</span>}
    </span>
  );
}

// ── Modal crear usuario ───────────────────────────────────────────────────────
function ModalCrear({ onClose, onCreado, token }) {
  const [form, setForm]     = useState({ nombre: "", email: "", password: "", rol: "VISITANTE" });
  const [error, setError]   = useState("");
  const [cargando, setCarg] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.nombre || !form.email || !form.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setCarg(true);
    try {
      const res  = await fetch(API, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al crear usuario."); return; }
      onCreado();
      onClose();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCarg(false);
    }
  };

  return (
    <div className="ll-modal-overlay" onClick={onClose}>
      <div className="ll-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ll-modal-header">
          <h2 className="ll-modal-title">
            <span className="ll-hero-eyebrow" style={{ fontSize: "0.75rem" }}>// nuevo registro</span>
            Crear usuario
          </h2>
          <button className="ll-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ll-modal-body">
          {error && <p className="ll-form-error">{error}</p>}

          <div className="ll-form-group">
            <label className="ll-form-label">Nombre</label>
            <input
              className="ll-form-input"
              name="nombre"
              placeholder="Ej: Luis García"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="ll-form-group">
            <label className="ll-form-label">Email</label>
            <input
              className="ll-form-input"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="ll-form-group">
            <label className="ll-form-label">Password</label>
            <input
              className="ll-form-input"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="ll-form-group">
            <label className="ll-form-label">Rol</label>
            <select
              className="ll-form-input ll-form-select"
              name="rol"
              value={form.rol}
              onChange={handleChange}
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="ll-modal-footer">
          <button className="ll-btn ll-btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="ll-btn ll-btn--primary" onClick={handleSubmit} disabled={cargando}>
            {cargando ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal confirmar eliminar ──────────────────────────────────────────────────
function ModalConfirmar({ usuario, onClose, onConfirm }) {
  return (
    <div className="ll-modal-overlay" onClick={onClose}>
      <div className="ll-modal ll-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ll-modal-header">
          <h2 className="ll-modal-title">Eliminar usuario</h2>
          <button className="ll-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ll-modal-body">
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            ¿Seguro que deseas eliminar a{" "}
            <strong style={{ color: "var(--text)" }}>{usuario.nombre}</strong>?
            <br />Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="ll-modal-footer">
          <button className="ll-btn ll-btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="ll-btn ll-btn--danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function GestionUsuarios() {
  const { usuario } = useAuth();

  const [usuarios,    setUsuarios]    = useState([]);
  const [cargando,    setCargando]    = useState(true);
  const [error,       setError]       = useState("");
  const [modalCrear,  setModalCrear]  = useState(false);
  const [modalElim,   setModalElim]   = useState(null);
  const [toastMsg,    setToastMsg]    = useState("");
  const [rolEditando, setRolEditando] = useState({});

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const res  = await fetch(API, { headers: authHeaders(usuario.token) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al cargar usuarios."); return; }
      setUsuarios(data);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, [usuario.token]);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);

  const mostrarToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const eliminarUsuario = async () => {
    const id = modalElim.id;
    setModalElim(null);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: authHeaders(usuario.token),
      });
      const data = await res.json();
      if (!res.ok) { mostrarToast(`❌ ${data.error}`); return; }
      mostrarToast("✅ Usuario eliminado correctamente.");
      cargarUsuarios();
    } catch {
      mostrarToast("❌ No se pudo conectar con el servidor.");
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      const res  = await fetch(`${API}/${id}/rol`, {
        method: "PUT",
        headers: authHeaders(usuario.token),
        body: JSON.stringify({ rol: nuevoRol }),
      });
      const data = await res.json();
      if (!res.ok) { mostrarToast(`❌ ${data.error}`); return; }
      mostrarToast("✅ Rol actualizado correctamente.");
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
      );
      setRolEditando((prev) => { const c = { ...prev }; delete c[id]; return c; });
    } catch {
      mostrarToast("❌ No se pudo conectar con el servidor.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="ll-hero ll-hero--top">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-scanline"  aria-hidden="true" />

      <div className="ll-page-content">

        <div className="ll-page-header">
          <div>
            <p className="ll-hero-eyebrow">// panel de administración</p>
            <h1 className="ll-page-title">
              Gestión de <span className="ll-hero-accent">usuarios</span>
            </h1>
          </div>
          <button className="ll-btn ll-btn--primary" onClick={() => setModalCrear(true)}>
            + Nuevo usuario
          </button>
        </div>

        {cargando && (
          <div className="ll-status-msg">
            <span className="ll-spinner" /> Cargando usuarios...
          </div>
        )}
        {!cargando && error && (
          <div className="ll-status-msg ll-status-msg--error">{error}</div>
        )}

        {!cargando && !error && (
          <div className="ll-table-wrap">
            <table className="ll-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol actual</th>
                  <th>Cambiar rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}

                {usuarios.map((u, i) => {
                  const rolLocal = rolEditando[u.id] ?? u.rol;
                  const cambio   = rolLocal !== u.rol;

                  return (
                    <tr key={u.id} className={u.esMaster ? "ll-table-row--master" : ""}>
                      <td className="ll-table-idx">{String(i + 1).padStart(2, "0")}</td>
                      <td className="ll-table-nombre">
                        {u.nombre}
                        {u.esMaster && <span className="ll-master-label"> ★</span>}
                      </td>
                      <td className="ll-table-email">{u.email}</td>
                      <td><RolBadge rol={u.rol} esMaster={u.esMaster} /></td>

                      {/* Selector de rol — bloqueado si es Master */}
                      <td>
                        {u.esMaster ? (
                          <span className="ll-master-lock">— protegido —</span>
                        ) : (
                          <div className="ll-rol-group">
                            <select
                              className="ll-form-input ll-form-select ll-form-select--sm"
                              value={rolLocal}
                              onChange={(e) =>
                                setRolEditando((prev) => ({ ...prev, [u.id]: e.target.value }))
                              }
                            >
                              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {cambio && (
                              <button
                                className="ll-btn ll-btn--xs ll-btn--primary"
                                onClick={() => cambiarRol(u.id, rolLocal)}
                              >
                                Guardar
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Eliminar — bloqueado si es Master */}
                      <td>
                        {u.esMaster ? (
                          <span className="ll-master-lock">— protegido —</span>
                        ) : (
                          <button
                            className="ll-btn ll-btn--xs ll-btn--danger"
                            onClick={() => setModalElim(u)}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalCrear && (
        <ModalCrear
          token={usuario.token}
          onClose={() => setModalCrear(false)}
          onCreado={() => { cargarUsuarios(); mostrarToast("✅ Usuario creado correctamente."); }}
        />
      )}
      {modalElim && (
        <ModalConfirmar
          usuario={modalElim}
          onClose={() => setModalElim(null)}
          onConfirm={eliminarUsuario}
        />
      )}

      {toastMsg && <div className="ll-toast">{toastMsg}</div>}
    </main>
  );
}