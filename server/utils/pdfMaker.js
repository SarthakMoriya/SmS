import fs from "fs";
import { jsPDF } from "jspdf";

export const createPDF = (data) => {
  // Create a new jsPDF instance
  const doc = new jsPDF();
  let y = 10; // Initialize the y coordinate

  // Add content to the PDF
  doc.text("Name: " + data?.studentName, 10, y);
  y += 10; // Increment y
  doc.text("Enrolled On: " + data?.enrolledAt, 10, y);
  y += 10; // Increment y
  doc.text("Teacher: " + data?.teacherName, 10, y);
  y += 10; // Increment y
  doc.text("Grade: " + data?.grade, 10, y);
  y += 10; // Increment y

  data.exams.forEach((ex) => {
    doc.text(
      "Exam Name: " +
        ex.name +
        "   Marks Obtained: " +
        ex.mo +
        "   Marks Total: " +
        ex.mt,
      10,
      y
    );
    y += 10; // Increment y for each exam
  });

  // Save the PDF to a file
  const pdfFileName = "user_information.pdf";
  const pdfData = doc.output();
  fs.writeFileSync(pdfFileName, pdfData, "binary");

  console.log(`PDF saved to ${pdfFileName}`);
};
