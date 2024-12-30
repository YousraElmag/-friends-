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
          const response = await axios.get(`/api/chat/messages/${uss._id}/${selectedUser._id}`
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
    
      await axios.post('/api/chat/messages',
        messageData
      );

     
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage(""); 
    } catch (error) {
      console.error("Error sending message:", error.message);
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
          >
            <p className={msg.senderId === uss._id ? "sent" : "received"}>
              {msg.content}
            </p>
            <span
              className={
                msg.senderId === uss._id ? "sent-time" : "received-time"
              }
            >
              {msg.createdAt ? format(new Date(msg.createdAt), "hh:mm a") : ""}
            </span>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
