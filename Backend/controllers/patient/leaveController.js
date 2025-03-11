// controllers/patient/leaveController.js
import LeaveForm from "../../models/LeaveForm.js";

// Get all leave forms for the patient
export const getLeaveForms = async (req, res, next) => {
  try {
    const leaveForms = await LeaveForm.find({ patient: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ leaveForms });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new leave form after the file has been stored in GridFS.
 * Instead of using req.file.filename, we use the provided gridFsFileId.
 *
 * This function is intended to be called from your route, after you
 * have streamed the uploaded file into GridFS and obtained its _id.
 */
export const submitLeaveFormWithGridFS = async (req, gridFsFileId, next) => {
  try {
    const { reason } = req.body;
    const leaveForm = await LeaveForm.create({
      patient: req.user._id,
      reason,
      reportFile: gridFsFileId, // Store the GridFS file ID
      status: "Pending",
    });
    return leaveForm;
  } catch (error) {
    next(error);
  }
};
