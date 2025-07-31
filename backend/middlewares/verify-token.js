import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
       const { token} = req.cookies;

       if(!token){
        return res.status(401).json({error:"Unauthorized access, token is missing."});
       }

       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       if(!decoded){
        return res.status(401).json({error:"Unauthorized access, invalid token."});
       }

       req.userId = decoded.userId;
       next();
    } catch (error) {
        console.error("Verify-token function error: ",error);
        return res.status(500).json({ error:"Internal server error"})
    }
}