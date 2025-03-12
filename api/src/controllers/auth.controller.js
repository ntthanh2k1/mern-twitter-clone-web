import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

// Sign up
export const signUp = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    if (!fullName) {
      return res.status(400).json({ error: "Full name is required." });
    }
    
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const existingUser = await User.findOne({ username });

    // Check if username exists, can not register
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email's format is invalid." });
    }

    const existingEmail = await User.findOne({ email });

    // Check if email exists, can not register
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken." });
    }

    // Check password's length greater than 6
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        message: "Signed up successfully.",
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email
        // followers: newUser.followers,
        // following: newUser.following,
        // profileImg: newUser.profileImg,
        // coverImg: newUser.coverImg,
        // bio: newUser.bio,
        // link: newUser.link
      });
    }
    else {
      res.status(400).json({ error: "Data is invalid." });
    }
  } catch (error) {
    console.error(`Error signUp module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Sign in
export const signIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    // Check correct username
    if (!user) {
      return res.status(400).json({ error: "Username is incorrect." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    // Check correct password
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Password is incorrect." });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Signed in successfully.",
      fullName: user.fullName,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error(`Error signIn module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Sign out
export const signOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Signed out successfully." });
  } catch (error) {
    console.error(`Error signOut module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get user's information
export const getInfo = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error getInfo module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
