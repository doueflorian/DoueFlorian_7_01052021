const express = require('express');
const router = express.Router();

// Importation du controller pour les utilisateurs
const userCtrl = require('../controllers/user');

// Importation middleware d'authentification
const auth = require('../middleware/auth');

// User routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id',auth, userCtrl.getUser);
router.delete('/delete/:id',auth, userCtrl.deleteUser);

module.exports = router;