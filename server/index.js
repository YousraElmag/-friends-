import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./routes/authRoutes.js";
import routerchat from "./routes/chat.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const __dirname = path.resolve();

if (!process.env.DB_URI) {
  console.error("Missing DB_URI in environment variables");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "dist")));

// API routes
app.use("/api/auth", router);
app.use("/api/chat", routerchat);

// Handle all other routes (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Create HTTP server
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins (adjust for production)
    methods: ["GET", "POST"],
  },
  path: "/socket.io", // Socket.io path
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room based on user ID
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Listen for new messages
  socket.on("sendMessage", async (message) => {
    try {
      // Save the message to the database (if needed)
      // Then send it to the receiver
      io.to(message.receiverId).emit("receiveMessage", message);
      io.to(message.senderId).emit("receiveMessage", message); // Also send to sender
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB");

    httpServer.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

startServer();
