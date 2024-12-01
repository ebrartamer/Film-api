const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Upload middleware'ini import et
const upload = require('../middlewares/lib/upload');

const userRoute = require('./userRoutes');
const filmRoute = require('./filmRoutes');

// Upload route
router.post('/upload', upload.array('images', 10), (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Upload successful",
            files: req.files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message
        });
    }
});

router.use('/users', userRoute);
router.use('/films', filmRoute);

module.exports = router;            