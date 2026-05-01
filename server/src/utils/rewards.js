import { User } from "../models/user.model.js";
import Badge from "../models/badge.model.js";

export const awardPoints = async (userId, value, tags = []) => {
  if (!userId) return null;
  const user = await User.findById(userId);
  if (!user) return null;

  user.points += value;

  if (tags && tags.length > 0) {
    let shouldCheckProfile = false;
    tags.forEach(tag => {
      const lowerTag = tag.toLowerCase().trim();
      const existing = user.tagReputation.find(t => t.tag === lowerTag);
      let newTagPoints = value;
      if (existing) {
        existing.points += value;
        newTagPoints = existing.points;
      } else {
        user.tagReputation.push({ tag: lowerTag, points: value });
      }

      if (newTagPoints >= 50 && newTagPoints - value < 50) {
        shouldCheckProfile = true;
      }
    });

    if (shouldCheckProfile) {
      import("../models/profile.model.js").then(async ({ default: Profile }) => {
        const profile = await Profile.findOne({ user: userId });
        if (profile) {
          const expertTagsSet = new Set(profile.expertTags.map(t => t.toLowerCase()));
          let updated = false;
          user.tagReputation.forEach(t => {
            if (t.points >= 50 && !expertTagsSet.has(t.tag)) {
              profile.expertTags.push(t.tag);
              updated = true;
            }
          });
          if (updated) await profile.save();
        }
      });
    }
  }

  await user.save();
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
