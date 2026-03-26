import { User } from "../models/user.model.js";
import Badge from "../models/badge.model.js";

export const awardPoints = async (userId, value) => {
  if (!userId) return null;
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { points: value } },
    { new: true }
  );
  return user;
};

export const checkAndAssignBadges = async (userId) => {
  if (!userId) return null;

  const user = await User.findById(userId);
  if (!user) return null;

  // Find badges where threshold is reached
  const eligibleBadges = await Badge.find({ minPoints: { $lte: user.points } });

  const currentBadgeIds = user.badges.map((b) => b.toString());
  const newBadgeIds = eligibleBadges
    .map((b) => b._id.toString())
    .filter((id) => !currentBadgeIds.includes(id));

  // If there are new badges to assign
  if (newBadgeIds.length > 0) {
    user.badges.push(...newBadgeIds);
    await user.save();
  }

  return user;
};
