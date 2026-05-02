
const API_URL = "http://localhost/crud-usuarios/backend/api/usuarios.php";

const UsuarioModel = {

  async getAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
  },

  async getOne(id) {
    const res = await fetch(`${API_URL}?id=${id}`);
    if (!res.ok) throw new Error("Usuario no encontrado");
    return res.json();
  },

  async create(datos) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensaje || "Error al crear usuario");
    return json;
  },

  async update(id, datos) {
    const res = await fetch(`${API_URL}?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensaje || "Error al actualizar usuario");
    return json;
  },

  async delete(id) {
    const res = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensaje || "Error al eliminar usuario");
    return json;
  },
};
