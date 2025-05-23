import mongoose from "mongoose";

const mongoDbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error DB connection: ${error.message}`);
    process.exit(1);
  }
};

export default mongoDbConnection;
