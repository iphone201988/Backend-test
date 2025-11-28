import mongoose from "mongoose";

export  function connectMongoDB(url) {
  return mongoose.connect(url).then(() => {
    console.log("MongoDB Connected");
  });
}
