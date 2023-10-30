import express from "express";
import {
  createRecord,
  deleteRecord,
  deleteRecordExam,
  downloadRecord,
  getRecord,
  getRecords,
  updateRecord,
  updateRecordExam,
} from "../controllers/recordController.js";

const router = express.Router();

router.post("/createrecord", createRecord);
router.get("/getrecords", getRecords);
router.patch("/updaterecord", updateRecordExam);
router.patch("/deleterecordexam", deleteRecordExam);
router.get("/getrecord/:id", getRecord);
router.delete("/deleterecord/:id", deleteRecord);
router.patch("/updatefullrecord/:id", updateRecord);
router.post('/downloadrecord', downloadRecord);
export default router;
