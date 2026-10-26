import { Router } from "express";
import {
  listCourses,
  getCourse,
  getCourseLearning,
  createCourse,
  updateCourse,
  deleteCourse,
  myCourses,
  myTeaching,
} from "../controllers/courseController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/", listCourses);
router.get("/mine/enrolled", protect, myCourses);
router.get(
  "/mine/teaching",
  protect,
  allowRoles("instructor", "admin"),
  myTeaching,
);
router.get("/:id/learning", protect, getCourseLearning);
router.post("/", protect, allowRoles("instructor", "admin"), createCourse);
router.get("/:id", getCourse);
router.patch("/:id", protect, allowRoles("instructor", "admin"), updateCourse);
router.delete("/:id", protect, allowRoles("instructor", "admin"), deleteCourse);
export default router;
