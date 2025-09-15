import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
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


app.use(express.json());




const cors = require("cors");

app.use(cors({
  origin: "https://friends-780q02e6t-yousraelmags-projects.vercel.app",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", router);
app.use("/api/chat", routerchat);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

startServer();
