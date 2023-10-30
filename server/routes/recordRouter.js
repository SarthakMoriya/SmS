import express from "express";
import {
  createRecord,
  deleteRecord,
  deleteRecordExam,
  getRecord,
  getRecords,
  updateRecordExam,
} from "../controllers/recordController.js";

const router = express.Router();

router.post("/createrecord", createRecord);
router.get("/getrecords", getRecords);
router.patch("/updaterecord", updateRecordExam);
router.patch("/deleterecordexam", deleteRecordExam);
router.get("/getrecord/:id", getRecord);
router.delete("/deleterecord/:id", deleteRecord);
export default router;
