import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TodoPage from './pages/TodoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/:listId" element={<TodoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
