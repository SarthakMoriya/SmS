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
  updateRecordCertificate,
  updateRecordExam,
  getSimilarCoursesRecord
} from "../controllers/recordController.js";
import { checkToken } from "../middlewares/admin.js";

const router = express.Router();

router.get("/getrecords" ,getRecords);
router.get("/createrecord", createRecord);
router.get("/getrecord/:id", getRecord);
router.get('/getstudents/:id',checkToken ,getTeacherRecords);
router.get('/getsimilarcourserecords/:name',getSimilarCoursesRecord);

router.post("/createrecord", createRecord);
router.post('/downloadrecord', downloadRecord);

router.patch("/updaterecord", updateRecordExam);
router.patch("/certificate",updateRecordCertificate);
router.patch("/deleterecordexam", deleteRecordExam);
router.patch("/updatefullrecord/:id", updateRecord);

router.delete("/deleterecord/:id", deleteRecord);

export default router;
