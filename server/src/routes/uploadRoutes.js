import { Router } from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { uploadSignature } from "../controllers/uploadController.js";
const router = Router();
router.post(
  "/signature",
  protect,
  allowRoles("instructor", "admin"),
  uploadSignature,
);
export default router;
