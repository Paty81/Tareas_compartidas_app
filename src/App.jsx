import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import TodoPage from './pages/TodoPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/:listId" element={<TodoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
