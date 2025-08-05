import bcrypt from "bcrypt";

import User from "../model/user-model.js";
import cloudinary from "../cloudinary/cloudinaryConfig.js"

const saltRounds = 10;

export const changeUserInfo = async (req, res) => {
    try {
        const { username, newPassword, oldPassword } = req.body;
        const userId = req.user._id;
        const paramsId = req.params.id;

        if (!username && !newPassword && !oldPassword) {
            return res.status(400).json({ error: "No information provided to change." });
        }

        const user = await User.findById(paramsId);
        if (!user) {
            return res.status(404).json({ error: "User not found." })
        }

        if (username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) return res.status(400).json({ error: "Username already exists" });

            if (user.username === username) return res.status(400).json({ error: "New username cannot be the same as the current one." });

            if (userId.toString() !== user._id.toString()) return res.status(403).json({ error: "You can only change your own username." });

            user.username = username;
        }

        if ((newPassword && !oldPassword) || (!newPassword && oldPassword)) return res.status(400).json({ error: "Both old and new passwords must be provided." });

        if (newPassword && oldPassword) {
            if (newPassword === oldPassword) return res.status(400).json({ error: "New password cannot be the same as the old password." });

            if (userId.toString() !== user._id.toString()) return res.status(403).json({ error: "You can only change your own password." });

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Old password is incorrect." });
            }
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
        }

        await user.save();

        const showUser = {
            username: user.username,
            email: user.email,
        };

        res.status(201).json({ message: "Profile info updated successfully", user: showUser });
    } catch (error) {
        console.error(`ChangeUserInfo function error: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const changeProfileImg = async (req, res) => {
    try {
        const { profileImg } = req.body;
        const userId = req.user._id;
        const paramsId = req.params.id;

        if (userId.toString() !== paramsId.toString()) {
            return res.status(403).json({ error: "You can only change your own profile image." });
        }

        const user = await User.findById(paramsId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (!profileImg) {
            return res.status(400).json({ error: "Profile image is required." });
        }
        if (user.profileImg) {
            const publicId = user.profileImg.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`profile_images/${publicId}`);
        }

        const uploadResponse = await cloudinary.uploader.upload(profileImg, {
            folder: "profile_images", 
        });

        user.profileImg = uploadResponse.secure_url;
        await user.save();

        const showUser = {
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
        };

        res.status(200).json({ message: "Profile image changed successfully", user: showUser });
    } catch (error) {
        console.error(`ChangeProfileImg function error: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
};