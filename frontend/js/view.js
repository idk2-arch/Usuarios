const UsuarioView = {

  tbody:       document.getElementById("tabla-body"),
  formTitulo:  document.getElementById("form-titulo"),
  inputNombre: document.getElementById("nombre"),
  inputEmail:  document.getElementById("email"),
  inputTel:    document.getElementById("telefono"),
  hiddenId:    document.getElementById("usuario-id"),
  btnGuardar:  document.getElementById("btn-guardar"),
  btnCancelar: document.getElementById("btn-cancelar"),
  toast:       document.getElementById("toast"),

  renderTabla(usuarios) {
    if (usuarios.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="4">
            <div class="empty-state">
              <div class="icon">👥</div>
              <p>No hay usuarios registrados todavía.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    this.tbody.innerHTML = usuarios.map(u => `
      <tr data-id="${u.id}">
        <td>${this._escape(u.nombre)}</td>
        <td><span class="badge-email">${this._escape(u.email)}</span></td>
        <td>${this._escape(u.telefono || "—")}</td>
        <td>
          <button class="action-btn btn-edit"   data-id="${u.id}">✏️ Editar</button>
          <button class="action-btn btn-delete" data-id="${u.id}">🗑️ Eliminar</button>
        </td>
      </tr>
    `).join("");
  },

  llenarFormulario(usuario) {
    this.hiddenId.value    = usuario.id;
    this.inputNombre.value = usuario.nombre;
    this.inputEmail.value  = usuario.email;
    this.inputTel.value    = usuario.telefono || "";
    this.formTitulo.textContent = "✏️ Editar Usuario";
    this.btnCancelar.style.display = "inline-block";
    this.inputNombre.focus();
  },

  resetFormulario() {
    this.hiddenId.value    = "";
    this.inputNombre.value = "";
    this.inputEmail.value  = "";
    this.inputTel.value    = "";
    this.formTitulo.textContent = "➕ Nuevo Usuario";
    this.btnCancelar.style.display = "none";
  },

  getDatosFormulario() {
    return {
      nombre:   this.inputNombre.value.trim(),
      email:    this.inputEmail.value.trim(),
      telefono: this.inputTel.value.trim(),
    };
  },

  setLoading(activo) {
    this.btnGuardar.disabled = activo;
    this.btnGuardar.innerHTML = activo
      ? '<span class="spinner"></span>Guardando...'
      : " Guardar";
  },

  mostrarToast(mensaje, tipo = "success") {
    this.toast.textContent = mensaje;
    this.toast.className   = `show ${tipo}`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.toast.className = "";
    }, 3200);
  },

  mostrarModal(nombre, onConfirmar) {
    const overlay = document.getElementById("modal-overlay");
    document.getElementById("modal-msg").textContent =
      `¿Seguro que quieres eliminar a "${nombre}"? Esta acción no se puede deshacer.`;
    overlay.style.display = "flex";

    const btnConfirmar = document.getElementById("modal-confirmar");
    const btnCancelar  = document.getElementById("modal-cancelar");

    // Clonar para limpiar listeners anteriores
    const nuevoConfirmar = btnConfirmar.cloneNode(true);
    const nuevoCancelar  = btnCancelar.cloneNode(true);
    btnConfirmar.replaceWith(nuevoConfirmar);
    btnCancelar.replaceWith(nuevoCancelar);

    nuevoConfirmar.addEventListener("click", () => {
      this.cerrarModal();
      onConfirmar();
    });
    nuevoCancelar.addEventListener("click", () => this.cerrarModal());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.cerrarModal();
    }, { once: true });
  },

  cerrarModal() {
    document.getElementById("modal-overlay").style.display = "none";
  },

  // ── Utilidades ─────────────────────────────────────────
  _escape(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },
};