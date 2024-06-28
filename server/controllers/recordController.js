import { RedisFlushModes } from "redis";
import Record from "../models/record.js";
import client from "../redis.js";
import { pdfMaker } from "../utils/pdfMaker.js";

//-------------------------------CREATING RECORD----------------------------- */
export const createRecord = async (req, res) => {
  try {
    // http://localhost:8000/records/createrecord

    const record = await Record.create({ ...req.body });
    await record.save();
    let records = await Record.find();
    await client.set("records", JSON.stringify(records));
    // Sending the record created as response
    res.status(200).json({ record, ok: true });
  } catch (error) {
    res.status(404).json({ message: error.message, error, ok: false });
  }
};

//-------------------------------GETTING ALL RECORDS----------------------------- */
export const getRecords = async (req, res) => {
  try {
    // http://localhost:8000/records/getrecords
    let records = JSON.parse(await client.get("records"));
    if (records == null || records.length == 0) {
      records = await Record.find();
      await client.set("records", JSON.stringify(records));
    }
    // Sending the records as response
    res.status(200).json(records);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//-------------------------------UPDATING SINGLE RECORD EXAM----------------------------- */
// removed in redis branch
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
//removed in redis branch
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
    // localhost:8000/records/certificate
    await Record.findByIdAndUpdate(req.body.id, {
      certificate: req.body.certificate,
    });
    let oldRecords = JSON.parse(await client.get("records"));
    if (oldRecords?.length) {
      let currentRec = oldRecords.find((rec) => rec._id == req.body.id);
      if (currentRec) {
        currentRec.certificate = req.body.certificate;
        let newRecords = oldRecords.map((rec) => {
          if (rec._id == req.body.id) {
            rec = currentRec;
            return rec;
          } else return rec;
        });
        
        await client.set("records", JSON.stringify(newRecords));
      }
    }
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
    let records = JSON.parse(await client.get("records"));
    if (records.length > 0) {
      let record = records.filter((record) => {
        return record._id == id;
      });
      console.log(record)
      if (record.length > 0) {
        return res.status(200).json({ data: record[0] });
      } else {
        return res
          .status(500)
          .json({ message: "Record not found!", ok: false });
      }
    } else {
      const record = await Record.findById(id);

      //If wrong recordId was send
      if (!record)
        return res
          .status(500)
          .json({ message: "Record not found!", ok: false });

      //Sending back record found
      return res.status(200).json({ data: record });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//-------------------------------DELETE ENTIRE RECORD----------------------------- */
export const deleteRecord = async (req, res) => {
  try {
    // http://localhost:8080/records/deleterecord/:id

    // Deleting record by record id as in req.params.id
    let result = await Record.findByIdAndDelete(req.params.id);
    if (result._id) {
      let records = JSON.parse(await client.get("records"));
      if (records.length > 0) {
        let updatedRecords = records.filter(
          (record) => record._id !== req.params.id
        );
        await client.set("records", JSON.stringify(updatedRecords));
      }
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
    let oldRecords = JSON.parse(await client.get("records"));
    if (oldRecords?.length) {
      console.log("Old record parsed")
      let currentRec = oldRecords.find((rec) => rec._id == req.body.data.id);
      if (currentRec) {
        console.log("Found curr rec")
        currentRec.isDataUploaded=true
        let newRecords = oldRecords.map((rec) => {
          if (rec._id == req.body.data.id) {
            rec = currentRec;
            return rec;
          } else return rec;
        });
        
        await client.set("records", JSON.stringify(newRecords));
      }
    }
    pdfMaker({ name: req.body.data?.studentName, id: req.body.data?.id });
    res.status(200).json({ message: "Record", record: record });
  } catch (error) {
    res.status(200).json({ message: "Record" });
  }
};
//-------------------------------FETCH RECORDS OF A TEACHER----------------------------- */
export const getTeacherRecords = async (req, res) => {
  try {
    let records = JSON.parse(await client.get("records"));
    if (records.length > 0 && records != null) {
      let teacherRecords = records.filter(
        (record) => record.teacherId === req.params.id
      );
      if (teacherRecords.length > 0) {
        return res.status(200).json({ records });
      } else {
        return res.status(404).send({ message: "No Records", records });
      }
    } else {
      const records = await Record.find({ teacherId: req.params.id });
      return res.status(200), json({ message: "Records", records });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error", error });
  }
};
// *********************************SAVE ALL RECORD IN CACHE*********************************
export const saveRecordsCache = async (req, res) => {
  try {
    const records = await Record.find();
    await client.set("records", JSON.stringify(records), async (err, data) => {
      if (err) {
        console.log("Error saving records");
        return;
      }
      if (data) console.log(JSON.parse(data));
    });

    console.log(records);
  } catch (error) {
    console.log(error);
  }
};


export const getSimilarCoursesRecord=async(req,res)=>{
  try {
    const Records=await Record.find({studentCourse:req.params.name})
    res.status(200).send(Records)
  } catch (error) {
    res.status(500).send(error.message);
  }
}