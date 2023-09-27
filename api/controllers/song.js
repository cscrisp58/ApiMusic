var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-Pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getSong(req, res){

	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec((err, song)=>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
				}else{
					if(!song){
						res.status(404).send({message: 'No se ha encontrado la cancion'});
							}else{
								res.status(202).send({song});
			}
		}
	});
}

function getSongs(req, res){

	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}
	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}

	}).exec(function(err, songs){
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No se encontro la cancion'});
					}else{
						res.status(200).send({songs});
			}
		}
	});
}



function saveSong(req, res){

	var song = new Song();

	var params = req.body;

	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration,
	song.file = 'null';
	song.album = params.album;

	song.save((err, songStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
				}else{
					if(!songStored){
						res.status(404).send({message: 'No se ha registrado ninguna cancion'});
						}else{
							res.status(200).send({message: songStored});
			}
		}
	});
}

function updateSong(req, res){

	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'Cancion no encontrada'});
				}else{
					res.status(200).send({song: songUpdated});
			}
		}
	});
}


function deleteSong(req, res){

	var songId = req.params.id;

	Song.findByIdAndDelete(songId, (err, songRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'No existe la cancion'});			
			}else{
				res.status(404).send({song: songRemoved});			
			}
		}
	});
}

function uploadSongFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'mp3' || file_ext == 'ogg'){

		Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
			if(!songUpdated){
				res.status(404).send({message: 'No se ha podido actualizar la cancion'});
					}else{
						 res.status(200).send({song: songUpdated});
						}
							});
						}else{
						 res.status(200).send({message: 'extension del archivo invalida'});	
							} 
								console.log(file_name);
						}else{
						res.status(200).send({message: 'no has subido ninguna cancion'});	
	}
}


function getSongFile(req, res){

	var songFile = req.params.songFile;
	var path_File = './uploads/songs/'+songFile;

	fs.exists(path_File, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_File));
		}else{			
			res.status(200).send({message: 'no existe la cancion'});
		}
	});
}

module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadSongFile,
	getSongFile	
};