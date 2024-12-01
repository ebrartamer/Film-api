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
    getUserRating,
    searchFilms,
    getGenres,
    getDirectors
} = require('../controllers/filmcontroller');
const { tokenCheck } = require('../middlewares/auth');

// Arama ve filtreleme routes
//bu kısmı başa aldım id değeri dinamik olduğu için route akışını bozuyuyordu
router.get('/search', searchFilms);
router.get('/genres', getGenres);
router.get('/directors', getDirectors);

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