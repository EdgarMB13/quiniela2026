import { registrarVisita } from "./firebase.js";
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

  cargarDatos().then(() => {
  cargarPronosticos();
});

registrarVisita().then(total => {
  const contador = document.getElementById("contadorVisitas");
  if (contador) {
    contador.textContent = total;
  }
});
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
  { grupo: "Grupo D", partido: "Paraguay vs Turquía" },
  { grupo: "Grupo F", partido: "Países Bajos vs Suecia" },
  { grupo: "Grupo E", partido: "Alemania vs Costa de Marfil" },
  { grupo: "Grupo E", partido: "Curazao vs Ecuador" },
  { grupo: "Grupo F", partido: "Japón vs Túnez" },

  { grupo: "Grupo H", partido: "España vs Arabia Saudita" },
  { grupo: "Grupo G", partido: "Bélgica vs Irán" },
  { grupo: "Grupo H", partido: "Cabo Verde vs Uruguay" },
  { grupo: "Grupo G", partido: "Egipto vs Nueva Zelanda" },

  { grupo: "Grupo J", partido: "Argentina vs Austria" },
  { grupo: "Grupo I", partido: "Francia vs Irak" },
  { grupo: "Grupo I", partido: "Senegal vs Noruega" },
  { grupo: "Grupo J", partido: "Argelia vs Jordania" },

  { grupo: "Grupo K", partido: "Portugal vs Uzbekistán" },
  { grupo: "Grupo L", partido: "Inglaterra vs Ghana" },
  { grupo: "Grupo L", partido: "Croacia vs Panamá" },
  { grupo: "Grupo K", partido: "RD Congo vs Colombia" },

  { grupo: "Grupo B", partido: "Canadá vs Suiza" },
  { grupo: "Grupo B", partido: "Bosnia y Herzegovina vs Qatar" },
  { grupo: "Grupo C", partido: "Brasil vs Escocia" },
  { grupo: "Grupo C", partido: "Marruecos vs Haití" },

  { grupo: "Grupo A", partido: "México vs Chequia" },
  { grupo: "Grupo A", partido: "Sudáfrica vs Corea del Sur" },
  { grupo: "Grupo E", partido: "Curazao vs Costa de Marfil" },
  { grupo: "Grupo E", partido: "Alemania vs Ecuador" },

  { grupo: "Grupo F", partido: "Japón vs Suecia" },
  { grupo: "Grupo F", partido: "Países Bajos vs Túnez" },
  { grupo: "Grupo D", partido: "Estados Unidos vs Turquía" },
  { grupo: "Grupo D", partido: "Paraguay vs Australia" },

  { grupo: "Grupo I", partido: "Francia vs Noruega" },
  { grupo: "Grupo I", partido: "Senegal vs Irak" },
  { grupo: "Grupo H", partido: "Cabo Verde vs Arabia Saudita" },
  { grupo: "Grupo H", partido: "España vs Uruguay" },

  { grupo: "Grupo G", partido: "Egipto vs Irán" },
  { grupo: "Grupo G", partido: "Bélgica vs Nueva Zelanda" },
  { grupo: "Grupo L", partido: "Inglaterra vs Panamá" },
  { grupo: "Grupo L", partido: "Croacia vs Ghana" },

  { grupo: "Grupo K", partido: "Portugal vs Colombia" },
  { grupo: "Grupo K", partido: "RD Congo vs Uzbekistán" },
  { grupo: "Grupo J", partido: "Argelia vs Austria" },
  { grupo: "Grupo J", partido: "Argentina vs Jordania" }
];

//FUNCION MOSTRAR QUINIELA 

function mostrarQuiniela(nombre) {

  const contenedor = document.getElementById("quinielaJugador");

  if (!contenedor) return;

  const persona = pronosticos.find(
    p => p.participante === nombre
  );

  if (!persona) return;

  contenedor.innerHTML = "";

  const grupos = agruparPorGrupo(partidosInfo);
// agrego nueva instruccion

  const ordenGrupos = [
  "Grupo A", "Grupo B", "Grupo C", "Grupo D",
  "Grupo E", "Grupo F", "Grupo G", "Grupo H",
  "Grupo I", "Grupo J", "Grupo K", "Grupo L"
];

ordenGrupos.forEach(grupo => {
  if (!grupos[grupo]) return;

    const bloqueGrupo = document.createElement("div");
    bloqueGrupo.className = "grupo-completo";

    bloqueGrupo.innerHTML = `
      <h3>${grupo}</h3>
    `;

    grupos[grupo].forEach(partido => {
//
const pronostico = (persona.jugadas[partido.index] || "").trim().toUpperCase();
// MODIFICADO 17 JUNIO
const resultado = (resultadosOficiales[partido.index] || "").trim().toUpperCase();

let estado = "pendiente";

if (resultado !== "") {
  estado = pronostico === resultado ? "acierto" : "error";
}

const tarjeta = document.createElement("div");

tarjeta.className = `partido-pronostico ${estado}`;

tarjeta.innerHTML = `
  <p>${partido.partido}</p>
  <small>Resultado: ${resultado || "Pendiente"}</small>

  <div class="opciones-pronostico">
    <span class="${pronostico === "L" ? "seleccionado" : ""}">L</span>
    <span class="${pronostico === "E" ? "seleccionado" : ""}">E</span>
    <span class="${pronostico === "V" ? "seleccionado" : ""}">V</span>
  </div>
`;
//
      bloqueGrupo.appendChild(tarjeta);
    });

    contenedor.appendChild(bloqueGrupo);

  });

}


// EMPIEZA 
function agruparPorGrupo(partidos) {
  const grupos = {};

  partidos.forEach((partido, index) => {
    if (!grupos[partido.grupo]) {
      grupos[partido.grupo] = [];
    }

    grupos[partido.grupo].push({
      ...partido,
      index
    });
  });

  return grupos;
}

//

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZ907S2ZHaBBwKfbll6-AOVt6pwYuUHE4U-O48D4utO8Avi7YUrEuTNnXbXT9sRlGUETmvEsU7ZkHF/pub?gid=521377650&single=true&output=csv";

let participantes = [];

//agrregue esta linea
let resultadosOficiales = [];

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
//agregada esta linea 17 de junio
  resultadosOficiales = filas[1].slice(6);
  
  participantes = filas.slice(1).map(fila => ({
  participante: fila[0],
  aciertos: fila[1],
  errores: fila[2],
  puntos: fila[3],
  efectividad: fila[4],
  posicion: fila[5],
  // quite esta instruccion 17 de junio resultados: fila.slice(6)
}));
//
  
  llenarSelector();
  mostrarRanking();

  if (participantes.length > 0) {
    mostrarParticipante(participantes[0].participante);
  }
}

// foro agregado

let publicaciones =
    JSON.parse(localStorage.getItem("foroQuiniela")) || [];

function guardarPosts(){
    localStorage.setItem(
        "foroQuiniela",
        JSON.stringify(publicaciones)
    );
}

function mostrarPosts(){

    const lista =
        document.getElementById("listaPosts");

    lista.innerHTML = "";

    publicaciones
        .slice()
        .reverse()
        .forEach(post => {

            lista.innerHTML += `
                <div class="post">
                    <h3>${post.titulo}</h3>

                    <small>
                        ${post.fecha}
                    </small>

                    <p>${post.contenido}</p>
                </div>
            `;
        });
}

function crearPost(){

    const titulo =
        document.getElementById("tituloPost").value.trim();

    const contenido =
        document.getElementById("contenidoPost").value.trim();

    if(!titulo || !contenido){

        alert(
            "Debes escribir un título y contenido."
        );

        return;
    }

    publicaciones.push({
        titulo,
        contenido,
        fecha: new Date().toLocaleString()
    });

    guardarPosts();

    document.getElementById("tituloPost").value = "";
    document.getElementById("contenidoPost").value = "";

    mostrarPosts();
}

if (document.getElementById("listaPosts")) {
  mostrarPosts();
}

/////////////////////////////// foro

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
