import mongoose from "mongoose";

const connectToDB = async (uri: string) => {
  try {

    //If uri not defined
    if (!uri) {
      console.error("URI is not defined");
      throw new Error("URI is not defined");
    }

    await mongoose.connect(uri);

    //Log when connected
    console.log("Connected to DB Successfully.");
  } catch (error) {
    console.error(`Error while connecting to DB: ${error}`);
    throw new Error(`Error while connecting to DB: ${error}`);
  }
};

export default connectToDB;