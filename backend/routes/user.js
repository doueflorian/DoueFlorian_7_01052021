const express = require('express');
const router = express.Router();

// Importation du controller pour les utilisateurs
const userCtrl = require('../controllers/user');
// Importation du controller pour les posts
const postCtrl = require('../controllers/post');

// Importation middleware d'authentification
const auth = require('../middleware/auth');
// Importation de Multer pour les images
const multerProfile = require('../middleware/multer-profile-config');

// User routes
router.post('/signup', multerProfile, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id',auth, userCtrl.getUser);
router.put('/:id',auth, multerProfile, userCtrl.modifyUser);
router.delete('/delete/:id',auth, userCtrl.deleteUser);

// Post Routes
router.get('/:id/posts', auth, postCtrl.getEveryPostForAnUser);


module.exports = router;