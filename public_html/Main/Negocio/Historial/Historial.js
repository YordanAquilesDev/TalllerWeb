/* ============================================================
   GRANJA POLLÓN — Historial.js
   ============================================================ */
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const usuarioId = params.get('usuario') || 'U123';

  // Obtener la base de datos de usuarios registrados en el navegador
  function obtenerClientesRegistrados() {
    const baseFija = {
      "U123": { razonSocial: "Distribuidora Avícola Lima S.A.C.", ruc: "20601234567", iniciales: "DA" },
      "aquiles": { razonSocial: "Avícola Don Aquiles E.I.R.L.", ruc: "20589632145", iniciales: "AQ" },
      "yordan": { razonSocial: "Comercializadora Yordancito S.A.C.", ruc: "20478523698", iniciales: "YD" }
    };

    const registrados = JSON.parse(localStorage.getItem('gp_usuarios_registrados')) || {};
    const mapeados = {};

    Object.keys(registrados).forEach(key => {
      mapeados[key] = {
        nombre: registrados[key].datos.razonSocial,
        ruc: registrados[key].datos.ruc,
        iniciales: registrados[key].datos.iniciales || key.substring(0, 2).toUpperCase()
      };
    });

    return { ...baseFija, ...mapeados };
  }

  const CLIENTES_DB = obtenerClientesRegistrados();

  const iniciarHistorial = () => {
    renderizarUsuario();
    
    // Obtener los pedidos exclusivos del usuario desde su localStorage
    const keyStorage = `pedidos_${usuarioId}`;
    const listaPedidos = JSON.parse(localStorage.getItem(keyStorage)) || [];

    renderizarTabla(listaPedidos);
    iniciarFiltros(listaPedidos);
    iniciarModal();
  };

  function renderizarUsuario() {
    const cliente = CLIENTES_DB[usuarioId] || { nombre: usuarioId, ruc: "RUC General", iniciales: "US" };
    const nombreEl = document.querySelector('.user-name');
    const rucEl = document.querySelector('.user-role');
    const avatarEl = document.querySelector('.user-avatar');

    if (nombreEl) nombreEl.textContent = cliente.nombre || cliente.razonSocial;
    if (rucEl) rucEl.textContent = `RUC: ${cliente.ruc}`;
    if (avatarEl) avatarEl.textContent = cliente.iniciales;

    // Mantener la sesión propagando el parámetro usuario en el menú
    document.querySelectorAll('.nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('Contactar')) {
        link.href = `${href.split('?')[0]}?usuario=${usuarioId}`;
      }
    });
  }

  function getBadgeEstado(estado) {
    switch (estado) {
      case 'entregado': return '<span class="status-tag tag-success">Entregado</span>';
      case 'transito': return '<span class="status-tag tag-info">En tránsito</span>';
      case 'pendiente': return '<span class="status-tag tag-warning">Pendiente</span>';
      case 'cancelado': return '<span class="status-tag tag-danger">Cancelado</span>';
      default: return `<span class="status-tag">${estado}</span>`;
    }
  }

  function renderizarTabla(lista) {
    const tbody = document.getElementById("historial-tbody");
    if (!tbody) return;

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--muted);">No tienes pedidos registrados todavía. Realiza tu primer pedido desde el catálogo.</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map(item => `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td>${item.fecha}</td>
        <td>${item.producto}</td>
        <td>${item.cantidad}</td>
        <td class="total-col">S/ ${item.total.toFixed(2)}</td>
        <td>${getBadgeEstado(item.estado)}</td>
        <td>
          <button class="btn-action" onclick="alert('Descargando guía o ticket del pedido ${item.id}...')">Guía / Ticket</button>
        </td>
      </tr>
    `).join('');
  }

  function iniciarFiltros(pedidosBase) {
    const inputBuscar = document.getElementById("input-buscar");
    const selectEstado = document.getElementById("select-estado");
    const countEl = document.getElementById("resultados-count");
    const emptyState = document.getElementById("empty-state");

    const aplicarFiltro = () => {
      const texto = inputBuscar ? inputBuscar.value.toLowerCase().trim() : "";
      const estado = selectEstado ? selectEstado.value : "todos";

      let filtrados = pedidosBase.filter(p => {
        const matchText = p.id.toLowerCase().includes(texto) || p.producto.toLowerCase().includes(texto);
        const matchEstado = (estado === "todos" || p.estado === estado);
        return matchText && matchEstado;
      });

      renderizarTabla(filtrados);

      if (emptyState) emptyState.hidden = filtrados.length > 0;
      if (countEl) countEl.textContent = `Mostrando ${filtrados.length} pedido(s) registrado(s)`;
    };

    if (inputBuscar) inputBuscar.addEventListener("input", aplicarFiltro);
    if (selectEstado) selectEstado.addEventListener("change", aplicarFiltro);
    aplicarFiltro();
  }

  function iniciarModal() {
    const btnLogout = document.getElementById("btn-logout");
    const modal = document.getElementById("modal-logout");
    const btnCancelar = document.getElementById("btn-cancelar-logout");
    const btnConfirmar = document.getElementById("btn-confirmar-logout");

    if (!modal || !btnLogout) return;
    modal.hidden = true;

    btnLogout.addEventListener("click", () => modal.hidden = false);
    if (btnCancelar) btnCancelar.addEventListener("click", () => modal.hidden = true);
    if (btnConfirmar) btnConfirmar.addEventListener("click", () => window.location.href = "../Login/Login.html");

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }

  document.addEventListener("DOMContentLoaded", iniciarHistorial);
})();