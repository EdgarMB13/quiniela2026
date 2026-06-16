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

const csvPronosticosUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZ907S2ZHaBBwKfbll6-AOVt6pwYuUHE4U-O48D4utO8Avi7YUrEuTNnXbXT9sRlGUETmvEsU7ZkHF/pub?gid=1579027194&single=true&output=csv";

let pronosticos = [];

async function cargarPronosticos() {
  const respuesta = await fetch(csvPronosticosUrl);
  const texto = await respuesta.text();

  const filas = parseCSV(texto);

  pronosticos = filas.slice(1).map(fila => ({
    participante: fila[0],
    jugadas: fila.slice(1)
  }));

  llenarSelectorPronosticos();

  if (pronosticos.length > 0) {
    mostrarQuiniela(pronosticos[0].participante);
  }
}

function llenarSelectorPronosticos() {
  const selector = document.getElementById("selectorPronostico");
  if (!selector) return;

  selector.innerHTML = "";

  pronosticos.forEach(persona => {
    const option = document.createElement("option");
    option.value = persona.participante;
    option.textContent = persona.participante;
    selector.appendChild(option);
  });

  selector.addEventListener("change", () => {
    mostrarQuiniela(selector.value);
  });
}
// MOSTRAR PARTIDOS
const partidosInfo = [
  { grupo: "Grupo A", partido: "México vs Sudáfrica" },
  { grupo: "Grupo A", partido: "Corea del Sur vs Chequia" },
  { grupo: "Grupo B", partido: "Canadá vs Bosnia y Herzegovina" },
  { grupo: "Grupo D", partido: "Estados Unidos vs Paraguay" },
  { grupo: "Grupo B", partido: "Qatar vs Suiza" },
  { grupo: "Grupo C", partido: "Brasil vs Marruecos" },
  { grupo: "Grupo C", partido: "Haití vs Escocia" },
  { grupo: "Grupo D", partido: "Australia vs Turquía" },

  { grupo: "Grupo E", partido: "Alemania vs Curazao" },
  { grupo: "Grupo F", partido: "Países Bajos vs Japón" },
  { grupo: "Grupo E", partido: "Costa de Marfil vs Ecuador" },
  { grupo: "Grupo F", partido: "Suecia vs Túnez" },
  { grupo: "Grupo H", partido: "España vs Cabo Verde" },
  { grupo: "Grupo G", partido: "Bélgica vs Egipto" },
  { grupo: "Grupo H", partido: "Arabia Saudita vs Uruguay" },
  { grupo: "Grupo G", partido: "Irán vs Nueva Zelanda" },

  { grupo: "Grupo I", partido: "Francia vs Senegal" },
  { grupo: "Grupo I", partido: "Irak vs Noruega" },
  { grupo: "Grupo J", partido: "Argentina vs Argelia" },
  { grupo: "Grupo J", partido: "Austria vs Jordania" },
  { grupo: "Grupo K", partido: "Portugal vs RD Congo" },
  { grupo: "Grupo L", partido: "Inglaterra vs Croacia" },
  { grupo: "Grupo L", partido: "Ghana vs Panamá" },
  { grupo: "Grupo K", partido: "Uzbekistán vs Colombia" },

  { grupo: "Grupo A", partido: "Sudáfrica vs Chequia" },
  { grupo: "Grupo B", partido: "Bosnia y Herzegovina vs Suiza" },
  { grupo: "Grupo B", partido: "Canadá vs Qatar" },
  { grupo: "Grupo A", partido: "México vs Corea del Sur" },
  { grupo: "Grupo D", partido: "Estados Unidos vs Australia" },
  { grupo: "Grupo C", partido: "Marruecos vs Escocia" },
  { grupo: "Grupo C", partido: "Brasil vs Haití" },
  { grupo: "Grupo D", partido: "Paraguay vs Turquía" }
];

//FUNCION MOSTRAR QUINIELA 

function mostrarQuiniela(nombre) {
  const contenedor = document.getElementById("quinielaJugador");
  if (!contenedor) return;

  const persona = pronosticos.find(p => p.participante === nombre);
  if (!persona) return;

  contenedor.innerHTML = "";

  partidosInfo.forEach((info, index) => {
    const pronostico = persona.jugadas[index];

    const div = document.createElement("div");
    div.className = "partido-pronostico";

    div.innerHTML = `
      <strong>${info.grupo}</strong>
      <p>${info.partido}</p>
      <div class="opciones-pronostico">
        <span class="${pronostico === "L" ? "seleccionado" : ""}">L</span>
        <span class="${pronostico === "E" ? "seleccionado" : ""}">E</span>
        <span class="${pronostico === "V" ? "seleccionado" : ""}">V</span>
      </div>
    `;

    contenedor.appendChild(div);
  });
}
//

cargarPronosticos();

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
