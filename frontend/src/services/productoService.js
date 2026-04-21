const BASE_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

export const getAll = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
};

export const getById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json();
};

export const create = async (producto) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
};

export const update = async (id, producto) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
};

export const remove = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar producto");
};