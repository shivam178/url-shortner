import { STATES, connect, connection } from "mongoose";

if (process.env.LOCAL_ENV) {
  require("dotenv").config({ path: `./.env/.env.${process.env.LOCAL_ENV}` });
}

export const createConn = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await connect(String(mongoURI), {
      autoCreate: false,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected...");
  } catch (err: any) {
    console.error("Error while connection to mongoDB ==>", err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export const serverStatus = () => {
  return {
    dbState: STATES[connection.readyState],
  };
};

export default createConn;
