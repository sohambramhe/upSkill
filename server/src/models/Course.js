import mongoose from "mongoose";
const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    duration: Number,
    isPreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);
const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lessons: [lessonSchema],
    order: { type: Number, default: 0 },
  },
  { _id: true },
);
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, unique: true, sparse: true },
    subtitle: { type: String, default: "" },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All levels"],
      default: "Beginner",
    },
    language: { type: String, default: "English" },
    price: { type: Number, min: 0, default: 0 },
    compareAtPrice: { type: Number, min: 0, default: 0 },
    thumbnail: { type: String, default: "" },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sections: [sectionSchema],
    learningOutcomes: [String],
    requirements: [String],
    status: {
      type: String,
      enum: ["draft", "published", "rejected"],
      default: "draft",
    },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
courseSchema.index({ title: "text", description: "text", category: "text" });
export default mongoose.model("Course", courseSchema);
