const express = require('express');
const multerConfig = require('../utils/upload');
const uploadController = require('../controllers/upload');
const checkLogin = require('../middleware/middleware');
const router = express.Router();

router.post('/upload-image', multerConfig.imageUpload.single('image'), uploadController.uploadImage);
// router.post('/upload-image', multerConfig.imageUpload.single('image'), checkLogin.verifyToken, uploadController.uploadImage);

router.post('/upload-file', multerConfig.fileUpload.single('file'), uploadController.uploadFile);
// router.post('/upload-file', multerConfig.fileUpload.single('file'), checkLogin.verifyToken, uploadController.uploadFile);

module.exports = router