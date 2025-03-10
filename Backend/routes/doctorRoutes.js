// routes/doctorRoutes.js
import express from "express";
import {
  getProfile,
  getAppointments,
  updateAppointmentStatus,
  addPrescription,
  getLeaveForms,
  updateLeaveFormStatus,
} from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/appointments", protect, getAppointments);
router.post("/update-appointment", protect, updateAppointmentStatus);
router.post("/add-prescription", protect, addPrescription);
router.get("/leave-forms", protect, getLeaveForms);
router.post("/update-leave", protect, updateLeaveFormStatus);

export default router;
