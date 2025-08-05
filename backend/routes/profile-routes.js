import express from "express";

import { verifyToken } from "../middlewares/verify-token.js";
import { changeUserInfo, changeProfileImg } from "../controllers/profile-controller.js";

const router = express.Router();

router.post("/change-info/:id", verifyToken, changeUserInfo);

router.post("/change-profile-img/:id", verifyToken, changeProfileImg);

export default router;