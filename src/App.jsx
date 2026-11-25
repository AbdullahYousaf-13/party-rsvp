import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import InvitePage from './pages/InvitePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/i/sophia-30" replace />} />
        <Route path="/i/:slug" element={<InvitePage />} />
        <Route path="*" element={<Navigate to="/i/sophia-30" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
