import bcrypt from "bcrypt";

import  User from "../model/user-model.js";

const saltRounds = 10;

export const changeUserInfo = async (req, res) => {
    try {
        const { username, newPassword, oldPassword } = req.body;
        const userId = req.userId;

        if (!username && !newPassword && !oldPassword) {
            return res.status(400).json({ error: "No information provided to change." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        if (username) {
            user.username = username;
        }

        if (newPassword && oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Old password is incorrect." });
            }
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
        }
        // ProfileImg handling will be added later

        await user.save();

        const showUser = {
            username: user.username,
            email: user.email,
            role: user.role,
        };

        res.status(201).json({ message: "User logged in successfully", user: showUser });
    } catch (error) {
        console.error(`ChangeUserInfo function error: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}