const express = require('express');
const router = express.Router();

// Importation du controller pour les commentaires
const commCtrl = require('../controllers/comment');

// Importation middleware d'authentification
const auth = require('../middleware/auth');
// Importation de Multer pour les images
const multer = require('../middleware/multer-config');

//  Comments Routes
router.put('/comments/:id', auth, multer, commCtrl.modifyComment);
router.delete('/comments/:id', auth, multer, commCtrl.deleteComment);

module.exports = router;