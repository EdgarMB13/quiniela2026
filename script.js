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

function parseCSV(texto) {
  const filas = [];
  let fila = [];
  let valor = "";
  let dentroComillas = false;

  for (let i = 0; i < texto.length; i++) {
    const char = texto[i];

    if (char === '"') {
      dentroComillas = !dentroComillas;
    } else if (char === "," && !dentroComillas) {
      fila.push(valor.trim().replace(/^"|"$/g, ""));
      valor = "";
    } else if ((char === "\n" || char === "\r") && !dentroComillas) {
      if (valor || fila.length) {
        fila.push(valor.trim().replace(/^"|"$/g, ""));
        filas.push(fila);
      }
      fila = [];
      valor = "";
    } else {
      valor += char;
    }
  }

  if (valor || fila.length) {
    fila.push(valor.trim().replace(/^"|"$/g, ""));
    filas.push(fila);
  }

  return filas;
}

async function cargarDatos() {
  const respuesta = await fetch(csvUrl);
  const texto = await respuesta.text();

  const filas = parseCSV(texto);

  participantes = filas.slice(1).map(fila => ({
    participante: fila[0],
    aciertos: fila[1],
    errores: fila[2],
    puntos: fila[3],
    efectividad: fila[4],
    posicion: fila[5]
  }));

  llenarSelector();
  mostrarRanking();

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

  const efectividadLimpia = persona.efectividad.replace(",", ".").replace(/"/g, "");
  const efectividadNumero = Number(efectividadLimpia);

  document.getElementById("efectividad").textContent = `${Math.round(efectividadNumero * 100)}%`;
  document.getElementById("posicion").textContent = persona.posicion.replace(/"/g, "");
}
function mostrarRanking() {
  const tabla = document.getElementById("tablaRanking");
  if (!tabla) return;

  tabla.innerHTML = "";

  const ranking = [...participantes].sort((a, b) => Number(a.posicion) - Number(b.posicion));

  ranking.forEach(persona => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${persona.posicion.replace(/"/g, "")}</td>
      <td>${persona.participante}</td>
      <td>${persona.puntos}</td>
    `;

    tabla.appendChild(fila);
  });
}
