import express from "express";

import { verifyToken } from "../middlewares/verify-token.js";
import { changeUserInfo } from "../controllers/profile-controller.js";

const router = express.Router();

router.post("/change-info", verifyToken, changeUserInfo);

export default router;