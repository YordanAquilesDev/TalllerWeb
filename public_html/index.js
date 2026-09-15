/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del Banner Anuncio (Desaparece en 2 segundos)
    const banner = document.getElementById('banner-bienvenida');
    
    if (banner) {
        // Mantiene visible el banner durante 2000 milisegundos (2 segundos)
        setTimeout(() => {
            banner.classList.add('ocultar-banner');
            
            // Elimina el nodo del DOM tras finalizar la animación de transición
            setTimeout(() => {
                banner.remove();
            }, 600); // 600ms para coincidir con la transición CSS
        }, 2000);
    }

    // 2. Control Menú Hamburguesa Responsivo
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav-menu');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('activo');
        });

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('activo');
            });
        });
    }
});

