import express from "express";
import cors from "cors";
import recordRouter from "./routes/recordRouter.js"; // Update this import statement
import userRouter from "./routes/auth.js";
import "dotenv/config";
import connectDB from "./utils/connectDb.js";


/**CONFIGURATIONS */

const app = express();
app.use(cors());
app.use(express.json());


/* ROUTES */
app.use("/records", recordRouter);
app.use("/auth", userRouter);

app.listen(process.env.PORT, async () => {
  connectDB();
  console.log("Server listening on PORT: 8000");
});
