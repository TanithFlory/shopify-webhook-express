import mongoose from "mongoose";
import dotenv from "dotenv";
//mongodb+srv://tanith:<password>@cluster0.glj6qqi.mongodb.net/

dotenv.config();

export default async function mongoConnection() {
  try {
    await mongoose.connect(
      `mongodb+srv://tanith:${process.env.MONGODB_PASS}@cluster0.glj6qqi.mongodb.net/modo_door_installation`
    );
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
}
