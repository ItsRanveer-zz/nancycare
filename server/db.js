// Retrieve
var MongoClient = require('mongodb').MongoClient;
var database; 
// Connect to the db
MongoClient.connect("mongodb://localhost:27017/nancycare", function(err, db) {
  if(err) { return console.dir(err); }
  database = db;
});

var db = function (){

}

db.prototype.insert = function (collectionName, data, cb) {
	cb(null, data);
}

db.prototype.find = function (collectionName, patientId, cb) {
	var data;
	cb(null, data);
}

db.prototype.search = function (collectionName, criteria, cb) {
	var data;
	cb(null, data);
}


module.exports = new db();