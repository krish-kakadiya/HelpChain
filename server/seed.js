import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import { User } from './src/models/user.model.js';
import Profile from './src/models/profile.model.js';
import Problem from './src/models/problem.model.js';
import Answer from './src/models/answer.model.js';
import ExpertSession from './src/models/expert_session.model.js';

const runSeed = async () => {
  try {
    await connectDB();
    console.log('Connected to DB for seeding...');

    // Wipe previous data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Problem.deleteMany({});
    await Answer.deleteMany({});
    await ExpertSession.deleteMany({});
    console.log('Cleared existing data.');

    const password = "123456";

    const expertData = [
      {
        username: "react_ninja",
        email: "react@expert.com",
        technologies: ["React", "JavaScript", "Frontend"],
        expertTags: ["react", "javascript"]
      },
      {
        username: "node_master",
        email: "node@expert.com",
        technologies: ["NodeJS", "Express", "Backend"],
        expertTags: ["nodejs", "express"]
      },
      {
        username: "python_guru",
        email: "python@expert.com",
        technologies: ["Python", "Django", "Machine Learning"],
        expertTags: ["python", "django"]
      },
      {
        username: "cpp_wizard",
        email: "cpp@expert.com",
        technologies: ["C++", "Algorithms", "System Design"],
        expertTags: ["c++", "algorithms"]
      }
    ];

    const regularData = [
      { username: "newbie_coder1", email: "newbie1@test.com" },
      { username: "curious_dev2", email: "newbie2@test.com" },
      { username: "learner_99", email: "newbie3@test.com" }
    ];

    const allUsers = [];

    // Create Experts
    for (const data of expertData) {
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: password,
        isVerified: true,
        isProfileCompleted: true,
        points: 500, // lots of points
        tagReputation: data.expertTags.map(tag => ({ tag, points: 150 }))
      });
      
      await Profile.create({
        user: user._id,
        name: data.username.toUpperCase(),
        age: 25,
        graduation: "2023",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        technologies: data.technologies,
        techStacks: ["MERN"],
        expertTags: data.expertTags
      });

      allUsers.push(user);
    }

    // Create Regular Users
    const regularUsers = [];
    for (const data of regularData) {
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: password,
        isVerified: true,
        isProfileCompleted: true,
        points: 100 // enough points to ask expert
      });

      await Profile.create({
        user: user._id,
        name: data.username.toUpperCase(),
        age: 22,
        graduation: "2025",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        technologies: ["HTML", "CSS"],
        techStacks: ["Frontend"],
        expertTags: []
      });

      allUsers.push(user);
      regularUsers.push(user);
    }

    console.log('Created Users and Profiles!');

    // Create Problems for regular users
    const problems = [
      { title: "How to manage state in React effectively?", body: "I am building a large app and Context API is re-rendering too much.", tags: ["react", "frontend"], difficulty: "Medium", user: regularUsers[0]._id },
      { title: "NodeJS Streams explain simply please", body: "I am trying to read a 5GB file using fs.readFile and my server crashes.", tags: ["nodejs", "backend"], difficulty: "Hard", user: regularUsers[1]._id },
      { title: "What is the fastest sorting algorithm in C++?", body: "Should I use std::sort or implement my own quicksort?", tags: ["c++", "algorithms"], difficulty: "Easy", user: regularUsers[2]._id }
    ];

    await Problem.insertMany(problems);
    console.log('Created Problems!');

    console.log('Seeding Complete! You can login with any email (e.g. react@expert.com or newbie1@test.com) and password: 123456');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
