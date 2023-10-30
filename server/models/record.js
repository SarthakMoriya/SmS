import mongoose from "mongoose";

const record = new mongoose.Schema(
  {
    studentName: String,
    studentCourse: String,
    dateEnrolled: Date,
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    exams: [{}],
  },
  { timestamps: true }
);

const studentRecord = mongoose.model("stuRecord", record);

export default studentRecord;

