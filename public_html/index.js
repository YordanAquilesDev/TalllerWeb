/* ============================================================
   GRANJA POLLÓN — index.js (Estructura Modular / Separada)
   ============================================================ */
(function () {
  'use strict';

  // 1. CARGA DE COMPONENTES EXTERNOS
  const cargarComponentes = async () => {
    try {
      await Promise.all([
        fetch("header.html").then(res => res.text()).then(html => document.getElementById("header").innerHTML = html),
        fetch("beneficios.html").then(res => res.text()).then(html => document.getElementById("beneficios").innerHTML = html),
        fetch("productos.html").then(res => res.text()).then(html => document.getElementById("productos").innerHTML = html),
        fetch("cobertura.html").then(res => res.text()).then(html => {
          const el = document.getElementById("cobertura") || document.getElementById("condiciones");
          if (el) el.innerHTML = html;
        }),
        fetch("afiliacion.html").then(res => res.text()).then(html => {
          const el = document.getElementById("proceso");
          if (el) el.innerHTML = html;
        })
      ]);

      // Una vez cargado todo el HTML, activamos cada función por separado
      iniciarMenuMovil();
      iniciarSombraHeader();
      iniciarEfectoReveal();
      iniciarContadores();
      iniciarMarquee();
      iniciarFaq();
      iniciarParallaxHero();

    } catch (error) {
      console.error("Error al cargar los componentes:", error);
    }
  };


  // 2. FUNCIONES INDEPENDIENTES (Cada una hace una sola cosa)
  function iniciarMenuMovil() {
    const toggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (toggle && navMenu) {
      toggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }
  }

  function iniciarSombraHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  
//el efecto de  animacion que los componentes  se pesplazan de abajo a arriva 
  function iniciarEfectoReveal() {
    const observer = new IntersectionObserver((entries) => { 
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger')
      .forEach(el => observer.observe(el));
  }


//animacion de  contadores de numero
  function iniciarContadores() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const dur = 1500;
        const start = performance.now();

        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.7 });

    document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
  }


// dublica el carrusel de las direcciones 
  function iniciarMarquee() {
    const track = document.getElementById('marquee-track');  //linea 85: index.html
    if (track) track.innerHTML += track.innerHTML;
  }

// cuando aga click se despliega o se cierra la respuesta a la pregunta clasica
  function iniciarFaq() {  
    document.querySelectorAll('.item-faq').forEach(d => {  // 115 a 141 index.html
      d.addEventListener('toggle', () => {
        if (d.open) {
          document.querySelectorAll('.item-faq[open]').forEach(o => {
            if (o !== d) o.open = false;
          });
        }
      });
    });
  }

  // 3. EJECUCIÓN INICIAL
  cargarComponentes();

})();