const express = require('express');
const router = express.Router();
const { addFilm, getFilms, updateFilm, deleteFilm } = require('../controllers/filmcontroller');
const { tokenCheck } = require('../middlewares/auth');

router.post('/add', tokenCheck, addFilm);
router.get('/', getFilms);
router.put('/:id', tokenCheck, updateFilm);
router.delete('/:id', tokenCheck, deleteFilm);

module.exports = router;