import bcrypt from "bcrypt";

import User from "../model/user-model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

const saltRounds = 10;

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const hashedPasword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPasword,
        });
        await newUser.save();

        const showUser = {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        };

        res.status(201).json({ message: "User registered successfully", user: showUser });
    } catch (error) {
        console.error(`register funciton error: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(res, user._id);

        const showUser = {
            username: user.username,
            email: user.email,
            role: user.role,
        };

        res.status(201).json({ message: "User logged in successfully", user: showUser });
    } catch (error) {
        console.error(`Login function error: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(`Logout function error: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const showUser = {
            username: user.username,
            email: user.email,
            role: user.role,
        };

        res.status(201).json({ message: "User logged in successfully", user: showUser });
    } catch (error) {
        console.error(`CheckAuth function error: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}
