// Routes for authentication (login/signup)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');


// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// POST /api/auth/refresh-token
router.post('/refresh-token', verifyToken, authController.refreshToken);

module.exports = router;
