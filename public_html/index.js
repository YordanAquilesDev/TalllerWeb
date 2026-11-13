/* ============================================================
 GRANJA POLLÓN — index.js 
 ============================================================ */
(function () {
    'use strict';


    const cargarComponentes = async () => {
        try {
            await Promise.all([
                fetch("header.html").then(res => res.text()).then(html => document.getElementById("header").innerHTML = html),
                fetch("beneficios.html").then(res => res.text()).then(html => document.getElementById("beneficios").innerHTML = html),
                fetch("productos.html").then(res => res.text()).then(html => {
                    document.getElementById("productos").innerHTML = html;
                    renderizarProductos(); // Inyectamos las tarjetas en el DOM
                }),
                fetch("cobertura.html").then(res => res.text()).then(html => {
                    const el = document.getElementById("cobertura") || document.getElementById("condiciones");
                    if (el)
                        el.innerHTML = html;
                }),
                fetch("afiliacion.html").then(res => res.text()).then(html => {
                    const el = document.getElementById("proceso");
                    if (el)
                        el.innerHTML = html;
                })
            ]);

      
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

    // Base de datos de productos (Objetos)
    const baseDatosProductos = {
        pollos: [
            {
                claseVisual: "pv-pollo1",
                img: "resource/image/huevos_blancos.webp",
                titulo: "Pollo Cobb 500",
                descripcion: "Raza de alto rendimiento en pechuga y peso. La opción predilecta de las pollerías a la brasa por su excelente proporción de carne.",
                uso: "pollerías, restaurantes y camales.",
                formato: "vivo o limpio beneficiado."
            },
            {
                claseVisual: "pv-pollo2",
                img: "resource/image/huevos_blancos.webp",
                titulo: "Pollo Ross 308",
                descripcion: "Crecimiento uniforme y conformación robusta. Destaca por su versatilidad de corte y su retención de jugosidad en cocción.",
                uso: "mercados mayoristas y catering.",
                formato: "vivo o limpio beneficiado."
            },
            {
                claseVisual: "pv-pollo3",
                img: "resource/image/huevos_blancos.webp",
                titulo: "Pollo Acros",
                descripcion: "Línea rústica de alta resistencia. Excelente firmeza de la fibra muscular, muy cotizada en mercados regionales.",
                uso: "distribución tradicional y minorista.",
                formato: "en pie (vivo)."
            }
        ],
        huevos: [
            {
                claseVisual: "pv-huevo1",
                img: "resource/image/huevos_pardos.webp",
                titulo: "Huevo pardo especial",
                descripcion: "Cáscara gruesa con pigmentación café uniforme. Yema de color intenso, ideal para repostería y consumo directo.",
                calibres: "extra, especial y primera.",
                presentacion: "jaba de 30 docenas (360 unidades)."
            },
            {
                claseVisual: "pv-huevo2",
                img: "resource/image/huevos_rosa.jpg",
                titulo: "Huevo rosado selección",
                descripcion: "Excelente consistencia de clara y cáscara resistente al transporte de larga distancia. Máxima protección de su inversión.",
                calibres: "especial y primera.",
                presentacion: "jaba estándar empacada."
            },
            {
                claseVisual: "pv-huevo3",
                img: "resource/image/huevos_blancos.webp",
                titulo: "Huevo blanco calibrado",
                descripcion: "Producción de gallina liviana. Cáscara limpia y rendimiento constante para la industria alimentaria.",
                calibres: "estándar comercial.",
                presentacion: "jaba por mayor."
            }
        ]
    };

   // Función para renderizar los productos dinámicamente
    function renderizarProductos() {
        // 1. Renderizar Pollos
        const contenedorPollos = document.getElementById("grid-pollos");
        if (contenedorPollos) {
            contenedorPollos.innerHTML = "";
            baseDatosProductos.pollos.forEach(item => {
                contenedorPollos.innerHTML += `
          <article class="card-producto">
              
              ${item.img ? `<img src="${item.img}" alt="${item.titulo}" class="img-producto">` : ''}
              <div class="card-body">
                  <span class="tag-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Cotización con sesión iniciada</span>
                  <h3>${item.titulo}</h3>
                  <p class="desc-corta">${item.descripcion}</p>
                  <ul class="specs">
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg><span><strong>Uso ideal:</strong> ${item.uso}</span></li>
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg><span><strong>Formato:</strong> ${item.formato}</span></li>
                  </ul>
              </div>
          </article>
        `;
            });
        }

        // 2. Renderizar Huevos
        const contenedorHuevos = document.getElementById("grid-huevos");
        if (contenedorHuevos) {
            contenedorHuevos.innerHTML = "";
            baseDatosProductos.huevos.forEach(item => {
                contenedorHuevos.innerHTML += `
          <article class="card-producto">          
              ${item.img ? `<img src="${item.img}" alt="${item.titulo}" class="img-producto">` : ''}
              <div class="card-body">
                  <span class="tag-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Cotización con sesión iniciada</span>
                  <h3>${item.titulo}</h3>
                  <p class="desc-corta">${item.descripcion}</p>
                  <ul class="specs">
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg><span><strong>Calibres:</strong> ${item.calibres}</span></li>
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg><span><strong>Presentación:</strong> ${item.presentacion}</span></li>
                  </ul>
              </div>
          </article>
        `;
            });
        }
    }

    // Funciones independientes
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
        if (!header)
            return;
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
        window.addEventListener('scroll', onScroll, {passive: true});
        onScroll();
    }

    function iniciarEfectoReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger')
                .forEach(el => observer.observe(el));
    }

    function iniciarContadores() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting)
                    return;
                const el = e.target;
                const target = parseInt(el.dataset.target, 10);
                const dur = 1500;
                const start = performance.now();

                const tick = (now) => {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(target * eased);
                    if (p < 1)
                        requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        }, {threshold: 0.7});

        document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
    }

    function iniciarMarquee() {
        const track = document.getElementById('marquee-track');
        if (track)
            track.innerHTML += track.innerHTML;
    }

    function iniciarFaq() {
        document.querySelectorAll('.item-faq').forEach(d => {
            d.addEventListener('toggle', () => {
                if (d.open) {
                    document.querySelectorAll('.item-faq[open]').forEach(o => {
                        if (o !== d)
                            o.open = false;
                    });
                }
            });
        });
    }

   
    cargarComponentes();

})();