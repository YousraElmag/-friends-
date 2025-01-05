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

// Routes
app.use("/api/auth", router);
app.use("/api/chat", routerchat);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}


const httpServer = createServer(app);


const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
 
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
  
  });

  socket.on("sendMessage", async (message) => {
    try {
      io.to(message.receiverId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  });
  socket.on("disconnect", () => {
  
  });
});

// تشغيل الخادم
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
