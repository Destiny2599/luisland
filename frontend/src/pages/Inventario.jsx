import { useState, useEffect } from "react";
import { getAll, create, update, remove } from "../services/productoService";

// ── Estado inicial del formulario ─────────────────────────────────────────
const FORM_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  cantidad: "",
};

export default function Inventario() {
  const [productos, setProductos]   = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm]             = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando]   = useState(false);
  const [confirmId, setConfirmId]   = useState(null);

  // ── Cargar productos ────────────────────────────────────────────────────
  const cargar = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await getAll();
      setProductos(data);
    } catch {
      setError("No se pudieron cargar los productos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // ── Abrir modal (crear o editar) ────────────────────────────────────────
  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setModalAbierto(true);
  };

  const abrirEditar = (p) => {
    setForm({
      nombre:      p.nombre,
      descripcion: p.descripcion ?? "",
      precio:      p.precio,
      cantidad:    p.cantidad,
    });
    setEditandoId(p.id);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setForm(FORM_VACIO);
    setEditandoId(null);
  };

  // ── Guardar (crear o actualizar) ────────────────────────────────────────
  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = {
        ...form,
        precio:   parseFloat(form.precio),
        cantidad: parseInt(form.cantidad, 10),
      };
      if (editandoId) {
        await update(editandoId, payload);
      } else {
        await create(payload);
      }
      await cargar();
      cerrarModal();
    } catch {
      setError("Error al guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  // ── Eliminar ────────────────────────────────────────────────────────────
  const eliminar = async (id) => {
    try {
      await remove(id);
      await cargar();
    } catch {
      setError("Error al eliminar el producto.");
    } finally {
      setConfirmId(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <main className="container py-5">

      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Inventario de productos</h2>
        <button className="btn btn-primary" onClick={abrirCrear}>
          + Agregar producto
        </button>
      </div>

      {/* Error global */}
      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}

      {/* Tabla */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      ) : productos.length === 0 ? (
        <p className="text-muted">No hay productos registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion || "—"}</td>
                  <td>${parseFloat(p.precio).toFixed(2)}</td>
                  <td>{p.cantidad}</td>
                  <td>
                    {confirmId === p.id ? (
                      <span className="d-flex gap-2">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminar(p.id)}
                        >Confirmar</button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setConfirmId(null)}
                        >Cancelar</button>
                      </span>
                    ) : (
                      <span className="d-flex gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => abrirEditar(p)}
                        >Editar</button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setConfirmId(p.id)}
                        >Eliminar</button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear / editar */}
      {modalAbierto && (
        <>
          <div className="modal-backdrop fade show" onClick={cerrarModal} />
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">
                    {editandoId ? "Editar producto" : "Nuevo producto"}
                  </h5>
                  <button className="btn-close" onClick={cerrarModal} />
                </div>

                <form onSubmit={guardar}>
                  <div className="modal-body d-flex flex-column gap-3">

                    <div>
                      <label className="form-label">Nombre *</label>
                      <input
                        className="form-control"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label">Precio *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={form.precio}
                          onChange={(e) => setForm({ ...form, precio: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Cantidad *</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={form.cantidad}
                          onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={guardando}>
                      {guardando ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </>
      )}

    </main>
  );
}