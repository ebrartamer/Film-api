const Film = require("../models/filmModel");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

// film Ekleme
const addFilm = async (req, res) => {
    try {
        const { title, director, genre, year } = req.body;

        const newFilm = new Film({
            title,
            director,
            genre,
            year,
            user: req.user, // Kullanıcı bilgisi JWT'den alınır
        });

        if (req.file) {
            newFilm.poster = req.file.path; // Multer ile dosya yüklenirse
        }

        const savedFilm = await newFilm.save();
        return new Response(savedFilm, "Film successfully added").created(res);

    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Tüm Filmler
const getFilms = async (req, res) => {
    try {
        const films = await Film.find({ user: req.user }).sort({ createdAt: -1 }); // Kullanıcıya ait filmler
        return new Response(films, "Films fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Film güncelleme
const updateFilm = async (req, res) => {
    try {
        const { id } = req.params;
        const film = await Film.findOne({ _id: id, user: req.user }); // Sadece kullanıcıya ait filmi güncelle

        if (!film) {
            throw new APIError("Film not found", 404);
        }

        Object.assign(film, req.body); // Gelen alanları güncelle
        if (req.file) {
            film.poster = req.file.path;
        }

        const updatedFilm = await film.save();
        return new Response(updatedFilm, "Film successfully updated").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Film silme
const deleteFilm = async (req, res) => {
    try {
        const { id } = req.params;
        const film = await Film.findOneAndDelete({ _id: id, user: req.user });

        if (!film) {
            throw new APIError("Film not found", 404);
        }

        return new Response(null, "Film successfully deleted").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

module.exports = {
    addFilm,
    getFilms,
    updateFilm,
    deleteFilm
};
