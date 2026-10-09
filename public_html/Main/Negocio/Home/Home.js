/* ============================================================
   GRANJA POLLÓN — Home.js
   Portal mayorista: pizarra de precios y lotes
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ============================================================
       0. GUARDIÁN DE SESIÓN (preparado para producción)
       Cuando tenga su API, descomente y valide el token real:
         const sesion = sessionStorage.getItem('gp_token');
         if (!sesion) { window.location.href = '../Login/Login.html'; return; }
       ============================================================ */

    /* ============================================================
       1. REFERENCIAS
       ============================================================ */
    const grid        = document.getElementById('grid-ofertas');
    const cards       = Array.from(grid.querySelectorAll('.card-oferta'));
    const inputBuscar = document.getElementById('input-buscar');
    const selectCat   = document.getElementById('select-categoria');
    const selectOrden = document.getElementById('select-orden');
    const countEl     = document.getElementById('resultados-count');
    const emptyState  = document.getElementById('empty-state');
    const btnLimpiar  = document.getElementById('btn-limpiar');
    const header      = document.getElementById('header-dashboard');
    const menuToggle  = document.getElementById('menu-toggle');
    const navDash     = document.getElementById('nav-dashboard');

    /* ============================================================
       2. HORA REAL DE ACTUALIZACIÓN DE LA PIZARRA
       ============================================================ */
    const horaEl = document.getElementById('hora-actualizacion');
    function pintarHora() {
        const ahora = new Date();
        horaEl.textContent = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    }
    pintarHora();
    setInterval(pintarHora, 30000); // refresca cada 30 segundos

    /* ============================================================
       3. HEADER: SOMBRA AL HACER SCROLL + MENÚ MÓVIL
       ============================================================ */
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    menuToggle.addEventListener('click', () => {
        const abierto = navDash.classList.toggle('activo');
        menuToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    navDash.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => navDash.classList.remove('activo'))
    );

    /* ============================================================
       4. BÚSQUEDA INSENSIBLE A TILDES + FILTRO + ORDENAMIENTO
       ============================================================ */
    const normalizar = (s) =>
        s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    function aplicarFiltros() {
        const texto = normalizar(inputBuscar.value.trim());
        const categoria = selectCat.value;

        const visibles = cards.filter((card) => {
            const titulo = normalizar(card.querySelector('h3').textContent);
            const descripcion = normalizar(card.querySelector('.desc-producto').textContent);
            const coincideTexto = !texto || titulo.includes(texto) || descripcion.includes(texto);
            const coincideCat = categoria === 'todos' || card.dataset.categoria === categoria;
            return coincideTexto && coincideCat;
        });

        // Ordenamiento
        const orden = selectOrden.value;
        visibles.sort((a, b) => {
            switch (orden) {
                case 'precio-asc':  return parseFloat(a.dataset.precio) - parseFloat(b.dataset.precio);
                case 'precio-desc': return parseFloat(b.dataset.precio) - parseFloat(a.dataset.precio);
                case 'nombre':      return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent, 'es');
                default:            return 0; // relevancia = orden original del DOM
            }
        });

        // Pintar: ocultamos todas y re-append en el orden resultante
        cards.forEach(c => { c.style.display = 'none'; });
        visibles.forEach(c => {
            c.style.display = 'flex';
            grid.appendChild(c); // reordena en el DOM
        });

        // Contador y estado vacío
        const n = visibles.length;
        countEl.textContent = n === 1 ? '1 lote disponible' : `${n} lotes disponibles`;
        emptyState.hidden = n !== 0;
        grid.style.display = n === 0 ? 'none' : '';
    }

    inputBuscar.addEventListener('input', aplicarFiltros);
    selectCat.addEventListener('change', aplicarFiltros);
    selectOrden.addEventListener('change', aplicarFiltros);

    btnLimpiar.addEventListener('click', () => {
        inputBuscar.value = '';
        selectCat.value = 'todos';
        selectOrden.value = 'relevancia';
        aplicarFiltros();
        inputBuscar.focus();
    });

    aplicarFiltros(); // estado inicial

    /* ============================================================
       5. ANIMACIONES DE ENTRADA (tarjetas y secciones)
       ============================================================ */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.stagger, .reveal').forEach(el => observer.observe(el));

    /* ============================================================
       6. CIERRE DE SESIÓN CON MODAL (reemplaza confirm())
       ============================================================ */
    const modal       = document.getElementById('modal-logout');
    const btnLogout   = document.getElementById('btn-logout');
    const btnCancelar = document.getElementById('btn-cancelar-logout');
    const btnConfirmar = document.getElementById('btn-confirmar-logout');

    function abrirModal() {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        btnCancelar.focus();
    }
    function cerrarModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        btnLogout.focus();
    }

    btnLogout.addEventListener('click', abrirModal);
    btnCancelar.addEventListener('click', cerrarModal);

    // Clic fuera del modal lo cierra
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

    // Tecla Escape lo cierra
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) cerrarModal();
    });

    btnConfirmar.addEventListener('click', () => {
        // Producción: sessionStorage.removeItem('gp_token'); + llamada a /api/auth/logout
        window.location.href = '../Login/Login.html';
    });
});