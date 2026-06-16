document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Quitar clase activa de todos los links
            navLinks.forEach(l => l.classList.remove('active'));
            // Agregar al link seleccionado
            link.classList.add('active');

            // Ocultar todas las secciones
            sections.forEach(sec => sec.classList.remove('active-section'));
            
            // Mostrar sección deseada
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            // HOJA DE POSICIONES DE LOS PARTICIPANTES
            const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZ907S2ZHaBBwKfbll6-AOVt6pwYuUHE4U-O48D4utO8Avi7YUrEuTNnXbXT9sRlGUETmvEsU7ZkHF/pub?gid=521377650&single=true&output=csv";

let participantes = [];

async function cargarDatos() {
  const respuesta = await fetch(csvUrl);
  const texto = await respuesta.text();

  const filas = texto.trim().split("\n").map(fila => fila.split(","));

  participantes = filas.slice(1).map(fila => ({
    participante: fila[0],
    aciertos: fila[1],
    errores: fila[2],
    puntos: fila[3],
    efectividad: fila[4],
    posicion: fila[5]
  }));

  llenarSelector();
  mostrarParticipante(participantes[0].participante);
}

function llenarSelector() {
  const selector = document.getElementById("selectorParticipante");
  selector.innerHTML = "";

  participantes.forEach(persona => {
    const opcion = document.createElement("option");
    opcion.value = persona.participante;
    opcion.textContent = persona.participante;
    selector.appendChild(opcion);
  });

  selector.addEventListener("change", () => {
    mostrarParticipante(selector.value);
  });
}

function mostrarParticipante(nombre) {
  const persona = participantes.find(p => p.participante === nombre);
  if (!persona) return;

  document.getElementById("aciertos").textContent = persona.aciertos;
  document.getElementById("errores").textContent = persona.errores;
  document.getElementById("puntos").textContent = persona.puntos;
  document.getElementById("efectividad").textContent = `${Math.round(Number(persona.efectividad.replace(",", ".")) * 100)}%`;
  document.getElementById("posicion").textContent = persona.posicion;
}

cargarDatos();
            }
        });
    });
});
