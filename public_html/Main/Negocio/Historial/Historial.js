(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const usuarioId = params.get('usuario') || 'U123';

  const CLIENTES_DB = {
    "U123": { nombre: "Distribuidora Avícola Lima", ruc: "20601234567", iniciales: "DA" },
    "aquiles": { nombre: "Avícola Don Aquiles E.I.R.L.", ruc: "20589632145", iniciales: "AQ" },
    "yordan": { nombre: "Comercializadora Yordancito S.A.C.", ruc: "20478523698", iniciales: "YD" }
  };

  const HISTORIAL_BASE = {
    "U123": [
      { id: "PED-8041", fecha: "10/11/2026", producto: "Pollo Vivo - Línea Cobb500", cantidad: "150 jabas", total: 3060.00, estado: "transito" },
      { id: "PED-7982", fecha: "05/11/2026", producto: "Pollo Beneficiado Entero Eviscerado", cantidad: "80 jabas", total: 1564.00, estado: "entregado" }
    ],
    "aquiles": [
      { id: "PED-8050", fecha: "09/11/2026", producto: "Pollo Vivo Selección Especial", cantidad: "300 jabas", total: 7038.00, estado: "transito" }
    ],
    "yordan": [
      { id: "PED-8025", fecha: "07/11/2026", producto: "Huevos Blancos Comerciales Calibre A", cantidad: "40 jabas", total: 6200.00, estado: "pendiente" }
    ]
  };

  const iniciarHistorial = () => {
    renderizarUsuario();
    
    // Obtener pedidos base y combinar con los nuevos pedidos de localStorage
    const keyStorage = `pedidos_${usuarioId}`;
    const pedidosNuevos = JSON.parse(localStorage.getItem(keyStorage)) || [];
    const pedidosBase = HISTORIAL_BASE[usuarioId] || HISTORIAL_BASE["U123"];
    
    const listaCompleta = [...pedidosNuevos, ...pedidosBase];

    renderizarTabla(listaCompleta);
    iniciarFiltros(listaCompleta);
    iniciarModal();
  };

  function renderizarUsuario() {
    const cliente = CLIENTES_DB[usuarioId] || CLIENTES_DB["U123"];
    const nombreEl = document.querySelector('.user-name');
    const rucEl = document.querySelector('.user-role');
    const avatarEl = document.querySelector('.user-avatar');

    if (nombreEl) nombreEl.textContent = cliente.nombre;
    if (rucEl) rucEl.textContent = `RUC: ${cliente.ruc}`;
    if (avatarEl) avatarEl.textContent = cliente.iniciales;

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
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--muted);">No hay pedidos registrados.</td></tr>`;
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
          <button class="btn-action" onclick="alert('Descargando guía del pedido ${item.id}...')">Guía / Ticket</button>
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
      const texto = inputBuscar.value.toLowerCase().trim();
      const estado = selectEstado.value;

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