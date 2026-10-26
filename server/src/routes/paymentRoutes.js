import { Router } from "express";
import {
  createCheckout,
  enrollFree,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.post("/checkout", protect, createCheckout);
router.post("/free/:courseId", protect, enrollFree);
export default router;
