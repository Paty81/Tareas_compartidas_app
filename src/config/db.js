import Gun from 'gun';
import 'gun/sea';

// Configuración de Gun
const gun = Gun({
  peers: [
    'https://gun-manhattan.herokuapp.com/gun', // Peer público oficial
    'https://relay.peer.ooo/gun' // Relay comunitario
    // Puedes añadir tu propio relay aquí si despliegas uno
  ],
  localStorage: true
});

// Usuario (SEA)
const user = gun.user();

// Identificador de la aplicación para separar datos en la red pública
export const appId = "lista-compartida-paty81-p2p";

export { gun, user };
