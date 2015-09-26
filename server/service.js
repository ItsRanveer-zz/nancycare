var db = require('./db.js');
var restler =require('restler');
var _ = require('underscore');
var async = require('async');
var uuid = require('uuid');

var service = function (){
}
var socket;
service.prototype.setSocket = function(sock){
	socket = sock;
};

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
		var collectionName = entry.content.name.coding[0].display;
		var obj = entry.content.valueQuantity;
		obj.patientId = patientId;
		obj.id = uuid.v4();
		obj.appliesDateTime = entry.content.appliesDateTime;
		obj.display = entry.content.name.coding[1].display;
		dorules(collectionName, obj);
		socket.emit(collectionName, obj);
		db.insert(collectionName, obj);
		cb();
	});
}

function dorules (collectionName, obj) {
  if (collectionName === 'MDC_PULS_OXIM_PULS_RATE') {
  	if (obj.value < 60 || obj.value > 80) {
  		obj.abnormal = true;
  		socket.emit('abnormal', obj);
  	}
  };
  if (collectionName === 'MDC_RESP_RATE') {
  	if (obj.value < 12 || obj.value > 25) {
  		obj.abnormal = true;
  		socket.emit('abnormal', obj);
  	}
  };
}


service.prototype.search =  function (patientId, collectioname, filter, cb) {
	filter.patientId = patientId;
	db.search(collectioname, filter, cb);
}

module.exports = new service();