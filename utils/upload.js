const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const s3 = require('./s3.util'); 


const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const imageUpload = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/png|jpeg|jpg|gif/i)) {
            cb(new Error('File format not supported'), false);
            return;
        }

        cb(null, true);
    },
});

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/files/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});


const fileUpload = multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    },
});

module.exports = {
    imageUpload: imageUpload,
    fileUpload: fileUpload,
    // uploadFile: uploadFile
};
