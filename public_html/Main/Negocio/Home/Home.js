/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
document.addEventListener('DOMContentLoaded', () => {
    const inputBuscar = document.getElementById('input-buscar');
    const selectCategoria = document.getElementById('select-categoria');
    const cards = document.querySelectorAll('.card-oferta');
    const btnLogout = document.getElementById('btn-logout');

    // 1. Filtrado dinámico por texto y categoría
    function filtrarProductos() {
        const textoBusqueda = inputBuscar.value.toLowerCase().trim();
        const categoriaSeleccionada = selectCategoria.value;

        cards.forEach(card => {
            const titulo = card.querySelector('h3').textContent.toLowerCase();
            const descripcion = card.querySelector('.desc-producto').textContent.toLowerCase();
            const categoriaCard = card.getAttribute('data-categoria');

            const coincideTexto = titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
            const coincideCategoria = categoriaSeleccionada === 'todos' || categoriaCard === categoriaSeleccionada;

            if (coincideTexto && coincideCategoria) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    inputBuscar.addEventListener('input', filtrarProductos);
    selectCategoria.addEventListener('change', filtrarProductos);

    // 2. Control de Cierre de Sesión
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('¿Está seguro de que desea cerrar la sesión de su cuenta mayorista?')) {
                // Limpiar variables de sesión y redirigir
                window.location.href = '../Login/Login.html';
            }
        });
    }
});

