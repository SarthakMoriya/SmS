import { response } from "express";
import Record from "../models/record.js";
import { pdfMaker } from "../utils/pdfMaker.js";
import { client } from "../redis.js";

//-------------------------------CREATING RECORD----------------------------- */
// http://localhost:8000/records/createrecord

export const createRecord = async (req, res) => {
  try {
    const record = await Record.create({ ...req.body });
    await record.save();

    // PUSHING NEW RECORD TO CACHE
    let records = JSON.parse(await client.get("records"));
    if (Array.isArray(records) && records?.length > 0) {
      records.push(record);
      await client.set("records", JSON.stringify(records));
    } else {
      records.push(record);
      await client.set("records", JSON.stringify(records));
    }
    // Sending the record created as response
    res.status(200).json({ record, ok: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message, error, ok: false });
  }
};

//-------------------------------GETTING ALL RECORDS----------------------------- */
// http://localhost:8000/records/getrecords

export const getRecords = async (req, res) => {
  try {
    let records = JSON.parse(await client.get("records"));
    if (Array.isArray(records) && records?.length > 0) {
      return res.status(200).json(records);
    } else {
      records = await Record.find();
      await client.set("records", JSON.stringify(records));
      // Sending the records as response
      res.status(200).json(records);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//-------------------------------UPDATING SINGLE RECORD EXAM----------------------------- */

export const updateRecordExam = async (req, res) => {
  try {
    // localhost:8000/records/updaterecord

    const { id } = req.body;
    // Fetching record from Database matching req.body.id
    const record = await Record.findById({ _id: id.id });
    // If wrong record Id was passed. Send Error message back to user
    if (!record) {
      res.status(401).json({ message: "Record not found" });
    }

    // Logic to update record exam
    let exams = req.body.exams; //old exams array
    let modifiedExam = req.body.modifiedExam; //particular modified exam
    let newExams = []; //array to store new exams array
    exams.forEach((exam) => {
      if (exam.name === req.body.oldExam) {
        //name of exam is equal to name of exam that was changed then push new exam to newExams[] array
        newExams.push(modifiedExam);
      } else {
        newExams.push(exam);
      }
    });
    record.exams = newExams;
    await record.save();

    res.status(201).json({ record });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//-------------------------------DELETING SINGLE RECORD EXAM----------------------------- */
export const deleteRecordExam = async (req, res) => {
  try {
    // localhost:8000/records/deleterecordexam
    const { id } = req.body.id;
    // Fetching record from Database matching req.body.id
    const record = await Record.findById({ _id: id });
    // If wrong record Id was passed. Send Error message back to user
    if (!record) {
      res.status(401).json({ message: "Record not found", ok: false });
    }

    let exams = req.body.exams; //old exams array
    let deletedExam = req.body.examToBeDeleted;
    let newExams = []; //array to store new exams array
    exams.forEach((exam) => {
      if (exam.name !== deletedExam) {
        newExams.push(exam);
      }
    });
    record.exams = newExams;
    await record.save();

    res.status(201).json({ exams: newExams, ok: true });
  } catch (error) {
    res.status(404).json({ message: error.message, ok: false });
  }
};

export const updateRecordCertificate = async (req, res) => {
  try {
    await Record.findByIdAndUpdate(req.body.id, {
      certificate: req.body.certificate,
    });
    res.send("Certificate Uploaded");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//-------------------------------GETTING SINGLE RECORD----------------------------- */

export const getRecord = async (req, res) => {
  try {
    // http://localhost:8080/records/getrecord/:id
    // Fetching record from id recieved through req.params.id
    const { id } = req.params;

    const record = await Record.findById(id);

    //If wrong recordId was send
    if (!record)
      return res.status(500).json({ message: "Record not found!", ok: false });

    //Sending back record found
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//-------------------------------DELETE ENTIRE RECORD----------------------------- */
// http://localhost:8080/records/deleterecord/:id
export const deleteRecord = async (req, res) => {
  try {
    // Deleting record by record id as in req.params.id
    await Record.findByIdAndDelete(req.params.id);

    let records = JSON.parse(await client.get("records"));
    if (Array.isArray(records) && records.length > 0) {
      records = records.filter((rec) => rec._id != req.params.id);
      await client.set("records", JSON.stringify(records));
    }

    return res.status(200).json({ message: "Record deleted!" });
  } catch (error) {
    return res.status(404).json({ message: "Record not found!" });
  }
};

//-------------------------------UPDATE ENTIRE RECORD----------------------------- */

export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    //If wrong recordId was send
    if (!record)
      return res.status(500).json({ message: "Record not found!", ok: false });

    //ASSUMING STUDENT ID WAS NOT UPDATED TO NEW ID
    if (req.body.studentId == record.studentId) {
      const record = await Record.findByIdAndUpdate(
        { _id: req.params.id },
        { ...req.body }
      );
      return res
        .status(200)
        .json({ message: "Record updated", record, ok: true });
    } else {
      //IF STUDENT ID WAS ALSO UPDATED
      //check if already used studentID was sent
      const isUsedStudentId = await Record.findOne({
        studentId: req.body.studentId,
      });

      //IF WE HAD USER WITH THAT STUDENTID SEND ERROR
      if (isUsedStudentId) {
        return res
          .status(500)
          .json({ message: "Please Enter unique StudentId!", ok: false });
      } else {
        //NEW STUDENTID WAS NOT USED BY SOME OTHER RECORD SO UPDATED THE STUDENTID AS WELL AS OTHER DETAILS
        const record = await Record.findByIdAndUpdate(
          { _id: req.params.id },
          { ...req.body }
        );
        return res
          .status(200)
          .json({ message: "Record updated", record, ok: true });
      }
    }
  } catch (error) {
    return res.status(404).json({ message: "Record not found!" });
  }
};

//-------------------------------DOWNLOAD RECORD----------------------------- */

export const downloadRecord = async (req, res) => {
  try {
    const { id } = req.body.data.id;
    const record = await Record.findOne({ id: id });
    console.log(record);
    record.isDataUploaded = true;
    await record.save();
    pdfMaker({ name: req.body.data?.studentName, id: req.body.data?.id });
    res.status(200).json({ message: "Record", record: record });
  } catch (error) {
    res.status(200).json({ message: "Record" });
  }
};

//-------------------------------FETCH RECORDS OF A TEACHER----------------------------- */
export const getTeacherRecords = async (req, res) => {
  try {
    console.log("hihihih");
    const records = await Record.find({ teacherId: req.params.id });
    console.log(records);
    res.status(404).send({ message: "No Records", records });
  } catch (error) {}
};

// *********************************UPLOAD CERTIFICATE*********************************
