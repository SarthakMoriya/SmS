import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import multer from "multer";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import recordRouter from "./routes/recordRouter.js"; // Update this import statement
import userRouter from "./routes/auth.js";
import { signup } from "./controllers/userController.js";
import { createRecord } from "./controllers/recordController.js";
import "dotenv/config";
import { data } from "./data/MOCK_DATA.js";
import Record from "./models/record.js";

/**CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/pdfs", express.static(path.join(__dirname, "uploads", "pdfs")));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // Increase limit as needed
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/**FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({
      message: "Image uploaded successfully",
      filename: req.file.filename,
    });
  } else {
    res.status(400).json({ message: "No file selected" });
  }
});
app.post("/records/createrecord", upload.single("image"), createRecord);
app.post("/records/savecertificate", upload.single("image"));
app.post("/auth/signup", upload.single("image"), signup);

app.use("/records", recordRouter);
app.use("/auth", userRouter);

mongoose
  .connect(
    process.env.MONGODB_URL.replace("<password>", process.env.MONGODB_PASSWORD)
  )
  .then(() => {
    console.log("DB connection established");
  }).catch(err=>{
    console.log(err)
  })

app.listen(process.env.PORT, async () => {
  console.log("Server listening on PORT: 8000");
  // data.forEach((data) => Record.create({ ...data }));
});
