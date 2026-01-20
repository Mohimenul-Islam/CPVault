import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Temporary home route */}
          <Route path="/" element={<div>Home (logged in users will land here)</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
