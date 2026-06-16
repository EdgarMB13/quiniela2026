document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('.section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      sections.forEach(sec => sec.classList.remove('active-section'));

      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.classList.add('active-section');
      }
    });
  });

  cargarDatos();
});

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

  if (participantes.length > 0) {
    mostrarParticipante(participantes[0].participante);
  }
}

function llenarSelector() {
  const selector = document.getElementById("selectorParticipante");

  if (!selector) return;

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

  const efectividadNumero = Number(persona.efectividad.replace(",", "."));
  document.getElementById("efectividad").textContent = `${Math.round(efectividadNumero * 100)}%`;

  document.getElementById("posicion").textContent = persona.posicion;
}
