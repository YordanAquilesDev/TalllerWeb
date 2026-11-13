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

    // Si los datos están anidados en .datos (provenientes de Afiliacion.js), los unificamos
    let datosCliente = {};
    if (registroUsuario) {
        datosCliente = registroUsuario.datos ? { ...registroUsuario.datos, password: registroUsuario.password, perfil: registroUsuario.perfil } : registroUsuario;
    }

   
    document.querySelectorAll('#nav-dashboard a, .nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            // Limpiamos cualquier parámetro anterior y añadimos el usuario actual
            const baseUrl = href.split('?')[0];
            link.href = `${baseUrl}?usuario=${encodeURIComponent(usuarioId)}`;
        }
    });


    const headerNombre = document.querySelector('.header .user-name');
    const headerRuc = document.querySelector('.header .user-role');
    const headerAvatar = document.querySelector('.header .user-avatar');

    if (headerNombre) headerNombre.textContent = datosCliente.razonSocial || 'Cliente Granja Pollón';
    if (headerRuc) headerRuc.textContent = `RUC: ${datosCliente.ruc || 'Sin RUC'}`;
    if (headerAvatar) headerAvatar.textContent = datosCliente.iniciales || 'DA';

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
    const avatarBox = document.querySelector('.profile-sidebar .avatar-placeholder');
    const tituloSidebar = document.querySelector('.profile-avatar-box h3');
    const userBadge = document.querySelector('.user-badge');

    if (avatarBox)
        avatarBox.textContent = datosCliente.iniciales || 'CL';
    if (tituloSidebar)
        tituloSidebar.textContent = datosCliente.razonSocial || 'Cliente Granja Pollón';
    if (userBadge)
        userBadge.textContent = datosCliente.perfil || datosCliente.badge || 'Cliente Mayorista';

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
                if (headerNombre && inputRazon) {
                    headerNombre.textContent = inputRazon.value;
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