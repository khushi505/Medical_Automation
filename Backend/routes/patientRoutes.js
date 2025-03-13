// routes/patientRoutes.js
import express from "express";
import {
  getProfile,
  editProfile,
  getAppointments,
  bookAppointment,
  getLeaveForms,
  submitLeaveFormWithGridFS,
  getSeasonalAdvisory,
} from "../controllers/patient/index.js"; // re-exports from patient controllers
import { protect } from "../middleware/authMiddleware.js";
import diskUpload from "../config/diskUpload.js"; // our disk storage configuration
import mongoose from "mongoose";
import fs from "fs";
import { GridFSBucket } from "mongodb";

const router = express.Router();
const upload = diskUpload;

// 1. Profile Endpoints
router.get("/profile", protect, getProfile);
router.put("/profile", protect, editProfile);

// 2. Appointments Endpoints
router.get("/appointments", protect, getAppointments);
router.post("/book-appointment", protect, bookAppointment);

// 3. Leave Forms Endpoints
router.get("/leave-forms", protect, getLeaveForms);

// 4. Submit Leave Form (with optional file)
router.post(
  "/submit-leave",
  protect,
  upload.single("report"), // "report" must match formData.append("report", file)
  async (req, res, next) => {
    try {
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      // If no file was uploaded, handle that case first
      if (!req.file) {
        // Just create a leave form without a file
        const leaveForm = await submitLeaveFormWithGridFS(req, null, next);
        return res.status(201).json({
          message: "Leave form submitted successfully (no file uploaded)",
          leaveForm,
        });
      }

      // If a file is uploaded, proceed with GridFS streaming
      const uploadStream = bucket.openUploadStream(req.file.originalname);
      fs.createReadStream(req.file.path)
        .pipe(uploadStream)
        .on("error", (err) => next(err))
        .on("finish", async () => {
          try {
            const gridFsFileId = uploadStream.id;
            const leaveForm = await submitLeaveFormWithGridFS(
              req,
              gridFsFileId,
              next,
              req.file.originalname
            );

            // Optionally remove the temp file
            fs.unlink(req.file.path, (unlinkErr) => {
              if (unlinkErr)
                console.error("Error deleting temp file:", unlinkErr);
            });

            res.status(201).json({
              message: "Leave form submitted successfully",
              leaveForm,
            });
          } catch (controllerError) {
            next(controllerError);
          }
        });
    } catch (error) {
      next(error);
    }
  }
);

// 5. Seasonal Advisory Endpoint
router.get("/seasonal-advisory", protect, getSeasonalAdvisory);

export default router;
