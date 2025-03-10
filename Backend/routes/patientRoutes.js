// routes/patientRoutes.js
import express from "express";
import {
  getProfile,
  bookAppointment,
  submitLeaveForm,
} from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import gridFsStorage from "../config/gridfs.js";

// Configure multer for file uploads (ensure an 'uploads' folder exists)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: gridFsStorage });
const router = express.Router();

router.get("/profile", protect, getProfile);
router.post("/book-appointment", protect, bookAppointment);
router.post("/submit-leave", protect, upload.single("report"), submitLeaveForm);

export default router;
