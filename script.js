const inputLugar = document.getElementById("lugar");
const botonBuscar = document.getElementById("buscar");
const resultados = document.getElementById("resultados");

async function buscarLugar() {
    const lugar = inputLugar.value.trim();

    if (!lugar) {
        mostrarMensaje("Ingresa un nombre válido.", true);
        inputLugar.focus();
        return;
    }

    mostrarMensaje("Buscando lugar...");
    botonBuscar.disabled = true;
    botonBuscar.textContent = "Buscando...";

    try {
        const respuesta = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(lugar)}&count=1&language=es&format=json`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar la API");
        }

        const data = await respuesta.json();

        if (!data.results || data.results.length === 0) {
            mostrarMensaje("No se encontró el lugar.", true);
            return;
        }

        const ciudad = data.results[0];

        resultados.innerHTML = `
            <div class="tarjeta-resultado">
                <h2>📌 ${ciudad.name}</h2>

                <ul>
                    <li>
                        <strong>País:</strong>
                        ${ciudad.country ?? "No disponible"}
                    </li>

                    <li>
                        <strong>Estado:</strong>
                        ${ciudad.admin1 ?? "No disponible"}
                    </li>

                    <li>
                        <strong>Latitud:</strong>
                        ${ciudad.latitude}
                    </li>

                    <li>
                        <strong>Longitud:</strong>
                        ${ciudad.longitude}
                    </li>
                </ul>
            </div>
        `;

        console.log(ciudad);
    } catch (error) {
        mostrarMensaje(
            "Ocurrió un error al buscar el lugar. Intenta nuevamente.",
            true
        );

        console.error(error);
    } finally {
        botonBuscar.disabled = false;
        botonBuscar.textContent = "Buscar";
    }
}

function mostrarMensaje(mensaje, esError = false) {
    resultados.innerHTML = `
        <p class="mensaje ${esError ? "mensaje-error" : ""}">
            ${mensaje}
        </p>
    `;
}

botonBuscar.addEventListener("click", buscarLugar);

inputLugar.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        buscarLugar();
    }
});