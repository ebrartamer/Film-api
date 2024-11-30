const User = require('../models/user');
const Film = require('../models/filmModel');
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

const addToFavorites = async (req, res) => {
    try {
        const { filmId } = req.body;

        const film = await Film.findById(filmId);
        if (!film) {
            throw new APIError("Film not found", 404);
        }

        const user = await User.findById(req.user._id);
        if (user.favorites.includes(filmId)) {
            throw new APIError("Film already in favorites", 400);
        }

        user.favorites.push(filmId);
        await user.save();

        return new Response(user.favorites, "Film added to favorites").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const { filmId } = req.body;

        const user = await User.findById(req.user._id);
        user.favorites = user.favorites.filter(id => id.toString() !== filmId);
        await user.save();

        return new Response(user.favorites, "Film removed from favorites").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favorites', 'title director genre year');

        return new Response(user.favorites, "Favorites fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

const addToWatchlist = async (req, res) => {
    try {
        const { filmId } = req.body;

        const film = await Film.findById(filmId);
        if (!film) {
            throw new APIError("Film not found", 404);
        }

        const user = await User.findById(req.user._id);
        if (user.watchlist.includes(filmId)) {
            throw new APIError("Film already in watchlist", 400);
        }

        user.watchlist.push(filmId);
        await user.save();

        return new Response(user.watchlist, "Film added to watchlist").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

const removeFromWatchlist = async (req, res) => {
    try {
        const { filmId } = req.body;

        const user = await User.findById(req.user._id);
        user.watchlist = user.watchlist.filter(id => id.toString() !== filmId);
        await user.save();

        return new Response(user.watchlist, "Film removed from watchlist").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('watchlist', 'title director genre year');

        return new Response(user.watchlist, "Watchlist fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

const getAllLists = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favorites', 'title director genre year')
            .populate('watchlist', 'title director genre year');

        return new Response({
            favorites: user.favorites,
            watchlist: user.watchlist
        }, "All lists fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

module.exports = {
    login,
    register,
    me,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
    getAllLists
};
