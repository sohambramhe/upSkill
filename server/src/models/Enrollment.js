import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    completedLessons: [String],
    progress: { type: Number, default: 0 },
    completedAt: Date,
  },
  { timestamps: true },
);
schema.index({ student: 1, course: 1 }, { unique: true });
export default mongoose.model("Enrollment", schema);
