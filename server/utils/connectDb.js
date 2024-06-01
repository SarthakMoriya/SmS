import mongoose from "mongoose";
function connectDB() {
  mongoose
    .connect(
      process.env.MONGODB_URL?.replace(
        "<password>",
        process.env.MONGODB_PASSWORD
      )
    )
    .then(() => {
      console.log("DB connection established");
    })
    .catch((err) => {
      console.log(err);
    });
}

export default connectDB