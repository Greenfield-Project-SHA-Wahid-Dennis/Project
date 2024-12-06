const express = require('express');
const { uploadBill } = require('../controllers/uploadController');  // Import the upload controller

const router = express.Router();

// Set up route for uploading bills (images)
router.post('/upload', uploadBill);  // POST request to handle image upload

module.exports = router;

