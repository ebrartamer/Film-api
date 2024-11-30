const jwt = require("jsonwebtoken");
const APIError = require("../utils/errors");
const User = require("../models/user");
const createToken = async (user,res) => {
    const payload = {
        sub: user._id,
        name: user.name
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return res.status(201).json({
        success: true,
        token,
        message: "Login successful"
    });
}

const tokenCheck = async (req, res, next) => {
    const headerToken = req.headers.authorization;
    const isBearer = headerToken && headerToken.startsWith("Bearer");

    if (!isBearer) return next(new APIError("token is undefined", 401));

    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return next(new APIError("token is invalid", 401));
        
        const userInfo = await User.findById(decoded.id).select("_id email");
        if (!userInfo) return next(new APIError("user not found", 401));

        req.user = userInfo;
        next();
    });
}

module.exports = { createToken, tokenCheck };