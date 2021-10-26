const jwt = require('jsonwebtoken');

const { JWTPRIVATEKEY } = process.env;

// Utiliser le token créé à l'authentification
module.exports = (req, res, next) => {
  try {
    // Récupérer le token depuis le Header "Authorization"
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWTPRIVATEKEY);
    // Stocker l'user_id & user_level du token
    const user_id = decodedToken.user_id;
    const user_level = decodedToken.user_level;
    // Vérifier l'ID de l'utilisateur et lui laisser ou non le contrôle
    if (req.body.user_id && req.body.user_id !== user_id) {
      throw 'Utilisateur non valide';
    } else if (user_level !== 1) {
      throw 'Droits insuffisants';
    }else{
      next();
    }
  } catch (error) {
    res.status(403).json(error);
  }
};