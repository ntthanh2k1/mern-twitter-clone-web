import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    // const posts = await Post.find()
    //   .populate("user", "fullName username profileImg")
    //   .populate("comments.user", "fullName username profileImg")
    //   .sort({ createdAt: -1 });
    const posts = await Post.find()
      .populate({
        path: "user",
        select: "-password"
      })
      .populate({
        path: "comments.user",
        select: "-password"
      })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.log(`Error getAllPosts module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get liked posts
export const getLikedPosts = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(`Error getLikedPosts module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Create post
export const createPost = async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId);

    // Check user exists
    if (!user) {
      return res.status(404).json({ error: "User is not found." });
    }

    // Check text is required
    if (!text) {
      return res.status(400).json({ erroe: "Please enter the text." });
    }

    // Check image is posted
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

// Like or unlike post
export const likeOrUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    // const { id: postId } = req.params;

    const post = await Post.findById(postId);

    // Check post exists
    if (!post) {
      return res.status(404).json({ error: "Post is not found." });
    }

    const userLikedPost = post.likes.includes(userId);

    // Check if liked -> unlike
    // else like
    if (userLikedPost) {
      post.likes.pull(userId);
      await post.save();
      await User.findByIdAndUpdate(userId, { $pull: { likedPost: postId } });
      // await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      // await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Unliked post successfully." });
    }
    else {
      post.likes.push(userId);
      await post.save();
      await User.findByIdAndUpdate(userId, { $push: { likedPost: postId } });
      // await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      // await Post.updateOne({ _id: postId }, { $push: { likes: userId } });

      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "like"
      });

      await newNotification.save();
      res.status(200).json({ message: "Liked post successfully." });
    }
  } catch (error) {
    console.log(`Error likeOrUnlikePost module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Comment on post
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const postId = req.params.id;

    // Check text is not null before
    if (!text) {
      return res.status(400).json({ error: "Text is required." });
    }

    const post = await Post.findById(postId);

    // Check post exists
    if (!post) {
      return res.status(404).json({ error: "Post is not found." });
    }

    const comment = {
      user: userId,
      text
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.log(`Error commentOnPost module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check post exists
    if (!post) {
      return res.status(404).json({ error: "Post is not found." });
    }

    // Check if user does not own post, it can not be deleted.
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You are not authorized to delete this post." });
    }

    // Check image exists
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
