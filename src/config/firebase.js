import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// Clave VAPID para notificaciones push
const VAPID_KEY = "BNhQ_926oWXv2TKXPvWf38F_9DPGGnf-dFxsMZKgZSxFYBPB-61C-B2komypPf6IxDBGWSXcR6-_fXdncGTjtQk";

// Inicializamos la conexión
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en la app
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firebase Cloud Messaging
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log("FCM no soportado en este navegador");
}

// Solicitar permisos y obtener token FCM
export const requestFCMToken = async () => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permiso de notificación denegado');
      return null;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log('Token FCM:', token);
    return token;
  } catch (error) {
    console.error('Error obteniendo token FCM:', error);
    return null;
  }
};

// Escuchar mensajes en primer plano
export const onForegroundMessage = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};

export { messaging };

// Definimos un ID único para la colección de datos pública
export const appId = "lista-compartida-paty81";
