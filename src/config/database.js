import mongoose from "mongoose";

const mongooseConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.noqrp.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connection was successful");
  } catch (error) {
    console.log("Error trying to connect to MongoDB " + error);
  }
};

export default mongooseConnection;
