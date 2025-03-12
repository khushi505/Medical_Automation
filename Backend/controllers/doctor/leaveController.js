// controllers/doctor/leaveController.js
import LeaveForm from "../../models/LeaveForm.js";

// Get all OD/ML leave forms (submitted by patients/students)
export const getAllLeaveForms = async (req, res, next) => {
  try {
    const leaveForms = await LeaveForm.find({}).sort({ createdAt: -1 });
    res.status(200).json({ leaveForms });
  } catch (error) {
    next(error);
  }
};

// Update the status of a leave form (Approve or Reject)
export const updateLeaveFormStatus = async (req, res, next) => {
  try {
    const { leaveFormId, status } = req.body; // status should be "Approved" or "Rejected"
    const leaveForm = await LeaveForm.findByIdAndUpdate(
      leaveFormId,
      { status },
      { new: true }
    );
    if (!leaveForm) {
      return res.status(404).json({ message: "Leave form not found" });
    }
    res.status(200).json({ message: "Leave form status updated", leaveForm });
  } catch (error) {
    next(error);
  }
};
