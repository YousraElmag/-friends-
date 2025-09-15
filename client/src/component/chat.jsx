import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import EmojiPicker from "emoji-picker-react";

const ChatComponent = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const uss = JSON.parse(localStorage.getItem("chat-user"));
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && selectedUser) {
        try {
          const response = await axios.get(
            `https://friends-r1o0.onrender.com/api/chat/messages/${uss._id}/${selectedUser._id}`
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
    }, 6000);

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
      await axios.post("https://friends-r1o0.onrender.com/api/chat/messages", messageData);

      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div>
      <h2>Chat with {selectedUser.name}</h2>
      <div
        className="allchat"
        ref={chatContainerRef}
        style={{
          height: "421px",
          overflowY: "scroll",
          padding: "10px",
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
              flexDirection: msg.senderId === uss._id ? "row-reverse" : "row",
            }}
          >
            <img
              src={msg.senderId === uss._id ? uss.image : selectedUser.image}
              alt="User Avatar"
              style={{
                width: "30px",
                height: "30px",
                marginTop: "15px",
                borderRadius: "50%",
                marginLeft: msg.senderId === uss._id ? "10px" : "0",
                marginRight: msg.senderId === uss._id ? "0" : "10px",
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
      <div className="mes">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{
            background: "antiquewhite",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
           
          }}
        >
          😊
        </button>
        {showEmojiPicker && (
          <div style={{ position: "absolute", bottom: "60px", zIndex: "10" }}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            width: "70%",
            padding: "10px",
            outline: "none",
            border: "navajowhite",
            color: "black",
            background: "antiquewhite",
            fontSize: "18px",
            fontFamily: "sans-serif",
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
