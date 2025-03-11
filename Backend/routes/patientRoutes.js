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

// Use diskUpload (a multer instance with diskStorage) for file uploads.
const upload = diskUpload;

// 1. Profile Endpoints
router.get("/profile", protect, getProfile);
router.put("/profile", protect, editProfile);

// 2. Appointments Endpoints
router.get("/appointments", protect, getAppointments);
router.post("/book-appointment", protect, bookAppointment);

// 3. Leave Forms Endpoints
router.get("/leave-forms", protect, getLeaveForms);

// For submitting a leave form, we first save the file to disk using multer,
// then manually stream it to GridFS and create a LeaveForm document with the file's GridFS _id.
router.post(
  "/submit-leave",
  protect,
  upload.single("report"),
  async (req, res, next) => {
    try {
      // Create a GridFSBucket using the current Mongoose connection.
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      // Open an upload stream to GridFS with the original filename.
      const uploadStream = bucket.openUploadStream(req.file.originalname);

      // Pipe the file from disk (the temporary folder) into GridFS.
      fs.createReadStream(req.file.path)
        .pipe(uploadStream)
        .on("error", (err) => next(err))
        .on("finish", async () => {
          try {
            // Retrieve the newly assigned file ID from the uploadStream.
            const gridFsFileId = uploadStream.id;

            // Call our controller function to create the LeaveForm document using the GridFS file ID.
            const leaveForm = await submitLeaveFormWithGridFS(
              req,
              gridFsFileId,
              next
            );

            // Optionally, delete the temporary file from disk.
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

// 4. Seasonal Advisory Endpoint
router.get("/seasonal-advisory", protect, getSeasonalAdvisory);

export default router;
