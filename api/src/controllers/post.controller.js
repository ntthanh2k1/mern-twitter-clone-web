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
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post is not found." });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You are not authorized to delete this post." });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0]
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post was deleted." });
  } catch (error) {
    console.log(`Error deletePost module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
