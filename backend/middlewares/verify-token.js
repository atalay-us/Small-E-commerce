import jwt from 'jsonwebtoken';
import User from '../model/user-model.js';

export const verifyToken =async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized access, token is missing." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized access, invalid token." });
        }

        const userId = decoded.userId;
        const user =await User.findById(userId);

        if (!user){
            return res.status(404).json({error:"User not found."})
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Verify-token function error: ", error);
        return res.status(500).json({ error: "Internal server error" })
    }
}