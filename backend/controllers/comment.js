const Comment = require('../models/Comment');

// Créer un commentaire
exports.createComment = (req, res, next) => {
    if(req.file) {
        Comment.create({
            // Récupérer les informations de la requête,
            ...req.body,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })
        .then(() => res.status(201).json({ message: 'Commentaire enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    }else{
        Comment.create({
            // Récupérer les informations de la requête,
            ...req.body
        })
        .then(() => res.status(201).json({ message: 'Commentaire enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    } 
};

// Modifier un commentaire
exports.modifyComment = (req, res, next) => {
    Comment.update({
        // Récupérer les informations de la requête,
        ...req.body
    },
    {where: { id: req.params.id} })
        .then(() => res.status(200).json({ message: 'Commentaire Modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

// Supprimer un commentaire
exports.deleteComment = (req, res, next) => {
    // Chercher le commentaire
    Comment.findOne({where: { id: req.params.id} })
    // Verifier la présence d'une image et supprimer le poste en conséquence 
    .then(function(comment){
        if(comment.image_url == null) {
            Comment.destroy({where: { id: req.params.id} })
                .then(() => res.status(200).json({ message: 'Post Supprimé !'}))
                .catch(error => res.status(400).json({ error }));
        }else {
            // Récupérer le nom de l'image et la supprimer
            const filename = comment.image_url.split('/images/')[1];
            console.log(filename)
            fs.unlink(`images/${filename}`, () => {
                // Supprimer le post
                Comment.destroy({where: { id: req.params.id} })
                    .then(() => res.status(201).json({ message: 'Post Supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            })
        }
    })
};

// Récupérer tous les commentaires d'un post
exports.getEveryCommentForOnePost = (req, res, next) => {
    Comment.findAll({where: { post_id: req.params.id }})
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