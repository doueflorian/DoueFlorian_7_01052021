const multer = require('multer');

const storage = multer.diskStorage({

    // Définir l'espace de stockage dans le dossier images
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    // Définir le nom depuis le nom d'origine + la date après "--"
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname);
    }
});  

// Filtrer les extensions d'images, n'approuver que les Jpeg/JPG et PNG
const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')|| (file.mimetype).includes('gif')){
        cb(null, true);
    } else{
        cb(null, false);
    }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter,}).single('image');


