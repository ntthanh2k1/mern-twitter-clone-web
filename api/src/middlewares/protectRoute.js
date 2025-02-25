import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// This function decode jwt from client cookie to authorize
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // Check token exists
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: token is not provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check the decode of token is valid
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: token is invalid." });
    }

    const user = await User.findById(decoded.userId).select("-password");

    // Check user exists
    if (!user) {
      return res.status(404).json({ error: "User is not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Error sign up module: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
