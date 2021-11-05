const express = require("express");
const dotenv = require('dotenv-extended');
const cors = require("cors");
const helmet = require('helmet');

dotenv.config();
const app = express();

// Utilisation de cors & helmet
app.use(cors());
app.use(helmet());

// Configurer l'application
app.use((req, res, next) => {
    // Accepter les échanges de différentes origines
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Ajout des header nécessaires à l'API
    res.setHeader('Accesss-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Ajout des requêtes nécessaires à l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Parser les requètes en JSON
app.use(express.json());

// Parser les requètes sous forme d'URL
app.use(express.urlencoded({ extended: true }));

// Indication du dosser statique utilisé par Multer
app.use('/images', express.static('images'));


// Différentes routes

// app.use(Associations)

// Importation
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

// Utilisation
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/comments', commentRoutes);


module.exports = app;