import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatComponent from "./chat";
import "../style/home.css";

const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const uss = JSON.parse(localStorage.getItem("chat-user"));
  const currentUser = uss ? uss._id : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/auth/users'
        );
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="chat-app">
      <div className="user-list">
        <h3>User List</h3>
        <ul>
          {users.map(({ _id, name }) => (
            <li
              key={_id}
              onClick={() => setSelectedUser({ _id, name })}
              className={`user-item ${
                selectedUser && selectedUser._id === _id ? "active" : ""
              }`}
            >
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
          <div className="select-user">Select a user to chat</div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
