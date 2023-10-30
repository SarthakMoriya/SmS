import express from "express";
import mongoose from "mongoose";
import cors from 'cors'

import recordRouter from "./routes/recordRouter.js"; // Update this import statement
import userRouter from './routes/auth.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use("/records", recordRouter);
app.use('/auth',userRouter)
mongoose
  .connect(
    "mongodb+srv://sarthak:o5KGgVlBSMYcuvIn@cluster0.vrzv9dm.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB connection established");
  });

app.listen(8000, () => {
  console.log("Server listening on PORT: 8000");
})
