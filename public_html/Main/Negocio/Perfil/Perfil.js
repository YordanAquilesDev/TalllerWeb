/* ============================================================
   GRANJA POLLÓN — Perfil.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const usuarioId = params.get('usuario') || 'U123';

    const PERFILES_DB = JSON.parse(localStorage.getItem('gp_usuarios_registrados')) || {};
    
    // Obtenemos el registro bruto del usuario
    const registroUsuario = PERFILES_DB[usuarioId] || PERFILES_DB["U123"];

    // Si los datos están anidados en .datos (provenientes de Afiliacion.js), los unificamos o extraemos
    let datosCliente = {};
    if (registroUsuario) {
        datosCliente = registroUsuario.datos ? { ...registroUsuario.datos, password: registroUsuario.password, perfil: registroUsuario.perfil } : registroUsuario;
    }

    // Referencias de inputs del perfil general
    const inputRazon = document.getElementById('razon-social');
    const inputRuc = document.getElementById('ruc');
    const inputCorreo = document.getElementById('correo');
    const inputTelefono = document.getElementById('telefono');

    // Referencias de inputs de ubicación / dirección
    const inputDirPrincipal = document.getElementById('dir-principal');
    const inputDirTexto = document.getElementById('dir-texto');

    // Inyectar datos en el formulario de perfil
    if (inputRazon)
        inputRazon.value = datosCliente.razonSocial || '';
    if (inputRuc)
        inputRuc.value = datosCliente.ruc || '';
    if (inputCorreo)
        inputCorreo.value = datosCliente.correo || '';
    if (inputTelefono)
        inputTelefono.value = datosCliente.telefono || '';

    // Inyectar datos de ubicación en los inputs
    if (inputDirPrincipal)
        inputDirPrincipal.value = datosCliente.direccionPrincipal || "Punto de Despacho Principal";
    if (inputDirTexto)
        inputDirTexto.value = datosCliente.direccionTexto || "";

    // Actualizar elementos visuales del Sidebar
    const avatarBox = document.querySelector('.avatar-placeholder');
    const tituloSidebar = document.querySelector('.profile-avatar-box h3');
    const userBadge = document.querySelector('.user-badge');

    if (avatarBox)
        avatarBox.textContent = datosCliente.iniciales || 'CL';
    if (tituloSidebar)
        tituloSidebar.textContent = datosCliente.razonSocial || 'Cliente Granja Pollón';
    if (userBadge)
        userBadge.textContent = datosCliente.perfil || datosCliente.badge || 'Cliente Mayorista';

    // Actualizar estados financieros si se muestran en la vista de créditos
    const kpiMontos = document.querySelectorAll('.fin-box strong');
    if (kpiMontos.length >= 3) {
        kpiMontos[0].textContent = datosCliente.creditoAprobado || "S/ 30,000.00";
        kpiMontos[1].textContent = datosCliente.creditoUtilizado || "S/ 0.00";
        kpiMontos[2].textContent = datosCliente.creditoDisponible || "S/ 30,000.00";
    }

    // Propagar el parámetro ?usuario= en los enlaces del menú superior
    document.querySelectorAll('.nav-dashboard a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('Contactos')) {
            link.href = `${href.split('?')[0]}?usuario=${usuarioId}`;
        }
    });

    // Lógica del botón de guardado en Perfil (Datos y Dirección)
    const formDatos = document.getElementById('form-datos');
    if (formDatos) {
        formDatos.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = formDatos.querySelector('.btn-guardar');
            const originalText = btn.textContent;

            btn.textContent = 'Guardando...';
            btn.style.opacity = '0.7';

            // Actualizar los valores actuales
            datosCliente.razonSocial = inputRazon ? inputRazon.value.trim() : datosCliente.razonSocial;
            datosCliente.correo = inputCorreo ? inputCorreo.value.trim() : datosCliente.correo;
            datosCliente.telefono = inputTelefono ? inputTelefono.value.trim() : datosCliente.telefono;

            if (inputDirPrincipal)
                datosCliente.direccionPrincipal = inputDirPrincipal.value.trim();
            if (inputDirTexto)
                datosCliente.direccionTexto = inputDirTexto.value.trim();

            // Guardar de vuelta manteniendo la estructura que espera el sistema
            if (PERFILES_DB[usuarioId] && PERFILES_DB[usuarioId].datos) {
                PERFILES_DB[usuarioId].datos = datosCliente;
            } else {
                PERFILES_DB[usuarioId] = datosCliente;
            }

            localStorage.setItem('gp_usuarios_registrados', JSON.stringify(PERFILES_DB));

            setTimeout(() => {
                btn.textContent = '¡Cambios Guardados!';
                btn.style.backgroundColor = '#276749';

                if (tituloSidebar && inputRazon) {
                    tituloSidebar.textContent = inputRazon.value;
                }

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                }, 2000);
            }, 800);
        });
    }
});