import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const updateProgress = asyncHandler(async (req, res) => {
  const { lessonId, completed = true } = req.body;
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });
  if (!enrollment)
    return res.status(403).json({ message: "Enroll in this course first" });
  const course = await Course.findById(req.params.courseId);
  const allLessons =
    course?.sections?.reduce((n, s) => n + s.lessons.length, 0) || 0;
  if (!allLessons)
    return res.status(400).json({ message: "Course has no lessons yet" });
  const id = String(lessonId);
  const set = new Set(enrollment.completedLessons.map(String));
  if (completed) set.add(id);
  else set.delete(id);
  enrollment.completedLessons = [...set];
  enrollment.progress = Math.round((set.size / allLessons) * 100);
  if (enrollment.progress === 100) enrollment.completedAt = new Date();
  else enrollment.completedAt = undefined;
  await enrollment.save();
  res.json({
    progress: enrollment.progress,
    completedLessons: enrollment.completedLessons,
  });
});
