import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    // Hash password
    const salt = await bcrypt.salt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email's format is invalid."});
    }

    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken." });
    }

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
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
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

export const signin = async (req, res) => {
  res.json({
    data: "This is sign in enpoint"
  });
};

export const signout = async (req, res) => {
  res.json({
    data: "This is sign out enpoint"
  });
};
