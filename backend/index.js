import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./db/initDb.js";

import authRoutes from "./routes/auth-route.js"

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5731",
    credentials: true
}));

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on link http://localhost:${port}`);
    connectDB();
})