
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
    }
};

export default connectDB;