import bcrypt from "bcrypt";
import User from "../model/user.js"
import  generateTokenAndSetCookie  from "../helper/token.js";


export const signup = async (req, res) => {
  try {
    const { email, name, password, confirmPassword} = req.body;

    if (!email || !name || !password || !confirmPassword ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Name or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid name or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,

    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const getall = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, "-password"); // Exclude the password field

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json(users); // Return all users as an array
  } catch (error) {
    console.error("Error in getAllUsers controller:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
