import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import DeckList from "./pages/DeckList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<DeckList />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
