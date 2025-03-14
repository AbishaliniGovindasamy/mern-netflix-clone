import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";


export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log("MongoDB Connected Successfully:"+ conn.connection.host)
    } catch (error) {
        console.error("Error connecting to DB :"+error.message)
        process.exit(1); //0 means success
        }
}

