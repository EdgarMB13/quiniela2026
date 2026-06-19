// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment
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

export async function registrarVisita() {
  const ref = doc(db, "contador", "visitas");

  await updateDoc(ref, {
    total: increment(1)
  });

  const snap = await getDoc(ref);
  return snap.data().total;
}
