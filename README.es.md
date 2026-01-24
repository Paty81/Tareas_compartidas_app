# 📝 Lista Compartida - Tareas Descentralizadas

[![Hecho con React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)](https://react.dev/)
[![GunDB](https://img.shields.io/badge/GunDB-Descentralizado-ff0055?style=flat&logo=gun&logoColor=white)](https://gun.eco/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Una App Web Progresiva (PWA) **descentralizada** para crear y compartir listas de tareas en tiempo real. Construida con **GunDB**, funciona puramente P2P (Peer-to-Peer), lo que significa que tus datos viven en tu dispositivo y se sincronizan directamente con otros sin servidores centrales.

**Hecha por [Paty81](https://github.com/Paty81)** con 💜

[🇬🇧 English Version](./README.md)

---

## ✨ Características

- ⛓️ **Descentralizada (P2P)** - Sin base de datos central ni dueño único de los datos.
- ✅ **Sincronización en tiempo real** - Los cambios se propagan instantáneamente entre dispositivos conectados.
- 📂 **Vista Unificada** - Los invitados ven todas las listas compartidas acumuladas en una sola vista.
- 🛡️ **Segura por Defecto** - Las nuevas listas usan IDs híbridos aleatorios (`nombre-codigo`) para evitar accesos no deseados.
- 💬 **Identidad Real** - Los comentarios muestran tu nombre de usuario, no "Anónimo".
- 📅 **Fechas y Prioridades** - Establece fechas límite y marca tareas con prioridad Alta/Media/Baja.
- 🔗 **Compartir fácilmente** - Comparte un enlace simple para invitar a otros a una lista específica.
- 📱 **Instalable como App** - Soporte completo PWA para móviles y escritorio.
- 🔒 **Privacidad** - Sin registro de correos (Autenticación anónima vía SEA).
- 🎨 **Interfaz Moderna** - Diseño limpio con Tailwind CSS.

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Paty81/tareas-compartidas-app.git
cd tareas-compartidas-app
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

> **Nota:** Por defecto, la app se conecta a peers relay públicos para facilitar la conexión entre usuarios que no están en la misma red local.

---

## 📦 Construir para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`.

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
│   │   ├── AuthModal.jsx    # Autenticación de usuario (SEA)
│   │   ├── TaskForm.jsx     # Input para nuevas tareas
│   │   ├── TaskList.jsx     # Lógica de visualización de lista
│   │   ├── TabSelector.jsx  # Selector de Ubicación/Categoría
│   │   └── ...
│   ├── config/
│   │   └── db.js        # Configuración e inicialización de GunDB
│   ├── pages/
│   │   └── TodoPage.jsx # Lógica principal de la aplicación
│   ├── App.jsx          # Componente raíz
│   └── main.jsx         # Punto de entrada
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔧 Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite** - Herramienta de compilación
- **GunDB** - Base de datos de grafos descentralizada
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **PWA** - Capacidades de Progressive Web App

---

## 🤝 Cómo Usar

1. **Crear/Entrar**: Elige un usuario y contraseña. Esto genera tus claves criptográficas localmente.
2. **Crear Listas**: Usa las pestañas para cambiar entre listas (ej. "Hogar", "Trabajo") o crea nuevas (solo Admin).
3. **Añadir Tarea**: Escribe tu tarea, opcionalmente elige una fecha, y pulsa Enter.
4. **Compartir**: Haz clic en el botón "Compartir" para copiar el enlace de la lista actual. Envialo a tu familia/equipo.
   - _Nota_: Necesitan abrir ese enlace para ver esa lista específica.

---

## 🔒 Seguridad y Persistencia

- **Autenticación**: Usa SEA de Gun (Security, Encryption, Authorization). Sin correos, solo pares de claves.
- **Persistencia de Datos**: Los datos se guardan en el `localStorage` de tu navegador y se sincronizan con cualquier peer conectado.

---

## 🐛 Solución de Problemas

### Las tareas no se sincronizan

- Asegúrate de que ambos dispositivos estén online.
- Si estáis en redes diferentes, puede tardar un momento en encontrar un relay peer común.
- Recarga la página para reconectar a los peers.

### "Login" sigue apareciendo

- Tu sesión de usuario se guarda en el navegador. Si borras cookies/almacenamiento, necesitarás entrar de nuevo con el **mismo** usuario y contraseña para recuperar tus derechos de admin (si lo eras).

---

## 📄 Licencia

Este proyecto está bajo la licencia **Creative Commons Reconocimiento-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**.

### Resumen:

- **✅ Puedes:** Compartir, copiar, adaptar y mejorar el código.
- **❌ NO Puedes:** Usar este proyecto para fines comerciales (ganar dinero con él) sin permiso explícito.
- **⚠️ Debes:** Dar atribución al autor original (@Paty81) y licenciar tus nuevas creaciones bajo los mismos términos.

Para ver el texto legal completo, consulta el archivo [LICENSE](LICENSE).

---

## 👩‍💻 Autora

**Paty81**

- GitHub: [@Paty81](https://github.com/Paty81)

---

Hecho con ❤️ por [Paty81](https://github.com/Paty81)
