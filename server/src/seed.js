import "dotenv/config";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import bcrypt from "bcryptjs";
const samples = [
  {
    title: "Complete React & Modern Frontend",
    subtitle: "Build real-world interfaces with React",
    description:
      "Learn React fundamentals, components, hooks, routing, and production-ready frontend patterns by building practical projects.",
    category: "Development",
    level: "Beginner",
    price: 29,
    compareAtPrice: 59,
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    learningOutcomes: [
      "Build reusable React components",
      "Manage state and effects",
      "Create responsive interfaces",
    ],
    sections: [
      {
        title: "Getting started",
        lessons: [
          {
            title: "Welcome to the course",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
            duration: 240,
            isPreview: true,
            order: 1,
          },
          {
            title: "Components and props",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
            duration: 720,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    title: "Node.js & Express API Masterclass",
    subtitle: "Create secure REST APIs",
    description:
      "Understand Express routing, middleware, validation, authentication, and clean API architecture.",
    category: "Development",
    level: "Intermediate",
    price: 34,
    compareAtPrice: 69,
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    learningOutcomes: [
      "Design REST APIs",
      "Use middleware safely",
      "Connect MongoDB",
    ],
    sections: [
      {
        title: "API fundamentals",
        lessons: [
          {
            title: "Express server basics",
            videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE",
            duration: 600,
            isPreview: true,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    title: "MongoDB for Application Developers",
    subtitle: "Model data with confidence",
    description:
      "Learn document modeling, indexes, queries, Mongoose schemas, and relationships for modern apps.",
    category: "Development",
    level: "Beginner",
    price: 19,
    compareAtPrice: 39,
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    learningOutcomes: [
      "Model collections",
      "Write efficient queries",
      "Use Mongoose",
    ],
    sections: [
      {
        title: "Database basics",
        lessons: [
          {
            title: "Documents and collections",
            videoUrl: "https://www.youtube.com/embed/ofme2o29ngU",
            duration: 480,
            isPreview: true,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    title: "UI Design Essentials for Developers",
    subtitle: "Make polished and accessible products",
    description:
      "Learn spacing, hierarchy, color, responsive layouts, and accessibility essentials for better product UI.",
    category: "Design",
    level: "Beginner",
    price: 24,
    compareAtPrice: 49,
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    learningOutcomes: [
      "Use visual hierarchy",
      "Create responsive layouts",
      "Improve accessibility",
    ],
    sections: [
      {
        title: "Design foundations",
        lessons: [
          {
            title: "Visual hierarchy",
            videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
            duration: 520,
            isPreview: true,
            order: 1,
          },
        ],
      },
    ],
  },
];
try {
  await connectDB();
  let instructor = await User.findOne({ email: "instructor@upskill.demo" });
  if (!instructor)
    instructor = await User.create({
      name: "upSkill Instructor",
      email: "instructor@upskill.demo",
      passwordHash: await bcrypt.hash("DemoPass123!", 12),
      role: "instructor",
    });
  for (const s of samples) {
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await Course.updateOne(
      { title: s.title },
      {
        $setOnInsert: {
          ...s,
          slug,
          instructor: instructor._id,
          status: "published",
        },
      },
      { upsert: true },
    );
  }
  console.log(
    "Seed complete. Demo instructor: instructor@upskill.demo / DemoPass123! (change/remove before deployment).",
  );
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
