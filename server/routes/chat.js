import express from "express";
import Message from "../model/message.js";
import CryptoJS from "crypto-js";

const routerchat = express.Router();
const ENCRYPTION_SECRET = "your_secret_key"; // Replace with your secure key

// Utility functions for encryption and decryption
const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, ENCRYPTION_SECRET).toString();
};

const decryptMessage = (encryptedMessage) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Fetch messages
routerchat.get("/messages/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    // Decrypt content before sending it to the client
    const decryptedMessages = messages.map((message) => ({
      ...message.toObject(),
      content: decryptMessage(message.content),
    }));

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Send message
routerchat.post("/messages", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Encrypt the message content before saving
    const encryptedContent = encryptMessage(content);

    const message = new Message({
      senderId,
      receiverId,
      content: encryptedContent,
    });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default routerchat;
