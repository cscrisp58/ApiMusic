
var fs = require('fs');
var path = 	require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
 		message: 'probando una accion del controlador de usuarios del api rest con node y mongo'
	}); 
}

function saveUser(req, res){
	var user = new User();
	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email.toLowerCase();
	user.role = 'ROLE_USER';
	user.image = 'null';
	

	if(params.password){
		//ENCRIPTAR LA CONTRASEÑA Y GUARDAR
		bcrypt.hash(params.password, null, null, function(err, hash){

			user.password = hash;

			if(user.name != null && user.surname != null && user.email != null){
					//DEVOLVER LOS DATOS DEL USUARIO LOGUEADO.
					user.save((err, userStored) => {
						if(err){
							res.status(500).send({message: 'backRes: Error al guardar el usuarios'});	
						}else{
							if(!userStored){
								res.status(404).send({message: 'backRes: no se ha registrado el usuario'});
							}else{
								res.status(200).send({user: userStored});
							}
						}
					});
			}else{

				res.status(200).send({message: 'backRes: Rellena todos los campos'});
			}
		}); 	 	
	
	}else{
		if(!params.password){
			res.status(500).send({message: 'backRes: introduce la contraseña'});		
		}		
	}
}

  
function loginUser(req, res){

	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {

		if(err){

			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{
				//COMPROBAR LA CONTRASEÑA
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						//DEVOLVER LOS DATOS DEL USUARIO LOGUEADO
						if(params.gethash){
							//DEVOLVER UN TOKEN DE JWT 
							res.status(200).send({
								
							token: jwt.createToken(user)
								
							});	
						}else{
							res.status(200).send(user);
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido loguearse'});

					}
				});

			}
		}
	});
}


function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;
	

	if(userId != req.user.sub){ 

		return res.status(500).send({message: 'no tienes permiso para actualizar este usuario'});

	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send(userUpdated);
			}
		}
	});
}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {

				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					 res.status(200).send({image: file_name, user: userUpdated});
				}
			});
		}else{
			 res.status(200).send({message: 'extension del archivo invalida'});	
		}
		console.log(file_name);
	}else{
		res.status(200).send({message: 'no has subido ninguna imagen'});	
 	
	}
}



function getImageFile(req, res){

	var imageFile = req.params.imageFile;
	var path_File = './uploads/users/'+imageFile;

	fs.exists(path_File, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_File));
		}else{			
			res.status(200).send({message: 'no existe la imagen'});
		}
	});
}




module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile

};
