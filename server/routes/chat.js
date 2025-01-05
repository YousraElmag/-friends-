import express from "express";
import Message from "../model/message.js";
import crypto from "crypto"; 

const routerchat = express.Router();


const encryptionKey = crypto.randomBytes(32); 
const algorithm = "aes-256-cbc";


function encrypt(text) {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`; 
}


function decrypt(text) {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}


routerchat.get("/messages/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

   
    const decryptedMessages = messages.map((msg) => ({
      ...msg.toObject(),
      content: decrypt(msg.content),
    }));

    res.status(200).json(decryptedMessages);
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

    const encryptedContent = encrypt(content);

    const message = new Message({
      senderId,
      receiverId,
      content: encryptedContent,
    });
    await message.save();

    res.status(201).json({ ...message.toObject(), content }); 
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default routerchat;
