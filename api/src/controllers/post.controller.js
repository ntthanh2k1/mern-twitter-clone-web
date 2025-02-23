import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User is not found." });
    }

    if (!text) {
      return res.status(400).json({ erroe: "Please enter the text." });
    }

    if (img) {
      const uploadedRespoonse = await cloudinary.uploader.upload(img);

      img = uploadedRespoonse.recure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img
    });

    await newPost.save(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.log(`Error createPost module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(`Error deletePost module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
