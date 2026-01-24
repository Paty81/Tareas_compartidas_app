# 📝 Shared List - Decentralized Tasks

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)](https://react.dev/)
[![GunDB](https://img.shields.io/badge/GunDB-Decentralized-ff0055?style=flat&logo=gun&logoColor=white)](https://gun.eco/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A **decentralized** Progressive Web App (PWA) for creating and sharing task lists in real-time. Built with **GunDB**, it works purely Peer-to-Peer (P2P), meaning your data lives on your device and syncs directly with others without central servers.

**Made by [Paty81](https://github.com/Paty81)** with 💜

[🇪🇸 Versión en Español](./README.es.md)

---

## ✨ Features

- ⛓️ **Decentralized (P2P)** - No central database unique to one owner.
- ✅ **Real-time synchronization** - Changes propagate instantly across connected peers.
- 📂 **Multiple Lists & Unified View** - Guests see all shared lists in one place.
- 🛡️ **Secure by Default** - New lists use hybrid random IDs (`name-randomCode`) to prevent guessing.
- 💬 **Identity in Comments** - Comments show your real user alias, not "Anonymous".
- 📅 **Due Dates & Priorities** - Set deadlines and mark tasks as High/Medium/Low priority.
- 🔗 **Easy sharing** - Share a simple URL to invite others to a specific list.
- 📱 **Installable as App** - Full PWA support for mobile and desktop.
- 🔒 **Privacy Focused** - No registration required (Anonymous Auth via SEA).
- 🎨 **Modern Interface** - Clean design with Tailwind CSS.

---

## 🚀 Installation and Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/Paty81/tareas-compartidas-app.git
cd tareas-compartidas-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

> **Note:** By default, the app connects to public relay peers to facilitate connection between users who are not on the same local network.

---

## 📦 Build for Production

```bash
npm run build
```

Optimized files will be in the `dist/` folder.

To preview the production build:

```bash
npm run preview
```

---

## 🏗️ Project Structure

```
tareas-compartidas-app/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── AuthModal.jsx    # User authentication (SEA)
│   │   ├── TaskForm.jsx     # Input for new tasks
│   │   ├── TaskList.jsx     # List display logic
│   │   ├── TabSelector.jsx  # Location/Category switcher
│   │   └── ...
│   ├── config/
│   │   └── db.js        # GunDB configuration & initialization
│   ├── pages/
│   │   └── TodoPage.jsx # Main application logic
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔧 Technologies Used

- **React 18** - UI Library
- **Vite** - Build tool
- **GunDB** - Decentralized Graph Database
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **PWA** - Progressive Web App capabilities

---

## 🤝 How to Use

1. **Create/Login**: Pick a username and password. This generates your cryptographic keys locally.
2. **Create Lists**: Use the tabs to switch between lists (e.g., "Home", "Work") or create new ones (Admin only).
3. **Add Task**: Type your task, optionally pick a date, and hit Enter.
4. **Share**: Click the "Share" button to copy the link for the current list. Send it to your family/team.
   - _Note_: They need to open the link to see that specific list.

---

## 🔒 Security & Persistence

- **Authentication**: Uses Gun's SEA (Security, Encryption, Authorization). No emails, just key pairs.
- **Data Persistence**: Data is stored in your browser's `localStorage` and synced with any connected peers.

---

## 🐛 Troubleshooting

### Tasks don't sync

- Ensure both devices are online.
- If you are on different networks, it might take a moment to find a common relay peer.
- Refresh the page to reconnect to peers.

### "Login" keeps appearing

- Your user session is stored in the browser. If you clear cookies/storage, you will need to log in again with the **exact same** username and password to recover your admin rights (if you were an admin).

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** license.

### Summary:

- **✅ You CAN:** Share, copy, adapt, and improve the code.
- **❌ You CANNOT:** Use this project for commercial purposes (make money with it) without explicit permission.
- **⚠️ You MUST:** Give credit to the original author (@Paty81) and license your new creations under the same terms.

For the full legal text, see the [LICENSE](LICENSE) file.

---

## 👩‍💻 Author

**Paty81**

- GitHub: [@Paty81](https://github.com/Paty81)

---

Made with ❤️ by [Paty81](https://github.com/Paty81)
