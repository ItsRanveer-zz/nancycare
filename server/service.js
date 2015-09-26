var db = require('./db.js');
var restler =require('restler');
var _ = require('underscore');
var async = require('async');

var service = function (){
}

service.prototype.collectObservation = function(patientId, token, cb){
  
	var args ={
	    headers:{
	    	"Authorization":"Bearer " + token, 
	    	"Accept":"application/json"
	    } 
  	};
  	var observation = [];

  	var patientObservationUrl = "https://gateway.api.pcftest.com:9004/v1/fhir_rest/Observation?subject:_id=" + patientId;
  	getData(patientObservationUrl, args, function (err, data){
  		
  		cb(null,data);

  		getPagedData(args, data, observation, function (action, data, cb) {
  			if (action === 'more') {
  				console.log(data);
  				getVitals(patientId, data);
  				getPagedData(args, data, observation, cb);
  			} else {
  				observation = _.union(observation, data.entry);
  			}
  		});
  	}); 	
}


function getPagedData (args, data, observation, cb) {
	var nextUrl = _.find(data.link, function(l){ 
		return l.rel == 'next'; 
	});

	if (nextUrl) {
		getData(nextUrl.href, args, function (err, data) {
			observation = _.union(observation, data.entry);
			cb('more', data, cb);
		});
	} else {
		cb('done');
	}
}

function getData (url, args, cb) {
	restler.get(url, args).on('complete', function(data) {
  		var json = JSON.parse(data);
        cb(null, json);
	});
}


function getVitals (patientId, data) {
	async.each(data.entry, function (entry, cb) {
		var obj = entry.content.valueQuantity;
		obj.patientId = patientId;
		obj.appliesDateTime = entry.content.appliesDateTime;
		db.insert(entry.content.name.coding[0].display, obj);
		cb();
	});
}

service.prototype.saveBP = function(patientId, data, cb){
	data.patientId = patientId;
	db.insert('bp', data, cb);
}

module.exports = new service();