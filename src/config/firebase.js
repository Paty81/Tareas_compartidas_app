import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-Nqih1BoiiPz8KKvI-wwpswA_CYmXKus",
  authDomain: "paty81-4eca2.firebaseapp.com",
  projectId: "paty81-4eca2",
  storageBucket: "paty81-4eca2.firebasestorage.app",
  messagingSenderId: "460098885081",
  appId: "1:460098885081:web:e1d39f3e8819242df375c8",
  measurementId: "G-P87F7DBFTD"
};

// Inicializamos la conexión
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en la app
export const auth = getAuth(app);
export const db = getFirestore(app);

// Definimos un ID único para la colección de datos pública
export const appId = "lista-compartida-paty81";
