const jwt=require("jsonwebtoken")
const tokenblacklistmodel=require("../models/blacklist.model")

async function authUser(req,res,next){
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }

    const isTokenBlacklisted = await tokenblacklistmodel.findOne({ token });

    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Token is blacklisted"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded
        next()
    }catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }

}


module.exports={authUser}