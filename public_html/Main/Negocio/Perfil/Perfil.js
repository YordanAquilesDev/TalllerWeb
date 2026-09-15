/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', () => {
    const formDatos = document.getElementById('form-datos');

    if (formDatos) {
        formDatos.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulación de guardado
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
