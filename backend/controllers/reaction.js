const Reaction = require('../models/Reaction');
const User = require('../models/User');
const Post = require('../models/Post');

// Reagir au post
exports.reactToPost = (req, res, next) => {
    // Chercher une reaction relative au post et l'utilisateur connecté
    Reaction.findOne({
        where: {
            post_id: req.params.id,
            user_id: req.body.user_id
        }
    })
        .then( 
            // Récupérer la reaction ou Null
            function(reaction) {
                // Si la reaction n'existe pas et que l'utilisateur like
                // Créer la réaction et ajouter 1 like au post
                if(reaction == null && req.body.like_data == 1){

                    return Reaction
                    .create({...req.body})
                    .then(function() {
                        Post.increment('likes',{
                            by: 1,
                            where: { id: req.params.id } 
                        })
                    })
                    .then(() => res.status(201).json({ message: 'Vous aimez ce post !'})); 

                // Si la reaction n'existe pas et que l'utilisateur dislike
                // Créer la réaction et ajouter 1 dislike au post
                }else if(reaction == null && req.body.like_data == -1){

                    return Reaction
                    .create({...req.body})
                    .then(function() {
                        Post.increment('dislikes',{
                            by: 1,
                            where: { id: req.params.id } 
                        })
                    })
                    .then(() => res.status(201).json({ message: 'Vous n\'aimez pas ce post !'}));   

                // Si un like existe et que l'utilisateur dislike
                // Mettre la réaction à jour
                // Enlever 1 like et ajouter 1 dislike au post
                }else if(reaction.like_data == 1 && req.body.like_data == -1){
                   
                    return reaction
                        .update({...req.body})
                        .then(function() {
                            Post.increment('dislikes',{
                                by: 1,
                                where: { id: req.params.id } 
                            })
                            Post.decrement('likes',{
                                by: 1,
                                where: { id: req.params.id } 
                            })
                        })
                        .then(() => res.status(200).json({ message: 'Reaction mise à jour !'}));                 

                // Si un dislike existe et que l'utilisateur like
                // Mettre la réaction à jour
                // Enlever 1 dislike et ajouter 1 ike au post
                }else if(reaction.like_data == -1 && req.body.like_data == 1){

                    return reaction
                        .update({...req.body})
                        .then(function() {
                            Post.increment('likes',{
                                by: 1,
                                where: { id: req.params.id } 
                            })
                            Post.decrement('dislikes',{
                                by: 1,
                                where: { id: req.params.id } 
                            })
                        })
                        .then(() => res.status(200).json({ message: 'Reaction mise à jour !'}));                 

                // Si un like existe et que l'utilisateur l'enlève
                // Supprimer la réaction et enlever 1 like au post
                }else if(reaction.like_data == 1 && req.body.like_data == 0){

                    return reaction
                    .destroy({...req.body})
                    .then(function() {
                        Post.decrement('likes',{
                            by: 1,
                            where: { id: req.params.id } 
                        })
                    })
                    .then(() => res.status(200).json({ message: 'Reaction supprimée !'}));    

                // Si un dislike existe et que l'utilisateur l'enlève
                // Supprimer la réaction et enlever 1 dislike au post
                }else if(reaction.like_data == -1 & req.body.like_data == 0){
                    
                    return reaction
                    .destroy({...req.body})
                    .then(function() {
                        Post.decrement('dislikes',{
                            by: 1,
                            where: { id: req.params.id } 
                        })
                    })
                    .then(() => res.status(200).json({ message: 'Reaction supprimée !'}));    

                }else if(reaction.like_data === 1 && req.body.like_data === 1){

                    return reaction
                    .destroy({...req.body})
                    .then(function() {
                        Post.decrement('likes',{
                            by: 1,
                            where: { id: req.params.id } 
                        })
                    })
                    .then(() => res.status(200).json({ message: 'Reaction supprimée !'}));    

                // Si un dislike existe et que l'utilisateur l'enlève
                // Supprimer la réaction et enlever 1 dislike au post
                }else if(reaction.like_data === -1 && req.body.like_data === -1){

                    return reaction
                    .destroy({...req.body})
                    .then(function() {
                        Post.decrement('dislikes',{
                            by: 1,
                            where: { id: req.params.id } 
                        })
                    })
                    .then(() => res.status(200).json({ message: 'Reaction supprimée !'}));    

                // Si un dislike existe et que l'utilisateur l'enlève
                // Supprimer la réaction et enlever 1 dislike au post
                }
            })
        .catch(error => res.status(400).json({ error }));
};

// Récupérer toutes les réactions d'un post
exports.getReactionsForPost = (req, res, next) => {
    Reaction.findAll( {where:  { post_id: req.params.id }, include: User })
        .then(reactions => res.status(200).json(reactions))
        .catch(error => res.status(400).json({ error }));
};

// Récupérer tous les utilisateurs qui ont liké le post
exports.getLikesForPost = (req, res, next) => {
    Reaction.findAll( {where:  { post_id: req.params.id, like_data: 1 } })
        .then(reactions => res.status(200).json(reactions))
        .catch(error => res.status(400).json({ error }));
};

// Récupérer tous les utilisateurs qui ont disliké le post
exports.getDislikesForPost = (req, res, next) => {
    Reaction.findAll( {where:  { post_id: req.params.id, like_data: -1 } })
        .then(reactions => res.status(200).json(reactions))
        .catch(error => res.status(400).json({ error }));
};
