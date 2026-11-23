import express from "express";
import { login, logout, signup } from "../controllers/authcontroller.js";
import User from "../model/user.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/users", async (req, res) => {
  const { query = "", currentUserId } = req.query;

  try {
    let users;
    // Escape special regex characters so user input is matched literally
    const safeQuery = String(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const queryFilter = {
      $or: [
        { name: { $regex: safeQuery, $options: "i" } },
        { email: { $regex: safeQuery, $options: "i" } },
      ],
    };

    if (currentUserId) {
      users = await User.find({
        ...queryFilter,
        _id: { $ne: currentUserId },
      })
        .select("-password")
        .limit(4);
    } else {
      users = await User.find(queryFilter).select("-password").limit(4);
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

export default router;
