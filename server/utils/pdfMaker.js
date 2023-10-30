import fs from "fs";
import { jsPDF } from "jspdf";

export const createPDF = (data) => {
  // Create a new jsPDF instance
  const doc = new jsPDF();
  let y = 105; // Initialize the y coordinate

  doc.setFont("helvetica");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(16);
  doc.text("Student Report", 105, 20, "center");
  doc.setDrawColor(0);
  doc.line(20, 25, 190, 25);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.rect(20, 70, 170, 100);
  doc.text("Student Information", 105, 85, "center");

  // Add content to the PDF
  doc.text("Name: " + data?.studentName, 40, y);
  y += 10; // Increment y
  doc.text("Enrolled On: " + data?.enrolledAt, 40, y);
  y += 10; // Increment y
  doc.text("Teacher: " + data?.teacherName, 40, y);
  y += 10; // Increment y
  doc.text("Grade: " + data?.grade, 40, y);
  y += 10; // Increment y

  // Exams section
  // Exams section
  doc.text("Exams Taken", 105, 170, "center");
  doc.rect(20, 175, 170, 75);

  // Add a table with borders
  const cellWidth = 35;
  const cellHeight = 10;
  let x = 25;
   y = 180;

  // Table headers with a different background color
  // doc.setFillColor(211, 211, 211); // Header background color
  doc.rect(x, y, cellWidth, cellHeight, "F");
  doc.text("EXAM", x + 5, y + 5);
  x += cellWidth;
  doc.rect(x, y, cellWidth, cellHeight, "F");
  doc.text("MARKS OBTAINED", x + 5, y + 5);
  x += cellWidth;
  doc.rect(x, y, cellWidth, cellHeight, "F");
  doc.text("MARKS TOTAL", x + 5, y + 5);
  x += cellWidth;
  doc.rect(x, y, cellWidth, cellHeight, "F");
  doc.text("GRADE", x + 5, y + 5);

  data.exams.forEach((ex) => {
    x = 25;
    doc.rect(x, y, cellWidth, cellHeight);
    doc.text(ex.name, x + 5, y + 5);
    x += cellWidth;
    doc.rect(x, y, cellWidth);
    doc.text(ex.mo, x + 5, y + 5);
    x += cellWidth;
    doc.rect(x, y, cellWidth);
    doc.text(ex.mt, x + 5, y + 5);
    x += cellWidth;
    doc.rect(x, y, cellWidth);
    doc.text("A", x + 5, y + 5); // Replace "A" with actual grade information
    y += cellHeight;
  });

  const footerText = "© 2023 Weebcooks. All rights reserved.";
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(footerText, pageWidth / 2, 290, "center");
  // Save the PDF to a file
  const pdfFileName = "user_information.pdf";
  const pdfData = doc.output();
  fs.writeFileSync(pdfFileName, pdfData, "binary");

  console.log(`PDF saved to ${pdfFileName}`);
};
