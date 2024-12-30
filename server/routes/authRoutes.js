import express from "express";
import {
  login,
  logout,
  signup,
  getall
} from "../controllers/authcontroller.js";
import { getAllUsers } from "../controllers/users.js";
import generateTokenAndSetCookie from '../helper/token.js'

const router = express.Router();
import cors from "cors";

// router.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:5173",
//   })
// );

router.get("/users", getall);
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
