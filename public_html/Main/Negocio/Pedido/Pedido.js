// Pedido.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPedido");
    const resumen = document.getElementById("resumen");

    // 1. Leer el parámetro ?lote= de la URL
    const params = new URLSearchParams(window.location.search);
    let lote = params.get("lote");

    if (!lote) {
        alert("No se especificó ningún lote. Regresando...");
        window.history.back();
        return;
    }

    // Mostrar el lote con formato bonito: cobb500 -> COBB 500
    document.getElementById("nombreLote").textContent =
        lote.replace(/(\d+)/, " $1").toUpperCase();

    // 2. Fecha mínima: mañana (no se puede pedir para hoy)
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaMin = manana.toISOString().split("T")[0];
    document.getElementById("fechaEntrega").min = fechaMin;

    // 3. Validación y envío
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const pedido = {
            lote: lote.toLowerCase(),
            fechaEntrega: document.getElementById("fechaEntrega").value,
            cantidad: parseInt(document.getElementById("cantidad").value),
            presentacion: document.getElementById("presentacion").value,
            pesoMin: parseFloat(document.getElementById("pesoMin").value),
            pesoMax: parseFloat(document.getElementById("pesoMax").value),
            observaciones: document.getElementById("observaciones").value.trim()
        };

        // Validar que el peso mínimo sea menor que el máximo
        if (pedido.pesoMin >= pedido.pesoMax) {
            alert("El peso mínimo debe ser menor que el peso máximo.");
            return;
        }

        // 4. Enviar al servlet (ajústalo según tu mapeo en web.xml)
        fetch("/TalllerWeb/PedidoServlet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        })
        .then(resp => {
            if (!resp.ok) throw new Error("Error en el servidor");
            mostrarResumen(pedido);
        })
        .catch(err => {
            console.error(err);
            // Mientras conectas el servlet, guardamos en localStorage
            guardarLocal(pedido);
            mostrarResumen(pedido);
        });
    });

    function mostrarResumen(p) {
        const fecha = new Date(p.fechaEntrega + "T00:00:00")
                          .toLocaleDateString("es-419", { weekday: "long", day: "numeric", month: "long" });

        resumen.innerHTML =
            `<h2>Pedido registrado</h2>
             <p>Quiero <strong>${p.cantidad} pollos ${p.presentacion.toLowerCase()}</strong>
             para <strong>${fecha}</strong> en pesos promedios de
             <strong>${p.pesoMin} a ${p.pesoMax} kg</strong> (Lote: ${p.lote}).</p>`;
        resumen.hidden = false;
        form.reset();
        window.scrollTo(0, document.body.scrollHeight);
    }

    function guardarLocal(p) {
        const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
        pedidos.push({ ...p, fechaRegistro: new Date().toISOString() });
        localStorage.setItem("pedidos", JSON.stringify(pedidos));
    }
});

