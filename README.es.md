# 📝 Lista Compartida - Tareas en Tiempo Real

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Una aplicación web progresiva (PWA) para crear y compartir listas de tareas en tiempo real. Perfecta para familias, equipos y grupos que necesitan coordinar tareas de forma colaborativa.

**Hecha por [Paty81](https://github.com/Paty81)** con 💜

[🇬🇧 English Version](./README.md)

---

## ✨ Características

- ✅ **Sincronización en tiempo real** - Los cambios se ven instantáneamente en todos los dispositivos
- 🔗 **Compartir fácilmente** - Copia y comparte el enlace para colaborar
- 📱 **Instalable como App** - Funciona como una aplicación nativa en móviles
- 🌐 **Sin necesidad de registro** - Empieza a usar inmediatamente
- 🎨 **Interfaz moderna y limpia** - Diseño intuitivo con Tailwind CSS
- ☁️ **Guardado automático en la nube** - Nunca pierdas tus tareas
- 🔄 **Marca/desmarca tareas** - Mantén el seguimiento de lo completado
- 🗑️ **Elimina tareas** - Gestión completa de tu lista

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Una cuenta de Firebase (gratuita)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Paty81/tareas-compartidas-app.git
cd tareas-compartidas-app
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto (o usa uno existente)
3. Registra una aplicación web
4. Copia las credenciales de configuración
5. Abre el archivo `src/config/firebase.js`
6. Reemplaza las credenciales con las tuyas:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Paso 4: Configurar Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Crea una base de datos en modo de prueba
3. Configura las reglas de seguridad (ejemplo básico):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /public_lists/{listId}/todos/{todoId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Paso 5: Habilitar Autenticación Anónima

1. Ve a **Authentication** en Firebase Console
2. Haz clic en **Sign-in method**
3. Habilita **Anonymous**

### Paso 6: Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📦 Construir para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`

Para previsualizar la build de producción:

```bash
npm run preview
```

---

## 🏗️ Estructura del Proyecto

```
tareas-compartidas-app/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── Header.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TaskList.jsx
│   │   ├── InstallModal.jsx
│   │   └── Footer.jsx
│   ├── config/
│   │   └── firebase.js  # Configuración de Firebase
│   ├── pages/
│   │   └── TodoPage.jsx # Página principal
│   ├── App.jsx          # Componente raíz
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔧 Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **Firebase** - Backend (Firestore + Auth)
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos modernos
- **PWA** - Progressive Web App

---

## 📱 Instalar como App

### En iPhone (Safari)
1. Abre la app en Safari
2. Toca el botón **Compartir** (cuadro con flecha hacia arriba)
3. Desplázate y selecciona **Añadir a pantalla de inicio**
4. Toca **Añadir**

### En Android (Chrome)
1. Abre la app en Chrome
2. Toca el menú (3 puntos verticales)
3. Selecciona **Instalar aplicación** o **Añadir a pantalla de inicio**
4. Confirma la instalación

---

## 🤝 Cómo Usar

1. **Añadir Tarea**: Escribe en el campo de texto y presiona el botón `+`
2. **Marcar Completada**: Haz clic en el círculo a la izquierda de la tarea
3. **Eliminar Tarea**: Haz clic en el icono de papelera roja
4. **Compartir Lista**: Haz clic en "Copiar Enlace" y envíalo a quien quieras
5. **Instalar App**: Haz clic en "Instalar App" y sigue las instrucciones

---

## 🔒 Seguridad y Privacidad

- La autenticación es anónima (no se requieren datos personales)
- Cada usuario recibe un ID único temporal
- Las tareas se almacenan en una colección compartida
- **Importante**: Cualquiera con el enlace puede ver y editar la lista

---

## 🐛 Solución de Problemas

### Las tareas no se sincronizan
- Verifica que Firebase esté correctamente configurado
- Revisa la consola del navegador para errores
- Asegúrate de tener conexión a internet

### Error de autenticación
- Verifica que la autenticación anónima esté habilitada en Firebase
- Comprueba que las credenciales en `firebase.js` sean correctas

### No se puede instalar como PWA
- Asegúrate de estar usando HTTPS (o localhost)
- Verifica que tu navegador soporte PWAs
- Intenta desde el menú de tu navegador

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👩‍💻 Autora

**Paty81**
- GitHub: [@Paty81](https://github.com/Paty81)

---

## 🌟 ¿Te gusta el proyecto?

Si encuentras útil esta aplicación:
- Dale una ⭐ en GitHub
- Compártela con tus amigos
- Contribuye con mejoras

---

## 📧 Contacto

Si tienes preguntas, sugerencias o encuentras algún bug, no dudes en abrir un [issue](https://github.com/Paty81/tareas-compartidas-app/issues).

---

Hecho con ❤️ por [Paty81](https://github.com/Paty81)
