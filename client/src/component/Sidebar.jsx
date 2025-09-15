import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatComponent from "./chat";
import "../style/home.css";
import aa from "../assets/aa.jpg";
const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const uss = JSON.parse(localStorage.getItem("chat-user"));
  const currentUser = uss ? uss._id : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://friends-r1o0.onrender.com/api/auth/users?query=${search}`, {
          params: { currentUserId: currentUser },
        });
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search, currentUser]);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="chat-app">
      <div className="user-list">
        <h3>Friends ❤️</h3>
        <div className="search">
          <button onClick={toggleSearch} className="search-icon">
            🔍
          </button>
          {showSearch && (
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          )}
        </div>

        <ul>
          {users.map(({ _id, name, image }) => (
            <li
              key={_id}
              onClick={() => setSelectedUser({ _id, name, image })}
              className={`user-item ${
                selectedUser && selectedUser._id === _id ? "active" : ""
              }`}
            >
              <img
                src={image || "default-image-url.jpg"}
                alt={name}
                className="user-avatar"
              />
              {name || _id}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        {selectedUser ? (
          <ChatComponent
            selectedUser={selectedUser}
            currentUser={currentUser}
          />
        ) : (
          <div
            style={{
              backgroundImage: `url(${aa})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
              color: "white",
              display: "flex",
              justifyContent: "center",
              fontFamily: '"Playwrite GB S", sans-serif',
              paddingTop: "19px",
              fontWeight: "bolder",
              fontSize: "large",
            }}
            className="select-user"
          >
            Who's on your mind? Select them to chat"
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
