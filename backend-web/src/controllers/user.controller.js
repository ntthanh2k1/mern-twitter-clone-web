import User from "../models/user.model.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  
  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User is not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getUserProfile module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};


// Follow or unfollow user
export const followOrUnfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can't follow or unfollow yourself." });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User is not found." });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfolow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "Unfollowed user successfully." });
    }
    else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "Followed user successfully." });
    }
  } catch (error) {
    console.log(`Error in getUserProfile module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
