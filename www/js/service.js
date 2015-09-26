
var app = angular.module('starter.service', []);

app.service("socket", function() {
	var socket;
	
	this.init = function () {
	 socket = io('localhost:9090');
	},
	this.get = function () {
		return socket;
	}

});

app.service("pstatus", function() {
	var p = {
		1: 'ion-checkmark-circled green',
		2: 'ion-checkmark-circled red'
	};
	
	this.get = function (id) {
		return p[id];
	}

	

});

app.factory("api", function($http) {

	var BASE_URL = "https://gateway.api.pcftest.com:9004"; // HTTPS url
	var BASE_FHIR_INFO_URL = BASE_URL + "/v1/fhir_rest";
	var BASE_URL_PATIENT = BASE_FHIR_INFO_URL + "/Patient/";
	var BASE_URL_ORGANIZATION = BASE_FHIR_INFO_URL + "/Organization/";
	var BASE_URL_OBSERVATION = BASE_FHIR_INFO_URL + "/Observation";

	var accessToken = 'S6XRAP5odazgAHe7jkMgmsTDu92G';

	function getPatient(patient_id) {
		return $http({
			url: BASE_URL_PATIENT + patient_id,
			method: "GET",
			headers: {'Authorization':'Bearer ' + accessToken,'Accept':'application/json'}
			}).success(function (data, status, headers, config) {
				console.log(data);
				patientData = data;
				//$rootScope.$broadcast("Successful patient");
			}).error(function (data, status, headers, config) {
				console.log(data);
			});
	}
	return {
		getPatient: getPatient
	}
	

});