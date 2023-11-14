import mongoose from "mongoose";

const record = new mongoose.Schema(
  {
    studentName: String,
    studentCourse: String,
    dateEnrolled: String,
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    exams: [{}],
    imageName: {
      type: String,
      default: "",
    },
    certificate: {
      type: String,
      default: "",
    },
    mainExamName: { type: String},
    mainExamMT:{type:Number},
    mainExamMO:{type:Number},
  },
  { timestamps: true }
);

const studentRecord = mongoose.model("stuRecord", record);

export default studentRecord;
