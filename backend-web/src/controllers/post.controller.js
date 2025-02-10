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
      return res.status(400).json({ erroe: "Please enter text." });
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
  } catch (error) {
    console.log(`Error getUserProfile module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
