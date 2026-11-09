/* ============================================================
   GRANJA POLLÓN — Home.js (Modular y Optimizado)
   ============================================================ */
(function () {
  'use strict';

  // 1. CARGA DE COMPONENTES MEDIANTE FETCH
  const cargarPortal = async () => {
    try {
      await Promise.all([
        fetch("header-home.html").then(res => res.text()).then(html => document.getElementById("header-container").innerHTML = html),
        fetch("kpis-home.html").then(res => res.text()).then(html => document.getElementById("kpis-container").innerHTML = html),
        fetch("pizarra-header.html").then(res => res.text()).then(html => document.getElementById("pizarra-header-container").innerHTML = html),
       // fetch("pizarra-grid.html").then(res => res.text()).then(html => document.getElementById("pizarra-grid-container").innerHTML = html),
        fetch("footer.html").then(res => res.text()).then(html => document.getElementById("footer-container").innerHTML = html),
        fetch("modal-logout.html").then(res => res.text()).then(html => document.getElementById("modal-container").innerHTML = html)
      ]);

      // 2. UNA VEZ CARGADO EL DOM EXTERNO, INICIALIZAMOS LAS INTERACCIONES
      iniciarEfectosVisuales();
      iniciarFiltrosYBusqueda();
      iniciarModalLogout();
      actualizarHoraActual();

    } catch (error) {
      console.error("Error al cargar los componentes del portal:", error);
    }
  };


  // ==========================================
  // FUNCIONES INDEPENDIENTES
  // ==========================================

  function iniciarEfectosVisuales() {
    // Sombra en el header al hacer scroll
    const header = document.querySelector('.header-dashboard');
    if (header) {
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Animaciones Reveal / Stagger
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));
  }

  function actualizarHoraActual() {
    const spanHora = document.getElementById("hora-actualizacion");
    if (spanHora) {
      const ahora = new Date();
      spanHora.textContent = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  function iniciarFiltrosYBusqueda() {
    const inputBuscar = document.getElementById("input-buscar");
    const selectCategoria = document.getElementById("select-categoria");
    const selectOrden = document.getElementById("select-orden");
    const gridOfertas = document.getElementById("grid-ofertas");
    const emptyState = document.getElementById("empty-state");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const resultadosCount = document.getElementById("resultados-count");

    if (!gridOfertas) return;

    const tarjetas = Array.from(gridOfertas.getElementsByClassName("card-oferta"));

    const filtrarYOrdenar = () => {
      const texto = inputBuscar.value.toLowerCase().trim();
      const categoria = selectCategoria.value;
      const orden = selectOrden.value;

      let visibles = 0;

      tarjetas.forEach(card => {
        const titulo = card.querySelector("h3").textContent.toLowerCase();
        const desc = card.querySelector(".desc-producto").textContent.toLowerCase();
        const catCard = card.dataset.categoria;

        const coincideTexto = titulo.includes(texto) || desc.includes(texto);
        const coincideCat = (categoria === "todos" || catCard === categoria);

        if (coincideTexto && coincideCat) {
          card.style.display = "flex";
          visibles++;
        } else {
          card.style.display = "none";
        }
      });

      // Manejo de ordenamiento visual básico
      if (orden === "precio-asc" || orden === "precio-desc") {
        tarjetas.sort((a, b) => {
          const precioA = parseFloat(a.dataset.precio) || 0;
          const precioB = parseFloat(b.dataset.precio) || 0;
          return orden === "precio-asc" ? precioA - precioB : precioB - precioA;
        });
        tarjetas.forEach(card => gridOfertas.appendChild(card));
      } else if (orden === "nombre") {
        tarjetas.sort((a, b) => {
          const nombreA = a.querySelector("h3").textContent;
          const nombreB = b.querySelector("h3").textContent;
          return nombreA.localeCompare(nombreB);
        });
        tarjetas.forEach(card => gridOfertas.appendChild(card));
      }

      // Estado vacío
      if (emptyState) {
        emptyState.hidden = (visibles > 0);
      }
      if (resultadosCount) {
        resultadosCount.textContent = `Mostrando ${visibles} lote(s) disponible(s)`;
      }
    };

    if (inputBuscar) inputBuscar.addEventListener("input", filtrarYOrdenar);
    if (selectCategoria) selectCategoria.addEventListener("change", filtrarYOrdenar);
    if (selectOrden) selectOrden.addEventListener("change", filtrarYOrdenar);

    if (btnLimpiar) {
      btnLimpiar.addEventListener("click", () => {
        inputBuscar.value = "";
        selectCategoria.value = "todos";
        selectOrden.value = "relevancia";
        filtrarYOrdenar();
      });
    }

    filtrarYOrdenar(); // Ejecución inicial
  }

  function iniciarModalLogout() {
    const btnLogout = document.getElementById("btn-logout");
    const modalLogout = document.getElementById("modal-logout");
    const btnCancelar = document.getElementById("btn-cancelar-logout");
    const btnConfirmar = document.getElementById("btn-confirmar-logout");

    if (!modalLogout) return;

    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        modalLogout.hidden = false;
      });
    }

    if (btnCancelar) {
      btnCancelar.addEventListener("click", () => {
        modalLogout.hidden = true;
      });
    }

    if (btnConfirmar) {
      btnConfirmar.addEventListener("click", () => {
        // Redirigir al login principal
        window.location.href = "../Login/Login.html"; 
      });
    }

    // Cerrar haciendo clic fuera del modal
    modalLogout.addEventListener("click", (e) => {
      if (e.target === modalLogout) {
        modalLogout.hidden = true;
      }
    });
  }

  // 3. EJECUCIÓN PRINCIPAL
  cargarPortal();

})();