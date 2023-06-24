

var express = require('express');
var UserController = require('../controllers/user');
var multipart = require('connect-multiparty');


var	api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_upload = multipart({ uploadDir: './uploads/users' });


api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_upload, md_auth.ensureAuth], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);




module.exports = api;	 


