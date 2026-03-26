import dotenv from "dotenv";
import Badge from "./badge.model.js";
import connectDB from "../config/db.js";

dotenv.config();

const badgesData = [
  { code: 'fifty', name: '50 Solutions', description: 'Solved 50 problems', minPoints: 50 },
  { code: 'hundred', name: '100 Solutions', description: 'Century of solutions', minPoints: 100 },
  { code: 'bugSpecialist', name: 'Bug Specialist', description: 'Fixed 20 critical bugs', minPoints: 200 },
  { code: 'logicArchitect', name: 'Logic Architect', description: 'Master of algorithms', minPoints: 400 },
  { code: 'cyberSecurity', name: 'Security Analyst', description: 'Guardian of digital spaces', minPoints: 500 },
  { code: 'mentor', name: 'Mentor', description: 'Guided 25+ developers', minPoints: 600 },
];

const seedBadges = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding");

    await Badge.deleteMany({});
    console.log("Cleared existing badges");

    await Badge.insertMany(badgesData);
    console.log("Successfully seeded badges!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding badges:", error);
    process.exit(1);
  }
};

seedBadges();

seedBadges();
