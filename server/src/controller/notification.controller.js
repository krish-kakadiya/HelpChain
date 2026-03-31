import {
  getNotificationsService,
  markSeenService,
  markAllSeenService,
  getUnseenCountService,
} from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsService(req.user.userId);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markSeen = async (req, res) => {
  try {
    const notification = await markSeenService(req.params.id, req.user.userId);
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAllSeen = async (req, res) => {
  try {
    await markAllSeenService(req.user.userId);
    res.status(200).json({ success: true, message: "All notifications marked as seen" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUnseenCount = async (req, res) => {
  try {
    const count = await getUnseenCountService(req.user.userId);
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};