


var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'miclave';

exports.ensureAuth = function(req, res, next){


	if(!req.headers.authorization){
		return res.status(403).send({message: 'la peticion no tiene la cabecera de autenticacion'});
	console.log(req)
	}

		var token = req.headers.authorization.replace(/['"]+/g, '');
		//console.log(token);

		try{

		var payload = jwt.decode(token, secret);
		//console.log(payload);
		
		if(payload.exp <= moment().unix()){
 			return res.status(401).send({message: 'el token ha expirado'});
					}
		}catch(ex){
			console.log(ex);
			return res.status(404).send({message: 'token no valido'});
		}
		
		req.user = payload;

		next();  
};



