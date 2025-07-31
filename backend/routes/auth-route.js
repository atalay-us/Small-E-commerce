import express from "express";
import { checkAuth, login, logout, register } from "../controllers/auth-controllers.js";
import { verifyToken } from "../middlewares/verify-token.js";

const router = express.Router();

router.get("/check-auth",verifyToken, checkAuth);

router.post("/login",login);

router.post("/register",register);

router.post("/logout", logout);

export default router;