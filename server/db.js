// Retrieve
var MongoClient = require('mongodb').MongoClient;
var database;

// Connect to the db
var url = 'mongodb://localhost:27017/nancycare';
MongoClient.connect(url, function(err, db) {
  if(err) { return console.dir(err); }
  console.log("Connected correctly to server.");
  database = db;
});
	
var db = function (){

}

db.prototype.insert = function (collectionName, data, cb) {

	database.collection(collectionName).insert( data, function(err, result) {
	    cb(null, data);
  	});
}

db.prototype.find = function (collectionName, patientId, cb) {

	var cursor = database.collection(collectionName).find( { "patientId": patientId });

	cursor.each(function(err, doc) {
		if (doc != null) {
		 console.dir(doc);
		} else {
		 cb(null, data);
		}
	});
}

db.prototype.search = function (collectionName, criteria, cb) {

	var cursor = database.collection(collectionName).find(criteria).sort( { "appliesDateTime": 1 } );
	
	cursor.each(function(err, doc) {
		if (doc != null) {
		 console.dir(doc);
		} else {
		 cb(null, data);
		}
	});
}

module.exports = new db();