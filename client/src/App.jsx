import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import MyComponent from './component/Sidebar'

function App() {
  return (
    <AuthProvider>
      {/* Wrap your components with AuthProvider */}

      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        {/* Define routes for both login and signup */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        {/* Add other routes if necessary */}
        <Route path="/home" element={<Home />} />{" "}
        {/* Make sure /home route is defined */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
