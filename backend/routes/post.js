const express = require('express');
const router = express.Router();

// Importation du controller pour les posts
const postCtrl = require('../controllers/post');
// Importation du controller pour les commentaires
const commCtrl = require('../controllers/comment');
// Importation du controller pour les réactions
const reactionCtrl = require('../controllers/reaction');

// Importation middleware d'authentification
const auth = require('../middleware/auth'); 
// Importation middleware d'authentification des droits pour les posts
const postRights = require('../middleware/post_rights');
// Importation de Multer pour les images
const multer = require('../middleware/multer-config');

// Post routes
router.post('/',auth, multer, postCtrl.createPost);
router.put('/:id', auth, postRights, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postRights, multer, postCtrl.deletePost);
router.get('/',auth, postCtrl.getEveryPost);
router.get('/:id', auth, postCtrl.getPost);

// Comments routes
router.post('/:id/comments',auth, multer, commCtrl.createComment);
router.get('/:id/comments',auth, commCtrl.getEveryCommentForOnePost);

// Reactions routes
router.post('/:id/reactions',auth, reactionCtrl.reactToPost);
router.get('/:id/reactions',auth, reactionCtrl.getReactionsForPost);
router.get('/:id/likes',auth, reactionCtrl.getLikesForPost);
router.get('/:id/dislikes',auth, reactionCtrl.getDislikesForPost);

module.exports = router;