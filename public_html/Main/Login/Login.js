/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const togglePwBtn = document.getElementById('toggle-pw');
    const loginCard = document.querySelector('.login-card');
    const loginAlert = document.getElementById('login-alert');
    const btnLogin = document.getElementById('btn-login');
    const btnText = btnLogin.querySelector('.btn-text');
    const btnSpinner = btnLogin.querySelector('.btn-spinner');

    // 1. Mostrar / Ocultar Contraseña
    togglePwBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePwBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // 2. Control de Envíos y Animación de Carga
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar alertas previas y estados
        loginAlert.className = 'login-alert';
        loginAlert.textContent = '';
        loginCard.classList.remove('shake');

        // Estado de carga en el botón
        btnText.textContent = 'Autenticando...';
        btnSpinner.hidden = false;
        btnLogin.disabled = true;

        // Simulación de respuesta de API (2 segundos)
        setTimeout(() => {
            const correo = document.getElementById('correo').value;
            const password = passwordInput.value;

            // Ejemplo simple de validación simulada
            if (correo === "demo@granjapollon.pe" && password === "12345678") {
                loginAlert.classList.add('success');
                loginAlert.textContent = '¡Acceso concedido! Redirigiendo a su panel...';
                btnSpinner.hidden = true;
                btnText.textContent = 'Éxito';
                
                // Redirección simulada al panel principal
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 1200);
            } else {
                // Restaurar botón
                btnText.textContent = 'Iniciar Sesión';
                btnSpinner.hidden = true;
                btnLogin.disabled = false;

                // Animación de error (Shake) y mensaje
                loginAlert.classList.add('error');
                loginAlert.textContent = 'Credenciales incorrectas. Verifique su correo y contraseña.';
                loginCard.classList.add('shake');
            }
        }, 1500);
    });
});

