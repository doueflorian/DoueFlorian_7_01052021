const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');

// Créer un post
exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.Post);

    if(req.file) {
        Post.create({
            // Récupérer les informations de la requête,
            ...postObject,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })
        .then(() => res.status(201).json({ message: 'Post enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    }else{
        Post.create({
            // Récupérer les informations de la requête,
            ...postObject
        })
        .then(() => res.status(201).json({ message: 'Post enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    } 
};

// Modifier un post
exports.modifyPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.Post);
    Post.findOne({where: { id: req.params.id} })
        .then(function (post){
            if(req.file && post.image_url == null) {
                Post.update({
                    // Récupérer les informations de la requête,
                    message: postObject.message,
                    image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                },{ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Post Modifié !'}))
                .catch(error => res.status(400).json({ error }));
            }else if(req.file && post.image_url !== null) {
                const filename = post.image_url.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Post.update({
                        // Récupérer les informations de la requête,
                        message: postObject.message,
                        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    },{ where: { id: req.params.id } })
                    .then(() => res.status(200).json({ message: 'Post Modifié !'}))
                    .catch(error => res.status(400).json({ error }));
                })
            }else if(req.body.deleteImg && postObject.message !== ""){
                const filename = post.image_url.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Post.update({
                        // Récupérer les informations de la requête,
                        message: postObject.message,
                        image_url: null
                    },{ where: { id: req.params.id } })
                    .then(() => res.status(200).json({ message: 'Post Modifié !'}))
                    .catch(error => res.status(400).json({ error }));
                })
            }else{
                Post.update({
                    // Récupérer les informations de la requête,
                   message: postObject.message
                },{ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Post Modifié !'}))
                .catch(error => res.status(400).json({ error }));
            } 
        })
};

// Supprimer un post
exports.deletePost = (req, res, next) => {
    // Chercher le post
    Post.findOne({where: { id: req.params.id} })
    // Verifier la présence d'une image et supprimer le post en conséquence 
    .then(function(post){
        if(post.image_url == null) {
            Post.destroy({where: { id: req.params.id} })
                .then(() => res.status(200).json({ message: 'Post Supprimé !'}))
                .catch(error => res.status(400).json({ error }));
        }else {
            // Récupérer le nom de l'image et la supprimer
            const filename = post.image_url.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Supprimer le post
                Post.destroy({where: { id: req.params.id} })
                    .then(() => res.status(200).json({ message: 'Post Supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            })
        }
    })
};

// Récupérer tous les posts
exports.getEveryPost = (req, res, next) => {
    Post.findAll({order: [['created_at', 'DESC']], include: User})
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
}

// Récupérer un post
exports.getPost = (req, res, next) => {
    Post.findOne({where: { id: req.params.id}, include: User })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
}

// Récupérer tous les posts d'un utilisateur
exports.getEveryPostForAnUser = (req, res, next) => {
    Post.findAll({ where: { user_id: req.params.id}, order: [['created_at', 'DESC']], include: User  })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
}