import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
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

// Get suggested users
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId  = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }
        }
      },
      {
        $sample: { size: 10 }
      },
      {
        $project: {
          password: 0 // Exclude the password field
        }
      }
    ]);
    const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0, 4);

    // suggestedUsers.forEach(user => user.password = null);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error in getSuggestedUsers module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Follow or unfollow user
export const followOrUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can not follow or unfollow yourself." });
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

      const newNotification = new Notification({
        from: req.user._id,
        to: userToModify._id,
        type: "follow"
      });

      await newNotification.save();

      res.status(200).json({ message: "Followed user successfully." });
    }
  } catch (error) {
    console.log(`Error in getUserProfile module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
