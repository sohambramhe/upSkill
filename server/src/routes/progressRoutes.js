import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { updateProgress } from "../controllers/progressController.js";
const router = Router();
router.patch("/:courseId", protect, updateProgress);
export default router;
