import express from "express";
import {
  createRecord,
  deleteRecord,
  deleteRecordExam,
  downloadRecord,
  getRecord,
  getRecords,
  getTeacherRecords,
  updateRecord,
  updateRecordExam,
} from "../controllers/recordController.js";

const router = express.Router();


router.get("/getrecords", getRecords);
router.patch("/updaterecord", updateRecordExam);
router.patch("/deleterecordexam", deleteRecordExam);
router.get("/getrecord/:id", getRecord);
router.delete("/deleterecord/:id", deleteRecord);
router.patch("/updatefullrecord/:id", updateRecord);
router.post('/downloadrecord', downloadRecord);
router.get('/getstudents/:id', getTeacherRecords);
export default router;
