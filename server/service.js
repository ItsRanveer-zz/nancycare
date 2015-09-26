var db = require('./db.js');
var restler =require('restler');

var service = function (){

}

service.prototype.collectObservation = function(patientId, token, cb){
  
	var args ={
	    headers:{
	    	"Authorization":"Bearer " + token, 
	    	"Accept":"application/json"
	    } 
  	};

  	restler.get("https://gateway.api.pcftest.com:9004/v1/fhir_rest/Observation?subject:_id="+ patientId, args)
  	.on('complete', function(data) {
  		data = JSON.parse(data);
        cb(null, data.entry);
	});
}

service.prototype.saveBP = function(patientId, data, cb){
	data.patientId = patientId;
	db.insert('bp', data, cb);
}

module.exports = new service();