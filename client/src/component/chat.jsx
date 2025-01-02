import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";

const ChatComponent = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const uss = JSON.parse(localStorage.getItem("chat-user"));

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && selectedUser) {
        try {
          const response = await axios.get(
            `/api/chat/messages/${uss._id}/${selectedUser._id}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error.message);
        }
      }
    };

    fetchMessages();
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      console.error("Cannot send an empty message");
      return;
    }

    const messageData = {
      senderId: uss._id,
      receiverId: selectedUser._id,
      content: newMessage,
    };

    try {
      await axios.post("/api/chat/messages", messageData);

      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  // Handle "Enter" key press to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <h2>Chat with {selectedUser.name}</h2>
      <div
        ref={chatContainerRef}
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.senderId === uss._id ? "sent-message" : "received-message"
            }
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "10px",
              flexDirection: msg.senderId === uss._id ? "row-reverse" : "row", // For sent messages, image will be on the right
            }}
          >
            {/* Display Sender's Image */}
            <img
              src={msg.senderId === uss._id ? uss.image : selectedUser.image}
              alt="User Avatar"
              style={{
                width: "30px",
                height: "30px",
                 margintop: '15px',
                borderRadius: "50%",
                marginLeft: msg.senderId === uss._id ? "10px" : "0", // Adjust position for row-reverse
                marginRight: msg.senderId === uss._id ? "0" : "10px", // Adjust position for row-reverse
              }}
            />
            <div>
              <p className={msg.senderId === uss._id ? "sent" : "received"}>
                {msg.content}
              </p>
              <span
                className={
                  msg.senderId === uss._id ? "sent-time" : "received-time"
                }
              >
                {msg.createdAt
                  ? format(new Date(msg.createdAt), "hh:mm a")
                  : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Add the Enter key event handler
          placeholder="Type a message..."
          style={{ width: "80%", padding: "10px" }}
        />
        <button onClick={sendMessage} style={{ padding: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
