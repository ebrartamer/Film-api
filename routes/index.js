const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const filmRoutes = require('./filmRoutes');
router.use('/', userRoutes);
router.use('/films', filmRoutes);

module.exports = router;            