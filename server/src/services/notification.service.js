import Notification from "../models/notification.model.js";

export const createNotificationService = async ({
  recipientId,
  actorId,
  type,
  problemId,
  answerId,
  message,
}) => {
  // Don't notify users about their own actions
  if (recipientId?.toString() === actorId?.toString()) return null;

  return await Notification.create({
    recipient: recipientId,
    actor: actorId,
    type,
    problem: problemId,
    answer: answerId || null,
    message: message || "",
  });
};

export const getNotificationsService = async (userId) => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("actor", "username")
    .populate("problem", "title tags")
    .populate("answer", "_id")
    .lean();
};

export const markSeenService = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { seen: true },
    { new: true }
  );
  if (!notification) throw new Error("Notification not found or unauthorized");
  return notification;
};

export const markAllSeenService = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, seen: false },
    { seen: true }
  );
};

export const getUnseenCountService = async (userId) => {
  return await Notification.countDocuments({
    recipient: userId,
    seen: false,
  });
};