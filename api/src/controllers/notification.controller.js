import Notification from "../models/notification.model.js";

// Get user's notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId })
      .populate({
        path: "from",
        select: "username profileImg"
      });
    
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: `Error in getNotifications module: ${error.message}.` });
  }
};

// Delete user's notifications
export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notifications are deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: `Error in deleteNotifications module: ${error.message}.` });
  }
};

// Delete user's notification by id
export const deleteNotificationById = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification is not found." });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this notification." });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification is deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: `Error in deleteNotificationById module: ${error.message}.` });
  }
};
