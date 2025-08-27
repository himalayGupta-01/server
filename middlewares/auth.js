import jwt from "jsonwebtoken";
function auth(req,res,next){
    try{
        const token=req.cookies.jwtToken;
        if(!token) return res.status(401).json({message:"Unauthorized no token"});
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.studentId=verified.studentId;
        next();
    }
    catch(error){
        res.status(401).json({message:"Unauthorized error occured"});
    }
}

export default auth