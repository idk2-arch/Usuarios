const UsuarioController = {

  async init() {
    await this.cargarUsuarios();
    this._bindEventos();
  },

  async cargarUsuarios() {
    try {
      const usuarios = await UsuarioModel.getAll();
      UsuarioView.renderTabla(usuarios);
    } catch (err) {
      UsuarioView.mostrarToast("❌ " + err.message, "error");
    }
  },

  _bindEventos() {
    document.getElementById("btn-guardar").addEventListener("click", () => this.guardarUsuario());

    document.getElementById("btn-cancelar").addEventListener("click", () => {
      UsuarioView.resetFormulario();
    });

    document.getElementById("tabla-body").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = Number(btn.dataset.id);

      if (btn.classList.contains("btn-edit"))   this.editarUsuario(id);
      if (btn.classList.contains("btn-delete"))  this.eliminarUsuario(id);
    });

    ["nombre", "email", "telefono"].forEach(id => {
      document.getElementById(id).addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.guardarUsuario();
      });
    });
  },

  async guardarUsuario() {
    const datos = UsuarioView.getDatosFormulario();
    const id    = document.getElementById("usuario-id").value;

    if (!datos.nombre) {
      UsuarioView.mostrarToast("⚠️ El nombre es obligatorio.", "error");
      UsuarioView.inputNombre.focus();
      return;
    }
    if (!datos.email || !datos.email.includes("@")) {
      UsuarioView.mostrarToast("⚠️ Escribe un email válido.", "error");
      UsuarioView.inputEmail.focus();
      return;
    }

    UsuarioView.setLoading(true);
    try {
      if (id) {
        await UsuarioModel.update(id, datos);
        UsuarioView.mostrarToast("✅ Usuario actualizado correctamente.", "success");
      } else {
        await UsuarioModel.create(datos);
        UsuarioView.mostrarToast("✅ Usuario creado correctamente.", "success");
      }
      UsuarioView.resetFormulario();
      await this.cargarUsuarios();
    } catch (err) {
      UsuarioView.mostrarToast("❌ " + err.message, "error");
    } finally {
      UsuarioView.setLoading(false);
    }
  },

  async editarUsuario(id) {
    try {
      const usuario = await UsuarioModel.getOne(id);
      UsuarioView.llenarFormulario(usuario);
      document.getElementById("form-card").scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      UsuarioView.mostrarToast("❌ " + err.message, "error");
    }
  },

  eliminarUsuario(id) {
    const fila   = document.querySelector(`tr[data-id="${id}"]`);
    const nombre = fila?.querySelector("td")?.textContent || "este usuario";

    UsuarioView.mostrarModal(nombre, async () => {
      try {
        await UsuarioModel.delete(id);
        UsuarioView.mostrarToast("🗑️ Usuario eliminado.", "info");
        await this.cargarUsuarios();
      } catch (err) {
        UsuarioView.mostrarToast("❌ " + err.message, "error");
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => UsuarioController.init());