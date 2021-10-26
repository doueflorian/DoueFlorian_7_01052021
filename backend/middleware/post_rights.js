const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const { JWTPRIVATEKEY } = process.env;

// Utiliser le token créé à l'authentification
module.exports = (req, res, next) => {
  try {
    // Récupérer le token depuis le Header "Authorization"
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWTPRIVATEKEY);
    // Stocker l'user_id du token
    console.log(decodedToken)
    const user_id = decodedToken.user_id;
    const user_level = decodedToken.user_level;

    // Récupérer post
    Post.findOne({where: { id: req.params.id} })
      .then(function(post) {
      // Vérifier le statut ou l'ID de l'utilisateur et lui laisser ou non le contrôle
        if (user_level === 1) {
          //  L'utilisateur est un Administrateur
          next();
        }else if(user_id === post.user_id) {
          //  L'utilisateur est à l'origine du post
          next();   
        }else {
          throw "droits insuffisants"
        }
    }) 
    .catch(error => res.status(400).json({ error }));

  } catch (error) {
    res.status(403).json(error);
  }
};