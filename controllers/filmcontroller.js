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

// Filme yorum ekleme
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment) {
            throw new APIError("Comment is required", 400);
        }

        const film = await Film.findById(id);
        if (!film) {
            throw new APIError("Film not found", 404);
        }

        film.comments.push({
            user: req.user._id,
            comment
        });

        await film.save();

        return new Response(film, "Comment added successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Yorumu silme
const deleteComment = async (req, res) => {
    try {
        const { filmId, commentId } = req.params;

        const film = await Film.findById(filmId);
        if (!film) {
            throw new APIError("Film not found", 404);
        }

        // Yorumu bulan ve kullanıcıya ait olduğunu kontrol eder
        const comment = film.comments.id(commentId);
        if (!comment) {
            throw new APIError("Comment not found", 404);
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            throw new APIError("You can only delete your own comments", 403);
        }

        film.comments.pull(commentId);
        await film.save();

        return new Response(null, "Comment deleted successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Film puanlama
const rateFilm = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 10) {
            throw new APIError("Rating must be between 1 and 10", 400);
        }

        const film = await Film.findById(id);
        if (!film) {
            throw new APIError("Film not found", 404);
        }

        // Kullanıcının önceki puanını kontrol et
        const existingRating = film.ratings.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (existingRating) {
            existingRating.rating = rating;
        } else {
            film.ratings.push({
                user: req.user._id,
                rating
            });
        }

        // Ortalama puanı güncelle
        const totalRating = film.ratings.reduce((sum, r) => sum + r.rating, 0);
        film.averageRating = totalRating / film.ratings.length;

        await film.save();

        return new Response(film, "Rating added successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Film detaylarını getirme (yorumlar ve puanlarla birlikte)
const getFilmDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const film = await Film.findById(id)
            .populate('comments.user', 'name email')
            .populate('ratings.user', 'name');

        if (!film) {
            throw new APIError("Film not found", 404);
        }

        return new Response(film, "Film details fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Filmin tüm yorumlarını getirme
const getFilmComments = async (req, res) => {
    try {
        const { id } = req.params;

        const film = await Film.findById(id)
            .select('comments')
            .populate('comments.user', 'name email')
            .sort({ 'comments.createdAt': -1 });

        if (!film) {
            throw new APIError("Film not found", 404);
        }

        return new Response(film.comments, "Comments fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Kullanıcının yaptığı yorumu getirme
const getUserComment = async (req, res) => {
    try {
        const { id } = req.params;

        const film = await Film.findById(id)
            .select('comments')
            .populate('comments.user', 'name email');

        if (!film) {
            throw new APIError("Film not found", 404);
        }

        const userComment = film.comments.find(
            comment => comment.user._id.toString() === req.user._id.toString()
        );

        return new Response(userComment || null, "User comment fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Filmin puanlarını getirme
const getFilmRatings = async (req, res) => {
    try {
        const { id } = req.params;

        const film = await Film.findById(id)
            .select('ratings averageRating')
            .populate('ratings.user', 'name');

        if (!film) {
            throw new APIError("Film not found", 404);
        }

        return new Response({
            ratings: film.ratings,
            averageRating: film.averageRating
        }, "Ratings fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Kullanıcının verdiği puanı getirme
const getUserRating = async (req, res) => {
    try {
        const { id } = req.params;

        const film = await Film.findById(id).select('ratings');

        if (!film) {
            throw new APIError("Film not found", 404);
        }

        const userRating = film.ratings.find(
            rating => rating.user.toString() === req.user._id.toString()
        );

        return new Response(userRating || null, "User rating fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Arama ve Filtreleme
const searchFilms = async (req, res) => {
    try {
        const { 
            search,     
            genre,      
            director,   
            year,       
            minRating,  
            maxRating,  
            sortBy      
        } = req.query;

        // Filtreleme kriterleri
        let query = {};

        // Arama terimi varsa title ve director'de ara
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { director: { $regex: search, $options: 'i' } }
            ];
        }

        // Tür filtresi
        if (genre) {
            query.genre = { $regex: genre, $options: 'i' };
        }

        // Yönetmen filtresi
        if (director) {
            query.director = { $regex: director, $options: 'i' };
        }

        // Yıl filtresi
        if (year) {
            query.year = parseInt(year);
        }

        // Puan aralığı filtresi
        if (minRating || maxRating) {
            query.averageRating = {};
            if (minRating) query.averageRating.$gte = parseFloat(minRating);
            if (maxRating) query.averageRating.$lte = parseFloat(maxRating);
        }

        // Sıralama seçenekleri
        let sort = {};
        switch (sortBy) {
            case 'year_desc':
                sort = { year: -1 };
                break;
            case 'year_asc':
                sort = { year: 1 };
                break;
            case 'rating_desc':
                sort = { averageRating: -1 };
                break;
            case 'rating_asc':
                sort = { averageRating: 1 };
                break;
            default:
                sort = { createdAt: -1 }; // Varsayılan sıralama
        }

        const films = await Film.find(query)
            .select('title director genre year averageRating poster createdAt')
            .sort(sort);

        return new Response(films, "Films fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Film türlerini getirme
const getGenres = async (req, res) => {
    try {
        const genres = await Film.distinct('genre');
        return new Response(genres, "Genres fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

// Yönetmenleri getirme
const getDirectors = async (req, res) => {
    try {
        const directors = await Film.distinct('director');
        return new Response(directors, "Directors fetched successfully").success(res);
    } catch (error) {
        throw new APIError(error.message, 400);
    }
};

module.exports = {
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
};
