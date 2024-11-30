const mongoose = require("mongoose");
 

const filmSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true }, // Örnek: Aksiyon, Dram
    year: { type: Number, required: true },
   // poster: { type: String }, // Dosya URL'si
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Hangi kullanıcıya ait olduğu
}, {
    timestamps: true,
});

const Film = mongoose.model("Film", filmSchema);

module.exports = Film;