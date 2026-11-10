/* ============================================================
   GRANJA POLLÓN — Perfil.js (Dinámico basado en Parámetros URL)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Obtener parámetro de usuario de la URL
    const params = new URLSearchParams(window.location.search);
    const usuarioId = params.get('usuario') || 'U123';

    // Base de datos de perfiles simulados
    const PERFILES_DB = {
        "U123": {
            razonSocial: "Distribuidora Avícola Lima S.A.C.",
            ruc: "20601234567",
            correo: "ventas@avicolalima.pe",
            telefono: "+51 987 654 321",
            badge: "Cliente Mayorista Plus",
            iniciales: "DAL",
            direccionPrincipal: "Camal Municipal Santa Anita - Stand 14",
            direccionTexto: "Av. Rosa Toro 123, Santa Anita, Lima",
            creditoAprobado: "S/ 50,000.00",
            creditoUtilizado: "S/ 12,400.00",
            creditoDisponible: "S/ 37,600.00"
        },
        "aquiles": {
            razonSocial: "Avícola Don Aquiles E.I.R.L.",
            ruc: "20589632145",
            correo: "contacto@donaquiles.com",
            telefono: "+51 912 345 678",
            badge: "Distribuidor Preferencial Norte",
            iniciales: "AQ",
            direccionPrincipal: "Mercado Central Mayorista - Puesto 08",
            direccionTexto: "Av. Universitaria 450, Los Olivos, Lima",
            creditoAprobado: "S/ 25,000.00",
            creditoUtilizado: "S/ 5,000.00",
            creditoDisponible: "S/ 20,000.00"
        },
        "yordan": {
            razonSocial: "Comercializadora Yordancito S.A.C.",
            ruc: "20478523698",
            correo: "yordan@comercializadora.pe",
            telefono: "+51 999 888 777",
            badge: "Cliente Corporativo",
            iniciales: "YD",
            direccionPrincipal: "Centro de Acopio Sur - Local B",
            direccionTexto: "Panamericana Sur Km. 19, Villa El Salvador",
            creditoAprobado: "S/ 40,000.00",
            creditoUtilizado: "S/ 15,000.00",
            creditoDisponible: "S/ 25,000.00"
        }
    };

    const datosCliente = PERFILES_DB[usuarioId] || PERFILES_DB["U123"];

    // Inyectar datos en los inputs y textos del HTML de Perfil
    document.getElementById('razon-social').value = datosCliente.razonSocial;
    document.getElementById('ruc').value = datosCliente.ruc;
    document.getElementById('correo').value = datosCliente.correo;
    document.getElementById('telefono').value = datosCliente.telefono;

    // Actualizar elementos visuales del Sidebar
    const avatarBox = document.querySelector('.avatar-placeholder');
    const tituloSidebar = document.querySelector('.profile-avatar-box h3');
    const userBadge = document.querySelector('.user-badge');

    if (avatarBox) avatarBox.textContent = datosCliente.iniciales;
    if (tituloSidebar) tituloSidebar.textContent = datosCliente.razonSocial;
    if (userBadge) userBadge.textContent = datosCliente.badge;

    // Actualizar direcciones y estados financieros si existen en el DOM
    const dirFuerte = document.querySelector('.address-item strong');
    const dirP = document.querySelector('.address-item p');
    if (dirFuerte) dirFuerte.textContent = datosCliente.direccionPrincipal;
    if (dirP) dirP.textContent = datosCliente.direccionTexto;

    // Propagar el parámetro ?usuario= en los enlaces del menú superior de Perfil
    document.querySelectorAll('.nav-dashboard a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('Contactos')) {
            link.href = `${href}?usuario=${usuarioId}`;
        }
    });

    // Lógica del formulario de guardado
    const formDatos = document.getElementById('form-datos');
    if (formDatos) {
        formDatos.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = formDatos.querySelector('.btn-guardar');
            const originalText = btn.textContent;
            
            btn.textContent = 'Guardando...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.textContent = '¡Cambios Guardados!';
                btn.style.backgroundColor = '#276749';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                }, 2000);
            }, 800);
        });
    }
});