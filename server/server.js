import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import recordRouter from "./routes/recordRouter.js"; // Update this import statement
import userRouter from "./routes/auth.js";
import "dotenv/config";
import connectDB from "./utils/connectDb.js";


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

/* ROUTES */
app.use("/records", recordRouter);
app.use("/auth", userRouter);

app.listen(process.env.PORT, async () => {
  connectDB();
  console.log("Server listening on PORT: 8000");
});
