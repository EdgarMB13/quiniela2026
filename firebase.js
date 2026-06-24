// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9fx9j-Yh_kun9J0-GbgcDLFHbRQuomyE",
  authDomain: "quiniela-mundialista-202-abbab.firebaseapp.com",
  projectId: "quiniela-mundialista-202-abbab",
  storageBucket: "quiniela-mundialista-202-abbab.firebasestorage.app",
  messagingSenderId: "87378448740",
  appId: "1:87378448740:web:2605f929c357b2b2072a71"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =====================================
// CONTADOR DE VISITAS
// =====================================

export async function registrarVisita() {

  const ref = doc(db, "contador", "visitas");

  await updateDoc(ref, {
    total: increment(1)
  });

  const snap = await getDoc(ref);

  return snap.data().total;

}

// =====================================
// FORO - GUARDAR PUBLICACIONES
// =====================================

export async function guardarPublicacion(
  titulo,
  contenido,
  usuario
) {

  await addDoc(
    collection(db, "publicaciones"),
    {
      titulo,
      contenido,
      usuario,
      fecha: new Date().toLocaleString()
    }
  );

}

// =====================================
// FORO - OBTENER PUBLICACIONES
// =====================================

export async function obtenerPublicaciones() {

  const snapshot = await getDocs(
    collection(db, "publicaciones")
  );

  const publicaciones = [];

  snapshot.forEach(doc => {

    publicaciones.push({
      id: doc.id,
      ...doc.data()
    });

  });

  return publicaciones;

}

// =====================================
// FORO - GUARDAR COMENTARIO
// =====================================

export async function guardarComentario(
  publicacionId,
  usuario,
  texto
) {

  await addDoc(
    collection(
      db,
      "publicaciones",
      publicacionId,
      "comentarios"
    ),
    {
      usuario,
      texto,
      fecha: new Date().toLocaleString()
    }
  );

}

// =====================================
// FORO - OBTENER COMENTARIOS
// =====================================

export async function obtenerComentarios(
  publicacionId
) {

  const snapshot =
    await getDocs(
      collection(
        db,
        "publicaciones",
        publicacionId,
        "comentarios"
      )
    );

  const comentarios = [];

  snapshot.forEach(doc => {

    comentarios.push({
      id: doc.id,
      ...doc.data()
    });

  });

  return comentarios;

}
