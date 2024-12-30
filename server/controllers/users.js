import User from "../model/user.js";

export const getAllUsers = async (req, res) => {
  try {
    // Get the logged-in user's ID from the request (assuming it's set by a middleware
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }, // Exclude the logged-in user
    }).select("-password"); // Exclude the password field from the result

    // Send the list of users as a response
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error:", error.message); // Log error to server
    res.status(500).json({ error: error.message || "Internal server error" }); // Send error message
  }
};
