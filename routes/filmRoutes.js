const express = require('express');
const router = express.Router();
const { 
    addFilm, 
    getFilms, 
    updateFilm, 
    deleteFilm,
    addComment,
    deleteComment,
    rateFilm,
    getFilmDetails,
    getFilmComments,
    getUserComment,
    getFilmRatings,
    getUserRating
} = require('../controllers/filmcontroller');
const { tokenCheck } = require('../middlewares/auth');

// Film routes
router.post('/add', addFilm);
router.get('/', getFilms);
router.put('/:id', updateFilm);
router.delete('/:id', deleteFilm);

// Film detayları
router.get('/:id', getFilmDetails);

// Yorum routes
router.post('/:id/comments', tokenCheck, addComment);
router.delete('/:filmId/comments/:commentId', tokenCheck, deleteComment);
router.get('/:id/comments', getFilmComments);
router.get('/:id/comments/me', tokenCheck, getUserComment);

// Puanlama routes
router.post('/:id/rate', tokenCheck, rateFilm);
router.get('/:id/ratings', getFilmRatings);
router.get('/:id/ratings/me', tokenCheck, getUserRating);

module.exports = router;