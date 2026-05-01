import ExpertSession from '../models/expert_session.model.js';
import Problem from '../models/problem.model.js';
import { User } from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import Profile from '../models/profile.model.js';
import groq from '../config/groq.js';

const COST_MAP = { Easy: 20, Medium: 40, Hard: 60 };

export const requestExpert = async (req, res) => {
  try {
    const { problemId } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    
    if (problem.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const cost = COST_MAP[problem.difficulty] || 40;
    const user = await User.findById(req.user.userId);

    if (user.points < cost) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    // Deduct coins
    user.points -= cost;
    await user.save();

    // Fetch all available experts (users with completed profiles) who are experts in at least one tag
    const lowerTags = problem.tags.map(t => t.toLowerCase().trim());
    let profiles = await Profile.find({ 
      expertTags: { $in: lowerTags },
      user: { $ne: req.user.userId } 
    }).populate('user', 'username');

    // Fallback if no specific experts are found
    if (!profiles.length) {
      profiles = await Profile.find({ user: { $ne: req.user.userId } }).populate('user', 'username');
    }

    if (!profiles.length) {
      user.points += cost; // refund
      await user.save();
      return res.status(404).json({ message: 'No experts available' });
    }

    const expertsData = profiles.map(p => ({
      userId: p.user._id,
      username: p.user.username,
      technologies: p.technologies || [],
      techStacks: p.techStacks || []
    }));

    // Call Claude API to pick the best expert
    const systemPrompt = `You are an expert matching system. The user needs help with a problem titled "${problem.title}" with tags: ${problem.tags.join(', ')}. Return ONLY a JSON object like {"expertId": "..."} selecting the best matching userId from the provided list. If none are great, just pick the closest match. DO NOT return markdown formatting.`;

    const groqRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the list of experts: ${JSON.stringify(expertsData)}` }
      ],
      max_tokens: 200,
      temperature: 0.2
    });

    let bestExpertId = expertsData[0].userId; // default fallback
    try {
      const replyText = groqRes.choices[0]?.message?.content;
      if (replyText) {
        const parsed = JSON.parse(replyText);
        if (parsed.expertId) bestExpertId = parsed.expertId;
      }
    } catch (e) {
      console.error("Groq parsing error:", e);
    }

    const assignedExpertProfile = profiles.find(p => p.user._id.toString() === bestExpertId.toString());

    // Create session
    const session = await ExpertSession.create({
      problem: problemId,
      requester: req.user.userId,
      expert: bestExpertId,
      coinsCost: cost
    });

    // Send notification
    await Notification.create({
      recipient: bestExpertId,
      actor: req.user.userId,
      type: 'solution',
      problem: problemId,
      message: `You've been assigned as an expert for: ${problem.title}`
    });

    res.status(201).json({
      session,
      expert: {
        username: assignedExpertProfile.user.username,
        name: assignedExpertProfile.name || assignedExpertProfile.user.username,
        technologies: assignedExpertProfile.technologies || [],
        badge: (assignedExpertProfile.technologies && assignedExpertProfile.technologies[0]) ? assignedExpertProfile.technologies[0] : 'Expert'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ user: req.user.userId }).populate('user', 'username').lean();
    const problemIds = problems.map(p => p._id);
    const sessions = await ExpertSession.find({ problem: { $in: problemIds } }).populate('expert', 'username');
    
    const problemsWithSessions = problems.map(p => {
      const session = sessions.find(s => s.problem.toString() === p._id.toString());
      return {
        ...p,
        sessionStatus: session ? session.status : null,
        sessionId: session ? session._id : null,
        expert: session ? { name: session.expert.username, initial: session.expert.username.charAt(0).toUpperCase() } : null
      };
    });

    res.json(problemsWithSessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const sessions = await ExpertSession.find({ expert: req.user.userId, status: 'active' })
      .populate('problem', 'title tags difficulty user')
      .populate('requester', 'username')
      .lean();
      
    // Format to match frontend expectations
    const formattedSessions = sessions.map(s => ({
      _id: s.problem._id,
      sessionId: s._id,
      title: s.problem.title,
      tags: s.problem.tags,
      difficulty: s.problem.difficulty,
      user: s.requester,
      assignedAt: s.assignedAt,
      unread: 0
    }));

    res.json(formattedSessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSessionHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await ExpertSession.findById(id).populate('messages.sender', 'username');
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isRequester = session.requester.toString() === req.user.userId.toString();
    const isExpert = session.expert.toString() === req.user.userId.toString();

    if (!isRequester && !isExpert) {
      return res.status(403).json({ message: 'Not authorized for this session' });
    }

    res.json({ messages: session.messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const makeMeExpert = async (req, res) => {
  try {
    const { tags } = req.body;
    if (!tags || !Array.isArray(tags)) return res.status(400).json({ message: 'Tags array is required' });

    const lowerTags = tags.map(t => t.toLowerCase().trim());
    
    // Update user's tag reputation
    const user = await User.findById(req.user.userId);
    lowerTags.forEach(tag => {
      const existing = user.tagReputation.find(t => t.tag === tag);
      if (existing) existing.points = Math.max(existing.points, 50);
      else user.tagReputation.push({ tag, points: 50 });
    });
    await user.save();

    // Update profile
    const profile = await Profile.findOne({ user: req.user.userId });
    if (profile) {
      const expertTagsSet = new Set(profile.expertTags.map(t => t.toLowerCase()));
      lowerTags.forEach(tag => {
        if (!expertTagsSet.has(tag)) profile.expertTags.push(tag);
      });
      await profile.save();
    }

    res.json({ message: 'Expert status granted', tags: lowerTags });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
