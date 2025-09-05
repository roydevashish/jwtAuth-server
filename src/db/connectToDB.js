import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const DB = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log(`✅ MongoDB connected. DB HOST: ${DB.connection.host}`);
  } catch (error) {
    console.log(`🚫 MongoDB connection error:`);
    console.log(error);
    process.exit(1);
  }
}

export default connectToDB;