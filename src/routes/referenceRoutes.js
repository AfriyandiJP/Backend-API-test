const express = require('express');
const router = express.Router();
const referenceController = require('../controllers/referenceController');

// Public routes
router.get('/banner', referenceController.getBanners);
router.get('/services', referenceController.getServices);

module.exports = router;
