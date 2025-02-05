import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

// sign up
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email's format is invalid."});
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken." });
    }

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
        message: "User signed up.",
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
    console.error(`Error sign up module: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Sign in
export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Username is incorrect." });
    }

    const pwd = await bcrypt.compare(password, user?.password || "");

    if (!pwd) {
      return res.status(400).json({ error: "Password is incorrect." });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "User signed in.",
      fullName: user.fullName,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error(`Error sign in module: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const signout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User signed out."});
  } catch (error) {
    console.error(`Error sign out module: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error get info module: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
