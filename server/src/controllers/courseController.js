import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") +
  "-" +
  Math.random().toString(36).slice(2, 7);
export const listCourses = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    level,
    sort = "newest",
    page = 1,
    limit = 12,
  } = req.query;
  const filter = { status: "published" };
  if (category && category !== "All") filter.category = category;
  if (level && level !== "All levels") filter.level = level;
  if (q) filter.$text = { $search: q };
  const sortMap = {
    newest: { createdAt: -1 },
    rating: { averageRating: -1 },
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
  };
  const p = Math.max(1, Number(page) || 1),
    l = Math.min(48, Math.max(1, Number(limit) || 12));
  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate("instructor", "name avatar")
      .sort(sortMap[sort] || sortMap.newest)
      .skip((p - 1) * l)
      .limit(l),
    Course.countDocuments(filter),
  ]);
  res.json({ courses, total, page: p, pages: Math.ceil(total / l) });
});
export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    $or: [
      { _id: /^[0-9a-fA-F]{24}$/.test(req.params.id) ? req.params.id : null },
      { slug: req.params.id },
    ],
  }).populate("instructor", "name avatar");
  if (
    !course ||
    (course.status !== "published" &&
      String(course.instructor?._id) !== String(req.user?._id) &&
      req.user?.role !== "admin")
  )
    return res.status(404).json({ message: "Course not found" }); // Never expose paid lesson video URLs on the public course-detail endpoint.
  const safeCourse = course.toObject();
  for (const section of safeCourse.sections || []) {
    for (const lesson of section.lessons || []) {
      if (!lesson.isPreview) delete lesson.videoUrl;
    }
  }
  res.json({ course: safeCourse });
});
export const getCourseLearning = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    $or: [
      { _id: /^[0-9a-fA-F]{24}$/.test(req.params.id) ? req.params.id : null },
      { slug: req.params.id },
    ],
  });
  if (!course || course.status !== "published")
    return res.status(404).json({ message: "Published course not found" });
  const isOwner =
    String(course.instructor) === String(req.user._id) ||
    req.user.role === "admin";
  const enrolled = await Enrollment.exists({
    student: req.user._id,
    course: course._id,
  });
  if (!isOwner && !enrolled)
    return res
      .status(403)
      .json({ message: "Enroll in this course to access its lessons" });
  res.json({ course });
});
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category)
    return res
      .status(400)
      .json({ message: "Title, description and category are required" });
  const course = await Course.create({
    ...req.body,
    slug: slugify(title),
    instructor: req.user._id,
    status: "draft",
  });
  res.status(201).json({ course });
});
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (
    String(course.instructor) !== String(req.user._id) &&
    req.user.role !== "admin"
  )
    return res.status(403).json({ message: "Not your course" });
  const allowed = [
    "title",
    "subtitle",
    "description",
    "category",
    "level",
    "language",
    "price",
    "compareAtPrice",
    "thumbnail",
    "sections",
    "learningOutcomes",
    "requirements",
    "status",
  ];
  for (const key of allowed)
    if (req.body[key] !== undefined) course[key] = req.body[key];
  if (req.body.title) course.slug = slugify(req.body.title);
  await course.save();
  res.json({ course });
});
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (
    String(course.instructor) !== String(req.user._id) &&
    req.user.role !== "admin"
  )
    return res.status(403).json({ message: "Not your course" });
  await course.deleteOne();
  res.json({ message: "Course deleted" });
});
export const myCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: "course",
      populate: { path: "instructor", select: "name avatar" },
    })
    .sort({ createdAt: -1 });
  res.json({ enrollments });
});
export const myTeaching = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({
    updatedAt: -1,
  });
  res.json({ courses });
});
