const User = require('../models/user');
const bcrypt = require('bcryptjs');
const APIError = require('../utils/errors');
const Response = require('../utils/response');
const jwt = require('jsonwebtoken');


const createToken = (user, res) => {
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return new Response({ 
        user, 
        token 
    }, "Login successful").success(res);
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userInfo = await User.findOne({ email });
        if (!userInfo) {
            throw new APIError("Email or password is incorrect", 401);
        }

        const comparePassword = await bcrypt.compare(password, userInfo.password);
        if (!comparePassword) {
            throw new APIError("Email or password is incorrect", 401);
        }

        return createToken(userInfo, res);

    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError("Login process failed", 500);
    }
};

const register = async (req, res) => {
    const {email, password} = req.body;

    const userCheck = await User.findOne({email});
    if(userCheck)
        throw new APIError("User already exists", 400);

    req.body.password = await bcrypt.hash(password, 10);

    const userSave = new User(req.body);

    await userSave.save()
    .then((data) => {
        return new Response(data, "User created successfully").created(res);
    })
    .catch((error) => {
        throw new APIError(error.message, 400);
    });

};

const me = async (req, res) => {
    return new Response(req.user, "User info").success(res);
};

module.exports = { login, register, me };
