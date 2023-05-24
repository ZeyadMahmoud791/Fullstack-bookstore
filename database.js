const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Kate:0000@cluster0.msqihc5.mongodb.net/Project');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("Connection Succeeded");
})
module.exports = db;