import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://friends-1-7d7s.onrender.com/api/auth/logout");
      console.log(response.data.message);
      localStorage.removeItem("chat-user");
      navigate("/login");
    } catch (error) {
      console.error(
        "Error during logout:",
        error.response ? error.response.data.error : error.message
      );
      setError(
        error.response
          ? error.response.data.error
          : "An error occurred during logout."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logout">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Logging out..." : "Logout🚪"}
      </button>
    </div>
  );
};

export default Logout;
