const Post = require('../models/Post');
const fs = require('fs');

// Créer un post
exports.createPost = (req, res, next) => {
    if(req.file) {
        Post.create({
            // Récupérer les informations de la requête,
            ...req.body,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })
        .then(() => res.status(201).json({ message: 'Post enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    }else{
        Post.create({
            // Récupérer les informations de la requête,
            ...req.body
        })
        .then(() => res.status(201).json({ message: 'Post enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    } 
};

// Modifier un post
exports.modifyPost = (req, res, next) => {
    Post.update({...req.body},{
        where: { id: req.params.id } 
    })
        .then(() => res.status(200).json({ message: 'Post Modifié !'}))
        .catch(error => res.status(400).json({ error }));
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
    Post.findAll()
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
}

// Récupérer un post
exports.getPost = (req, res, next) => {
    Post.findOne({where: { id: req.params.id} })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
}