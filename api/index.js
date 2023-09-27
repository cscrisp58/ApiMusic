var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;



mongoose.connect('mongodb://127.0.0.1:27017/api', (err, res) => {
	if(err){
		throw err;

		}else{
		console.log('la base de datos esta corriendo correctamente');

		app.listen(port, function(){
			console.log("servidor de api rest de musica escuchando en http://localhost:"+port)
		   });	
	}
});