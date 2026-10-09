/* ============================================================
   GRANJA POLLÓN — Login.js
   Lógica del portal de clientes mayoristas
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ---------- referencias ---------- */
    const loginForm   = document.getElementById('login-form');
    const loginCard   = document.getElementById('login-card');
    const loginAlert  = document.getElementById('login-alert');
    const correoInput = document.getElementById('correo');
    const passwordInput = document.getElementById('password');
    const correoError = document.getElementById('correo-error');
    const passwordError = document.getElementById('password-error');
    const togglePwBtn = document.getElementById('toggle-pw');
    const recordarChk = document.getElementById('recordar');
    const forgotLink  = document.getElementById('forgot-link');
    const btnLogin    = document.getElementById('btn-login');
    const btnText     = btnLogin.querySelector('.btn-text');
    const btnSpinner  = btnLogin.querySelector('.btn-spinner');

    const REDIRECT_URL = '../Negocio/Home/Home.html';
    const STORAGE_KEY  = 'gp_usuario_recordado';

    // Credenciales de demostración (solo para pruebas locales)
    const DEMO = { usuario: 'demo@granjapollon.pe', password: '12345678' };

    /* ---------- helpers ---------- */
    function setLoading(loading) {
        btnLogin.disabled = loading;
        btnSpinner.hidden = !loading;
        btnText.textContent = loading ? 'Autenticando…' : 'Iniciar sesión';
    }

    function showAlert(type, message) {
        loginAlert.className = 'login-alert'; // reinicia para re-disparar la animación
        void loginAlert.offsetWidth;          // reflow
        loginAlert.classList.add(type);
        loginAlert.textContent = message;
    }

    function clearAlerts() {
        loginAlert.className = 'login-alert';
        loginAlert.textContent = '';
        loginCard.classList.remove('shake');
    }

    function setFieldError(input, errorEl, message) {
        errorEl.textContent = message || '';
        input.classList.toggle('input-error', Boolean(message));
    }

    /* ---------- mostrar / ocultar contraseña (iconos SVG) ---------- */
    togglePwBtn.addEventListener('click', () => {
        const mostrar = passwordInput.type === 'password';
        passwordInput.type = mostrar ? 'text' : 'password';
        togglePwBtn.querySelector('.icon-eye').hidden = mostrar;
        togglePwBtn.querySelector('.icon-eye-off').hidden = !mostrar;
        togglePwBtn.setAttribute('aria-label', mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña');
        togglePwBtn.setAttribute('aria-pressed', String(mostrar));
        passwordInput.focus();
    });

    /* ---------- "Recordar mi cuenta": precargar correo guardado ---------- */
    const recordado = localStorage.getItem(STORAGE_KEY);
    if (recordado) {
        correoInput.value = recordado;
        recordarChk.checked = true;
    }

    /* ---------- limpiar errores al escribir ---------- */
    correoInput.addEventListener('input', () => { setFieldError(correoInput, correoError, ''); clearAlerts(); });
    passwordInput.addEventListener('input', () => { setFieldError(passwordInput, passwordError, ''); clearAlerts(); });

    /* ---------- validación del lado del cliente ---------- */
    function validarFormulario() {
        let valido = true;
        const valor = correoInput.value.trim();

        // Acepta correo electrónico o RUC de 11 dígitos
        const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
        const esRuc = /^\d{11}$/.test(valor);

        if (!valor) {
            setFieldError(correoInput, correoError, 'Ingrese su correo o RUC.');
            valido = false;
        } else if (!esCorreo && !esRuc) {
            setFieldError(correoInput, correoError, 'Ingrese un correo válido o un RUC de 11 dígitos.');
            valido = false;
        }

        if (!passwordInput.value) {
            setFieldError(passwordInput, passwordError, 'Ingrese su contraseña.');
            valido = false;
        } else if (passwordInput.value.length < 8) {
            setFieldError(passwordInput, passwordError, 'La contraseña debe tener al menos 8 caracteres.');
            valido = false;
        }

        return valido;
    }

    /* ============================================================
       AUTENTICACIÓN
       ⚠️ MODO DEMO: valida contra credenciales locales.
       En producción, reemplace el contenido de esta función por:

         const res = await fetch('/api/auth/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ usuario, password })
         });
         if (!res.ok) throw new Error('Credenciales incorrectas');
         return res.json();
       ============================================================ */
    async function authenticate(usuario, password) {
        await new Promise(r => setTimeout(r, 1500)); // latencia simulada
        if (usuario === DEMO.usuario && password === DEMO.password) return { ok: true };
        throw new Error('Credenciales incorrectas');
    }

    /* ---------- envío del formulario ---------- */
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAlerts();

        if (!validarFormulario()) return;

        setLoading(true);

        try {
            const usuario = correoInput.value.trim();
            await authenticate(usuario, passwordInput.value);

            // Persistir o borrar el "Recordar mi cuenta"
            if (recordarChk.checked) localStorage.setItem(STORAGE_KEY, usuario);
            else localStorage.removeItem(STORAGE_KEY);

            showAlert('success', 'Acceso concedido. Redirigiendo a su panel de pedidos…');
            btnText.textContent = 'Éxito';
            btnSpinner.hidden = true;

            setTimeout(() => { window.location.href = REDIRECT_URL; }, 1200);
        } catch (err) {
            console.log(err);
            console.log(err);
            console.log(err);
            setLoading(false);
            showAlert('error', 'Credenciales incorrectas. Verifique su usuario y contraseña.');
            loginCard.classList.add('shake');
            passwordInput.select();
        }
    });

    /* ---------- enlace "¿Olvidaste tu contraseña?" ---------- */
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAlert('info', 'Para restablecer su contraseña, contacte a su asesor comercial al 865 232 78.');
    });
});