import { User } from "../models/user.model.js";

export const getLeaderboard = async (req, res) => {
  try {
    // Fetch top 10 users by points, keeping only basic public fields
    const users = await User.find({})
      .sort({ points: -1 })
      .limit(10)
      .populate("badges");

    // Format them for the frontend component
    const leaderboardData = users.map((user, index) => ({
      rank: index + 1,
      name: user.username,
      username: `@${user.username}`,
      points: user.points,
      avatar: user.username.substring(0, 2).toUpperCase(),
      trend: "same", // Simplification unless we track historical points
      badges: user.badges ? user.badges.length : 0
    }));

    res.status(200).json({
      success: true,
      data: leaderboardData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
