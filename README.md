# 📝 Shared List - Real-Time Tasks

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A Progressive Web App (PWA) for creating and sharing task lists in real-time. Perfect for families, teams, and groups that need to coordinate tasks collaboratively.

**Made by [Paty81](https://github.com/Paty81)** with 💜

[🇪🇸 Versión en Español](./README.es.md)

---

## ✨ Features

- ✅ **Real-time synchronization** - Changes are instantly visible on all devices
- 🔗 **Easy sharing** - Copy and share the link to collaborate
- 📱 **Installable as App** - Works like a native app on mobile devices
- 🌐 **No registration required** - Start using immediately
- 🎨 **Modern and clean interface** - Intuitive design with Tailwind CSS
- ☁️ **Automatic cloud saving** - Never lose your tasks
- 🔄 **Check/uncheck tasks** - Keep track of what's completed
- 🗑️ **Delete tasks** - Complete management of your list

---

## 🚀 Installation and Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- A Firebase account (free)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Paty81/tareas-compartidas-app.git
cd tareas-compartidas-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Register a web app
4. Copy the configuration credentials
5. Open the file `src/config/firebase.js`
6. Replace the credentials with yours:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 4: Configure Firestore

1. In Firebase Console, go to **Firestore Database**
2. Create a database in test mode
3. Set up security rules (basic example):

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

### Step 5: Enable Anonymous Authentication

1. Go to **Authentication** in Firebase Console
2. Click on **Sign-in method**
3. Enable **Anonymous**

### Step 6: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📦 Build for Production

```bash
npm run build
```

Optimized files will be in the `dist/` folder

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
│   │   ├── Header.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TaskList.jsx
│   │   ├── InstallModal.jsx
│   │   └── Footer.jsx
│   ├── config/
│   │   └── firebase.js  # Firebase configuration
│   ├── pages/
│   │   └── TodoPage.jsx # Main page
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔧 Technologies Used

- **React 18** - UI Library
- **Vite** - Build tool and dev server
- **Firebase** - Backend (Firestore + Auth)
- **Tailwind CSS** - CSS Framework
- **Lucide React** - Modern icons
- **PWA** - Progressive Web App

---

## 📱 Install as App

### On iPhone (Safari)
1. Open the app in Safari
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and select **Add to Home Screen**
4. Tap **Add**

### On Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (3 vertical dots)
3. Select **Install app** or **Add to Home screen**
4. Confirm the installation

---

## 🤝 How to Use

1. **Add Task**: Type in the text field and press the `+` button
2. **Mark as Complete**: Click on the circle to the left of the task
3. **Delete Task**: Click on the red trash icon
4. **Share List**: Click on "Copy Link" and send it to whoever you want
5. **Install App**: Click on "Install App" and follow the instructions

---

## 🔒 Security and Privacy

- Authentication is anonymous (no personal data required)
- Each user receives a unique temporary ID
- Tasks are stored in a shared collection
- **Important**: Anyone with the link can view and edit the list

---

## 🐛 Troubleshooting

### Tasks don't sync
- Verify that Firebase is correctly configured
- Check the browser console for errors
- Make sure you have an internet connection

### Authentication error
- Verify that anonymous authentication is enabled in Firebase
- Check that the credentials in `firebase.js` are correct

### Can't install as PWA
- Make sure you're using HTTPS (or localhost)
- Verify that your browser supports PWAs
- Try from your browser's menu

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👩‍💻 Author

**Paty81**
- GitHub: [@Paty81](https://github.com/Paty81)

---

## 🌟 Like the project?

If you find this application useful:
- Give it a ⭐ on GitHub
- Share it with your friends
- Contribute with improvements

---

## 📧 Contact

If you have questions, suggestions, or find any bugs, feel free to open an [issue](https://github.com/Paty81/tareas-compartidas-app/issues).

---

Made with ❤️ by [Paty81](https://github.com/Paty81)
