/* ============================================================
   GRANJA POLLÓN — Afiliacion.js 
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const form       = document.getElementById('form-afiliacion');
    const card       = document.getElementById('registro-card');
    const alertBox   = document.getElementById('registro-alert');
    const exitoPanel = document.getElementById('registro-exito');
    const btnSubmit  = document.getElementById('btn-submit');
    const btnText    = btnSubmit.querySelector('.btn-text');
    const btnSpinner = btnSubmit.querySelector('.btn-spinner');
    const progressBar   = document.getElementById('progress-bar');
    const progressLabel = document.getElementById('progress-label');
    const tipoSelect  = document.getElementById('tipo_documento');
    const rucInput    = document.getElementById('ruc');
    const rucHint     = document.getElementById('ruc-hint');
    const razonInput  = document.getElementById('razon_social');
    const razonHint   = document.getElementById('razon-hint');
    const pwInput     = document.getElementById('password');
    const pwConfirm   = document.getElementById('password_confirm');
    const pwStrength  = document.getElementById('pw-strength');
    const pwLabel     = document.getElementById('pw-label');
    const terminosChk = document.getElementById('terminos');

    const $ = (id) => document.getElementById(id);

    function rucValido(ruc) {
        if (!/^\d{11}$/.test(ruc)) return false;
        const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let suma = 0;
        for (let i = 0; i < 10; i++) suma += parseInt(ruc[i], 10) * pesos[i];
        let digito = 11 - (suma % 11);
        if (digito >= 10) digito -= 10;
        return digito === parseInt(ruc[10], 10);
    }

    function setFieldError(input, message) {
        const errorEl = $(input.id + '-error');
        if (errorEl) errorEl.textContent = message || '';
        input.classList.toggle('input-error', Boolean(message));
        return !message;
    }

    const rucRequerido = () => tipoSelect.value !== 'DNI';
    const razonRequerida = () => tipoSelect.value === 'RUC20';

    function validarCampo(input) {
        const v = input.value.trim();
        switch (input.id) {
            case 'nombre':
            case 'apellido':
                return setFieldError(input, v.length >= 2 ? '' : 'Este campo es obligatorio.');
            case 'dni':
                return setFieldError(input, /^\d{8}$/.test(v) ? '' : 'Ingrese un DNI de 8 dígitos.');
            case 'telefono':
                if (!/^\d{9}$/.test(v)) return setFieldError(input, 'Ingrese un celular de 9 dígitos.');
                return setFieldError(input, v.startsWith('9') ? '' : 'El celular debe iniciar con 9.');
            case 'ruc': {
                if (!v) return setFieldError(input, rucRequerido() ? 'El RUC es obligatorio para este tipo de contribuyente.' : '');
                return setFieldError(input, rucValido(v) ? '' : 'RUC inválido. Verifique los 11 dígitos.');
            }
            case 'razon_social':
                if (!v) return setFieldError(input, razonRequerida() ? 'Ingrese la razón social de la empresa.' : '');
                return setFieldError(input, v.length >= 3 ? '' : 'Nombre demasiado corto.');
            case 'direccion':
                return setFieldError(input, v.length >= 5 ? '' : 'Ingrese una dirección válida.');
            case 'username':
                return setFieldError(input, v.length >= 3 ? '' : 'Ingrese un nombre de usuario válido.');
            case 'password':
                return setFieldError(input, v.length >= 6 ? '' : 'Mínimo 6 caracteres.');
            case 'password_confirm':
                if (!v) return setFieldError(input, 'Confirme su contraseña.');
                return setFieldError(input, v === pwInput.value ? '' : 'Las contraseñas no coinciden.');
            default:
                return true;
        }
    }

    ['dni', 'telefono', 'ruc'].forEach((id) => {
        const input = $(id);
        if (input) {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/\D/g, '');
            });
        }
    });

    function actualizarRequisitos() {
        rucHint.textContent = rucRequerido() ? '(Obligatorio)' : '(Opcional)';
        razonHint.textContent = razonRequerida() ? '(Obligatorio)' : '(Opcional)';
        if (rucInput.value) validarCampo(rucInput);
        if (razonInput.value) validarCampo(razonInput);
        actualizarProgreso();
    }
    tipoSelect.addEventListener('change', actualizarRequisitos);

    document.querySelectorAll('.btn-toggle-pw').forEach((btn) => {
        btn.addEventListener('click', () => {
            const input = $(btn.dataset.target);
            const mostrar = input.type === 'password';
            input.type = mostrar ? 'text' : 'password';
            btn.querySelector('.icon-eye').hidden = mostrar;
            btn.querySelector('.icon-eye-off').hidden = !mostrar;
            input.focus();
        });
    });

    function medirFortaleza(pw) {
        if (!pw) { pwStrength.dataset.nivel = '0'; pwLabel.textContent = ''; return; }
        let puntos = 0;
        if (pw.length >= 8) puntos++;
        if (/\d/.test(pw)) puntos++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) puntos++;
        if (/[^A-Za-z0-9]/.test(pw)) puntos++;
        const nivel = puntos <= 1 ? 1 : puntos === 2 ? 2 : 3;
        pwStrength.dataset.nivel = String(nivel);
        pwLabel.textContent = ['', 'Débil', 'Media', 'Fuerte'][nivel];
    }
    pwInput.addEventListener('input', () => medirFortaleza(pwInput.value));

    const campos = ['nombre', 'apellido', 'dni', 'telefono', 'ruc', 'razon_social', 'direccion', 'username', 'password', 'password_confirm'];

    campos.forEach((id) => {
        const input = $(id);
        if (input) {
            input.addEventListener('input', () => {
                if (input.id === 'password_confirm' || input.id === 'password') {
                    if (pwConfirm.value) validarCampo(pwConfirm);
                }
                actualizarProgreso();
            });
            input.addEventListener('blur', () => {
                if (input.value.trim()) validarCampo(input);
                actualizarProgreso();
            });
        }
    });
    terminosChk.addEventListener('change', () => { $('terminos-error').textContent = ''; actualizarProgreso(); });

    function campoCompleto(id) {
        const input = $(id);
        if (!input) return false;
        if (input.id === 'ruc') return rucRequerido() ? rucValido(input.value.trim()) : true;
        if (input.id === 'razon_social') return razonRequerida() ? input.value.trim().length >= 3 : true;
        return input.value.trim() !== '' && !$(id + '-error').textContent && validarCampo(input);
    }

    function actualizarProgreso() {
        const requeridos = ['nombre', 'apellido', 'dni', 'telefono', 'direccion', 'username', 'password', 'password_confirm'];
        let total = requeridos.length + 1; 
        let listos = 0;
        requeridos.forEach((id) => { if (campoCompleto(id)) listos++; });
        if (terminosChk.checked) listos++;
        const pct = Math.round((listos / total) * 100);
        progressBar.style.width = pct + '%';
        progressLabel.textContent = pct + '% completado';
    }

    async function enviarSolicitud(datos) {
        await new Promise((r) => setTimeout(r, 1800));

        const nuevoUsuario = {
            username: datos.username.trim(),
            password: datos.password,
            perfil: datos.tipo_documento === 'RUC20' ? 'Cliente Corporativo' : 'Cliente Mayorista',
            razonSocial: datos.razon_social.trim() || `${datos.nombre} ${datos.apellido}`,
            ruc: datos.ruc || datos.dni || 'Sin RUC',
            correo: `${datos.username.toLowerCase()}@granja.pe`,
            telefono: `+51 ${datos.telefono}`,
            iniciales: datos.nombre.substring(0, 2).toUpperCase(),
            direccionPrincipal: "Punto de Despacho Principal",
            direccionTexto: datos.direccion
        };

        let baseUsuarios = JSON.parse(localStorage.getItem('gp_usuarios_registrados')) || {};

        if (baseUsuarios[nuevoUsuario.username]) {
            throw new Error('El usuario ya se encuentra registrado.');
        }

        baseUsuarios[nuevoUsuario.username] = {
            password: nuevoUsuario.password,
            perfil: nuevoUsuario.perfil,
            datos: nuevoUsuario
        };

        localStorage.setItem('gp_usuarios_registrados', JSON.stringify(baseUsuarios));
        return { ok: true };
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertBox.className = 'registro-alert';
        alertBox.textContent = '';

        let valido = true;
        let primero = null;
        campos.forEach((id) => {
            const input = $(id);
            if (!input) return;
            if (!input.value.trim() && id === 'ruc' && !rucRequerido()) return;
            if (!input.value.trim() && id === 'razon_social' && !razonRequerida()) return;
            if (!validarCampo(input)) { valido = false; primero = primero || input; }
        });
        if (!terminosChk.checked) {
            $('terminos-error').textContent = 'Debe aceptar los términos para continuar.';
            valido = false;
        }

        if (!valido) {
            alertBox.classList.add('error');
            alertBox.textContent = 'Revise los campos marcados en rojo antes de enviar su solicitud.';
            card.classList.remove('shake');
            void card.offsetWidth;
            card.classList.add('shake');
            if (primero) primero.focus();
            return;
        }

        btnSubmit.disabled = true;
        btnSpinner.hidden = false;
        btnText.textContent = 'Enviando solicitud…';

        try {
            const datos = Object.fromEntries(new FormData(form).entries());
            await enviarSolicitud(datos);

            form.hidden = true;
            document.querySelector('.progress-wrap').hidden = true;
            document.querySelector('.form-terms').hidden = true;
            exitoPanel.hidden = false;
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
            btnSubmit.disabled = false;
            btnSpinner.hidden = true;
            btnText.textContent = 'Enviar solicitud de afiliación';
            alertBox.classList.add('error');
            alertBox.textContent = err.message || 'No pudimos procesar su solicitud.';
        }
    });

    actualizarRequisitos();
    medirFortaleza('');
    actualizarProgreso();
});