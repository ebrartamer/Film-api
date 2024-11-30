const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/userController');
const { tokenCheck } = require('../middlewares/auth');

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.get('/me', tokenCheck, me);

// Favorites routes
router.post('/favorites', tokenCheck, addToFavorites);
router.delete('/favorites', tokenCheck, removeFromFavorites);
router.get('/favorites', tokenCheck, getFavorites);

// Watchlist routes
router.post('/watchlist', tokenCheck, addToWatchlist);
router.delete('/watchlist', tokenCheck, removeFromWatchlist);
router.get('/watchlist', tokenCheck, getWatchlist);

// Get all lists
router.get('/lists', tokenCheck, getAllLists);

module.exports = router;