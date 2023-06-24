//recuerda que siempre debes poner 'require' para poder cargar rutas
var express = require('express');
var SongController = require('../controllers/song');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});




api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-song-file/:id', [md_upload, md_auth.ensureAuth], SongController.uploadSongFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);




module.exports = api;

