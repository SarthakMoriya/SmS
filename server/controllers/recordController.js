import Record from "../models/record.js";
import {  pdfMaker } from "../utils/pdfMaker.js";

//-------------------------------CREATING RECORD----------------------------- */

export const createRecord = async (req, res) => {
  try {
    // http://localhost:8000/records/createrecord
    console.log("REQUEST RECIEVED");

    const record = await Record.create({ ...req.body });
    await record.save();
    // Sending the record created as response
    res.status(200).json({record,ok:true});
  } catch (error) {
    res.status(404).json({ message: error.message, error,ok:false });
  }
};

//-------------------------------GETTING ALL RECORDS----------------------------- */

export const getRecords = async (req, res) => {
  try {
    // http://localhost:8000/records/getrecords
    const records = await Record.find();
    // Sending the records as response
    res.status(200).json(records);
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
export const deleteRecordExam = async (req, res) => {
  try {
    // localhost:8000/records/deleterecordexam
    const { id } = req.body.id;
    console.log(id);
    // Fetching record from Database matching req.body.id
    const record = await Record.findById({ _id: id });
    // If wrong record Id was passed. Send Error message back to user
    if (!record) {
      res.status(401).json({ message: "Record not found" });
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

    res.status(201).json({ exams: newExams });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateRecordCertificate=async(req,res)=>{
  try {
    await Record.findByIdAndUpdate(req.body.id,{certificate:req.body.certificate})
    res.send({})
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

//-------------------------------GETTING SINGLE RECORD----------------------------- */

export const getRecord = async (req, res) => {
  try {
    // http://localhost:8080/records/getrecord/:id
    // Fetching record from id recieved through req.params.id
    const { id } = req.params;

    const record = await Record.findById(id);

    //If wrong recordId was send
    if (!record) return res.status(500).json({ message: "Record not found!" });

    //Sending back record found
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//-------------------------------DELETE ENTIRE RECORD----------------------------- */
export const deleteRecord = async (req, res) => {
  try {
    // http://localhost:8080/records/deleterecord/:id
    // Deleting record by record id as in req.params.id
    await Record.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Record deleted!" });
  } catch (error) {
    return res.status(404).json({ message: "Record not found!" });
  }
};

//-------------------------------UPDATE ENTIRE RECORD----------------------------- */

export const updateRecord = async (req, res) => {
  try {
    console.log(req.params.id);
    const record = await Record.findById(req.params.id);
    console.log(record);
    //If wrong recordId was send
    if (!record) return res.status(500).json({ message: "Record not found!" });

    await Record.findByIdAndUpdate({ _id: req.params.id }, { ...req.body });
    res.status(200).json({ message: "Record updated" });
  } catch (error) {
    return res.status(404).json({ message: "Record not found!" });
  }
};

//-------------------------------DOWNLOAD RECORD----------------------------- */

export const downloadRecord = (req, res) => {
  try {
    console.log(req.body.data)
    // createPDF(req.body.data);
    pdfMaker({name: req.body.data?.studentName,id:req.body.data?.id})
    res.status(200).json({ message: "Record" });
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