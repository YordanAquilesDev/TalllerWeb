(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const usuarioId = params.get('usuario') || 'U123';



    const PRECIO_KG_POLLO = 6.00; // S/ 6.00 por kg
    const PESO_PROMEDIO_POLLO = 2.5; // 2.5 kg por pollo eviscerado

    const PRECIO_KG_HUEVO = 6.00; // S/ 6.00 por kg

    const iniciarPortal = () => {
        renderizarUsuario();
        inicializarFormularios();
        iniciarModalLogout();
    };

    function renderizarUsuario() {
        // 1. Intentar buscar en el localStorage de usuarios registrados (Afiliación)
        const PERFILES_DB = JSON.parse(localStorage.getItem('gp_usuarios_registrados')) || {};
        let clienteEncontrado = null;

        // Buscamos ignorando mayúsculas/minúsculas en el localStorage
        const claveEncontrada = Object.keys(PERFILES_DB).find(
                key => key.toLowerCase() === usuarioId.toLowerCase()
        );

        if (claveEncontrada) {
            const registro = PERFILES_DB[claveEncontrada];
            // Si los datos están anidados en .datos (formato de afiliación)
            const datos = registro.datos || registro;
            clienteEncontrado = {
                nombre: datos.razonSocial || datos.nombreCompleto || usuarioId,
                ruc: datos.ruc || 'Sin RUC',
                iniciales: datos.iniciales || usuarioId.substring(0, 2).toUpperCase()
            };
        } 

        // Referencias del DOM en el Header
        const nombreEl = document.querySelector('.user-name');
        const rucEl = document.querySelector('.user-role');
        const avatarEl = document.querySelector('.user-avatar');

        if (nombreEl)
            nombreEl.textContent = clienteEncontrado.nombre;
        if (rucEl)
            rucEl.textContent = `RUC: ${clienteEncontrado.ruc}`;
        if (avatarEl)
            avatarEl.textContent = clienteEncontrado.iniciales;

        // Propagar el parámetro ?usuario= en los enlaces del menú superior
        document.querySelectorAll('.nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.includes('Contactar')) {
                link.href = `${href.split('?')[0]}?usuario=${usuarioId}`;
            }
        });
    }

    function inicializarFormularios() {
        const hoy = new Date().toISOString().split('T')[0];

        const inputPolloFecha = document.getElementById("pollo-fecha");
        const inputHuevoFecha = document.getElementById("huevo-fecha");
        if (inputPolloFecha)
            inputPolloFecha.value = hoy;
        if (inputHuevoFecha)
            inputHuevoFecha.value = hoy;

        // --- LÓGICA DE POLLO ---
        const inputPolloCant = document.getElementById("pollo-cantidad");
        const totalPolloEl = document.getElementById("pollo-total");
        const formPollo = document.getElementById("form-pollo");

        const calcularPollo = () => {
            const cant = parseInt(inputPolloCant.value) || 0;
            const kilosEstimados = cant * PESO_PROMEDIO_POLLO;
            const total = kilosEstimados * PRECIO_KG_POLLO;
            totalPolloEl.textContent = `S/ ${total.toFixed(2)} (~${kilosEstimados} kg)`;
        };

        if (inputPolloCant) {
            inputPolloCant.addEventListener("input", calcularPollo);
            calcularPollo();
        }

        if (formPollo) {
            formPollo.addEventListener("submit", (e) => {
                e.preventDefault();
                const cant = parseInt(inputPolloCant.value);
                if (cant < 5) {
                    alert("El pedido mínimo es de 5 pollos enteros.");
                    return;
                }
                const fecha = inputPolloFecha.value;
                const kilosEstimados = cant * PESO_PROMEDIO_POLLO;
                const total = kilosEstimados * PRECIO_KG_POLLO;

                guardarPedidoEnHistorial({
                    id: `PED-P-${Math.floor(1000 + Math.random() * 9000)}`,
                    fecha: fecha.split('-').reverse().join('/'),
                    producto: `Pollo Limpio Eviscerado (${cant} unidades)`,
                    cantidad: `${cant} pollos (~${kilosEstimados} kg)`,
                    total: total,
                    estado: "pendiente"
                });
            });
        }

        // --- LÓGICA DE HUEVOS (Por kilos) ---
        const inputHuevoCant = document.getElementById("huevo-cantidad");
        const totalHuevoEl = document.getElementById("huevo-total");
        const formHuevo = document.getElementById("form-huevo");

        const calcularHuevo = () => {
            const kilos = parseFloat(inputHuevoCant.value) || 0;
            const total = kilos * PRECIO_KG_HUEVO;
            totalHuevoEl.textContent = `S/ ${total.toFixed(2)}`;
        };

        if (inputHuevoCant) {
            inputHuevoCant.addEventListener("input", calcularHuevo);
            calcularHuevo();
        }

        if (formHuevo) {
            formHuevo.addEventListener("submit", (e) => {
                e.preventDefault();
                const kilos = parseFloat(inputHuevoCant.value);
                if (kilos < 5) {
                    alert("El pedido mínimo de huevos es de 5 kilos.");
                    return;
                }
                const fecha = inputHuevoFecha.value;
                const total = kilos * PRECIO_KG_HUEVO;

                guardarPedidoEnHistorial({
                    id: `PED-H-${Math.floor(1000 + Math.random() * 9000)}`,
                    fecha: fecha.split('-').reverse().join('/'),
                    producto: `Huevos Frescos por Kilo`,
                    cantidad: `${kilos} kg`,
                    total: total,
                    estado: "pendiente"
                });
            });
        }
    }

    function guardarPedidoEnHistorial(nuevoPedido) {
        const keyStorage = `pedidos_${usuarioId}`;
        const pedidosGuardados = JSON.parse(localStorage.getItem(keyStorage)) || [];
        pedidosGuardados.unshift(nuevoPedido);
        localStorage.setItem(keyStorage, JSON.stringify(pedidosGuardados));

        alert(`¡Pedido ${nuevoPedido.id} registrado correctamente por S/ ${nuevoPedido.total.toFixed(2)}! Te redirigiremos a tu Historial.`);
        window.location.href = `../Historial/Historial.html?usuario=${usuarioId}`;
    }

    function iniciarModalLogout() {
        const btnLogout = document.getElementById("btn-logout");
        const modal = document.getElementById("modal-logout");
        const btnCancelar = document.getElementById("btn-cancelar-logout");
        const btnConfirmar = document.getElementById("btn-confirmar-logout");

        if (!modal || !btnLogout)
            return;
        modal.hidden = true;

        btnLogout.addEventListener("click", () => modal.hidden = false);
        if (btnCancelar)
            btnCancelar.addEventListener("click", () => modal.hidden = true);
        if (btnConfirmar)
            btnConfirmar.addEventListener("click", () => window.location.href = "../../../index.html");

        modal.addEventListener("click", (e) => {
            if (e.target === modal)
                modal.hidden = true;
        });
    }

    document.addEventListener("DOMContentLoaded", iniciarPortal);
})();