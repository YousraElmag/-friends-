import express from "express";
import { login, logout, signup } from "../controllers/authcontroller.js";
import User from "../model/user.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/users", async (req, res) => {
  const { query, currentUserId } = req.query;

  try {
    let users;
    const queryFilter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };

    if (currentUserId) {
      users = await User.find({
        ...queryFilter,
        _id: { $ne: currentUserId },
      }).limit(4);
    } else {
      users = await User.find(queryFilter);
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
});

export default router;
