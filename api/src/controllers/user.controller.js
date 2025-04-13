import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    // Check user exists
    if (!user) {
      return res.status(404).json({ error: "User is not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(`Error getUserProfile module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get suggested users
export const getSuggestedUsers = async (req, res) => {
  const userId = req.user._id;

  try {
    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId } // Match ids except myself
        }
      },
      {
        $sample: { size: 10 } // Get 10 records
      },
      {
        $project: {
          password: 0 // Exclude the password field
        }
      }
    ]);
    const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0, 4);

    // This code below also exclude password
    // suggestedUsers.forEach(user => user.password = null);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error getSuggestedUsers module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Follow or unfollow user
export const followOrUnfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    // Check that can not follow or unfollow myself
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can not follow or unfollow yourself." });
    }

    // Check user exists
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
    console.log(`Error followOrUnfollowUser module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { fullName, username, email, currentPassword, newPassword, bio, link } = req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    // find user in db
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User is not found." });
    }

    // check username exists
    const existingUser = await User.findOne({ username });

    // if (existingUser) {
    //   return res.status(400).json({ error: "Username is already taken." });
    // }

    // check email's format
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (email && !emailRegex.test(email)) {
    //   return res.status(400).json({ error: "Email's format is invalid." });
    // }

    // // check email exists
    // const existingEmail = await User.findOne({ email });

    // if (existingEmail) {
    //   return res.status(400).json({ error: "Email is already taken." });
    // }

    // Check current password and new password
    if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
      return res.status(400).json({ error: "Please enter both current password and new password." });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
      }

      const salt = await bcrypt.genSalt(10);
      // update password
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // check profile image
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    // check cover image
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    // update rest
    user.fullName = fullName || user.fullName;
    // user.username = username || user.username;
    // user.email = email || user.email;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    user = await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error updateUser module: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
