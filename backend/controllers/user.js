const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {
    const userObject = JSON.parse(req.body.User);

    // Vérifier si eMail déjà présent, si oui, l'indiquer
    User.findOne({ where : {email: userObject.email } })
        .then(user => {
            if (user) {
                throw 'Utilisateur déjà enregistré' 
            }
                if(req.file) {
                    // Utilisation de bcrypt afin d'hasher le mot de passe
                    bcrypt.hash(userObject.password, 10)
                        .then(hash => {
                            const user = User.build({
                                ...userObject,
                                profile_pic: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`,
                                password: hash
                            })            
                                // Sauvegarder l'utilisateur avec le mot de passe crypté
                            user.save()
                                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                                .catch(error => res.status(400).json({ error }));
                        })
                        .catch(error => res.status(500).json({ error }));
                }else{
                    // Utilisation de bcrypt afin d'hasher le mot de passe
                    bcrypt.hash(userObject.password, 10)
                        .then(hash => {
                            const user = User.build({
                                ...userObject,
                                password: hash
                            })            
                                // Sauvegarder l'utilisateur avec le mot de passe crypté
                            user.save()
                                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                                .catch(error => res.status(400).json({ error }));
                        })
                        .catch(error => res.status(500).json({ error }));
                }
        })
        .catch(error => res.status(500).json({ error }));
};

// Authentification de l'utilisateur
exports.login = (req, res, next) => {
    // Vérifier si eMail déjà présent, si non, l'indiquer
  User.findOne({ where : {email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' })
            }
            // utiliser Bcrypt pour comparer le mot de passe rentré à celui enregistré crypté
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect' })
                    }
                // Créer un token d'authentification avec JSONWebToken
                // L'ID de l'utilisateur sera encodé dans le token
                res.status(200).json({ 
                    user_id: user.id,
                    user_level: user.user_level,
                    last_name: user.last_name,
                    first_name: user.first_name,
                    token: jwt.sign(
                        {
                            "user_id": user.id, 
                            "user_level": user.user_level
                        },
                        'merlickeoskicuyhenrerbenbryn',
                        { expiresIn: '24h'}
                    )
                });
                
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));  
};

// Récupérer un utilisateur
exports.getUser = (req, res, next) => {
    User.findOne({where: { id: req.params.id} })
        // .then(user => res.status(201).json(user))
        .then(function(user){
            // Effacer le contenu du mot de passe afin de ne pas 
            // pouvoir l"utiliser depuis cette requête
            user.password = null;
            res.status(200).json(user)
        })
        // .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({ error }));
}

// Récupérer un utilisateur
exports.modifyUser = (req, res, next) => {
    const userObject = JSON.parse(req.body.User);

    // Vérifier si eMail déjà présent, si oui, l'indiquer
    User.findOne({ where : { id: userObject.id } })
        .then(function(user) {
            if(req.file && user.profile_pic === null) {
                User.update({
                    // Récupérer les informations de la requête,
                    ...userObject,
                    profile_pic: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`
                    },{ where: { id: req.params.id } })
                    .then(() => res.status(201).json({ message: 'Utilisateur modifié'}))
                    .catch(error => res.status(400).json({ error }));
            }else if(req.file && user.profile_pic !== null){
                const filename = user.profile_pic.split('/images/users/')[1];
                fs.unlink(`images/users/${filename}`, () => {
                    User.update({
                        // Récupérer les informations de la requête,
                        ...userObject,
                        profile_pic: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`
                        },{ where: { id: userObject.id  } })
                        .then(() => res.status(201).json({ message: 'Utilisateur modifié'}))
                        .catch(error => res.status(400).json({ error }));
                })
            }else if(req.body.deleteImg){
                const filename = user.profile_pic.split('/image/userss/')[1];
                fs.unlink(`images/users/${filename}`, () => {
                    User.update({
                        // Récupérer les informations de la requête,
                        ...userObject,
                        profile_pic: null
                        },{ where: { id: userObject.id  } })
                        .then(() => res.status(201).json({ message: 'Utilisateur modifié'}))
                        .catch(error => res.status(400).json({ error }));
                })
            }else{
                User.update({
                    // Récupérer les informations de la requête,
                    ...userObject,
                    },{ where: { id: userObject.id } })
                    .then(() => res.status(201).json({ message: 'Utilisateur modifié'}))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
}

// Suppression de l'utilisateur
exports.deleteUser = (req, res, next) => {
    // Indiquer si adresse mail correcte
    User.findOne({ where : { id: req.body.user_id } })
        .then(user => {
            // utiliser Bcrypt pour comparer le mot de passe rentré à celui enregistré crypté
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect' })
                    }else if (user.profile_pic !== null){
                    // Supprimer l'utilisateur
                    const filename = user.profile_pic.split('/images/users/')[1];
                        fs.unlink(`images/users/${filename}`, () => {
                            User.destroy({ where : {id: req.body.user_id } })
                            .then(() => res.status(200).json({ message: 'utilisateur supprimé !' }))
                        })
                    }else{
                        User.destroy({ where : {id: req.body.user_id } })
                        .then(() => res.status(200).json({ message: 'utilisateur supprimé !' }))
                    }
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));  
};