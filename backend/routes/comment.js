const express = require('express');
const router = express.Router();

// Importation du controller pour les commentaires
const commCtrl = require('../controllers/comment');

// Importation middleware d'authentification
const auth = require('../middleware/auth');
// Importation middleware d'authentification des droits pour les commentaires
const commentRights = require('../middleware/comments_rights');
// Importation de Multer pour les images

const multer = require('../middleware/multer-config');

//  Comments Routes
router.put('/comments/:id', auth, commentRights, multer, commCtrl.modifyComment);
router.delete('/comments/:id', auth, commentRights, multer, commCtrl.deleteComment);

module.exports = router;