const Comment = require('../models/Comment');
const User = require('../models/User');

const fs = require('fs');

// Créer un commentaire
exports.createComment = (req, res, next) => {
    const commentObject = JSON.parse(req.body.Comment);

    if(req.file) {
        Comment.create({
            // Récupérer les informations de la requête,
            ...commentObject,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })
        .then(() => res.status(201).json({ message: 'Commentaire enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    }else{
        Comment.create({
            // Récupérer les informations de la requête,
            ...commentObject
        })
        .then(() => res.status(201).json({ message: 'Commentaire enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    } 
};

// Modifier un commentaire
exports.modifyComment = (req, res, next) => {
    const commentObject = JSON.parse(req.body.Comment);
    Comment.findOne({where: { id: req.params.id} })
        .then(function (comment){
            if(req.file && comment.image_url == null) {
                Comment.update({
                    // Récupérer les informations de la requête,
                    message: commentObject.message,
                    image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                },{ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Comment Modifié !'}))
                .catch(error => res.status(400).json({ error }));
            }else if(req.file && comment.image_url !== null) {
                const filename = comment.image_url.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Comment.update({
                        // Récupérer les informations de la requête,
                        message: commentObject.message,
                        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    },{ where: { id: req.params.id } })
                    .then(() => res.status(200).json({ message: 'Comment Modifié !'}))
                    .catch(error => res.status(400).json({ error }));
                })
            }else if(req.body.deleteImg && commentObject.message !== ""){
                const filename = comment.image_url.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Comment.update({
                        // Récupérer les informations de la requête,
                        message: commentObject.message,
                        image_url: null
                    },{ where: { id: req.params.id } })
                    .then(() => res.status(200).json({ message: 'Comment Modifié !'}))
                    .catch(error => res.status(400).json({ error }));
                })
            }else{
                Comment.update({
                    // Récupérer les informations de la requête,
                    message: commentObject.message,
                },{ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Comment Modifié !'}))
                .catch(error => res.status(400).json({ error }));
            } 
        })
};

// Supprimer un commentaire
exports.deleteComment = (req, res, next) => {
    // Chercher le commentaire
    Comment.findOne({where: { id: req.params.id} })
    // Verifier la présence d'une image et supprimer le commentaire en conséquence 
    .then(function(comment){
        if(comment.image_url == null) {
            Comment.destroy({where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: 'Commentaire Supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        }else {
            // Récupérer le nom de l'image et la supprimer
            const filename = comment.image_url.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Supprimer le commentaire
                Comment.destroy({where: { id: req.params.id} })
                    .then(() => res.status(201).json({ message: 'Comment Supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            })
        }
    })
};

// Récupérer tous les commentaires d'un post
exports.getEveryCommentForOnePost = (req, res, next) => {
    Comment.findAll({where: { post_id: req.params.id }, include: User})
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(400).json({ error }));
}


// // Controlleurs mis de côté

//     // Récupérer tous les commentaires d'un utilisateur
//     exports.getEveryCommentForOneUser = (req, res, next) => {
//         Comment.findAll({where: { user_id: req.params.id }})
//         .then(comments => res.status(200).json(comments))
//         .catch(error => res.status(400).json({ error }));
//     }