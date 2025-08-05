import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./db/initDb.js";

import authRoutes from "./routes/auth-route.js"
import profileRoutes from "./routes/profile-routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.listen(port, () => {
    console.log(`Server is running on link http://localhost:${port}`);
    connectDB();
})