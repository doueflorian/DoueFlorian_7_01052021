const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {
    // Vérifier si eMail déjà présent, si oui, l'indiquer
    User.findOne({ where : {email: req.body.email } })
    .then(user => {
        if (user) {
            return res.status(401).json({ message: 'Utilisateur déjà enregistré' })
        }
    // Utilisation de bcrypt afin d'hasher le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = User.build({
            ...req.body,
            password: hash
        });
        // Sauvegarder l'utilisateur avec le mot de passe crypté
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
            .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.status(500).json({ error }));
};

// Authentification de l'utilisateur
exports.login = (req, res, next) => {
    // Vérifier si eMail déjà présent, si non, l'indiquer
  User.findOne({ where : {email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' })
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

// Suppression de l'utilisateur
// L'utilisateur devra renseigner son mail et son MDP afin de supprimer son compte
// et ce bien qu'il soit déjà connecté, puisque l'user_id lié à la requête sera
// fera parti de la requête SQL afin de cibler le compte dans la DB
exports.deleteUser = (req, res, next) => {
    // Indiquer si compte non trouvé
    User.findOne({ where : {email: req.body.email, user_id: req.body.user_id } })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Utilisateur non trouvé' })
            }else {
            // utiliser Bcrypt pour comparer le mot de passe rentré à celui enregistré crypté
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect' })
                    }else{
                    // Supprimer l'utilisateur
                        User.destroy({ where : {email: req.body.email } })
                        .then(() => res.status(200).json({ message: 'utilisateur supprimé !' }))

                    }
                })
                .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));  
};