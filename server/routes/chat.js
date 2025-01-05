import express from "express";
import Message from "../model/message.js";

const routerchat = express.Router();

routerchat.get("/messages/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

routerchat.post("/messages", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const message = new Message({ senderId, receiverId, content });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default routerchat;
