// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.service'])

.run(function($ionicPlatform, socket) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
     socket.init();
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.appointments', {
    url: '/appointments',
    views: {
      'menuContent': {
        templateUrl: 'templates/appointments.html'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller :'LoginCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.patients', {
      url: '/patients',
      views: {
        'menuContent': {
          templateUrl: 'templates/patients.html',
          controller: 'PatientsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/patients/:patientId',
    views: {
      'menuContent': {
        templateUrl: 'templates/patient.html',
        controller: 'PatientCtrl'
      }
    }
  })

  .state('app.message', {
    url: '/message/:patientId',
    views: {
      'menuContent': {
        templateUrl: 'templates/message.html',
        controller: 'PatientCtrl'
      }
    }
  })

  .state('app.schedule', {
    url: '/schedule/:patientId',
    views: {
      'menuContent': {
        templateUrl: 'templates/schedule.html',
        controller: 'ScheduleCtrl'
      }
    }
  })

  .state('app.refer', {
    url: '/refer/:patientId',
    views: {
      'menuContent': {
        templateUrl: 'templates/refer.html',
        controller: 'PatientCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/patients');
  $urlRouterProvider.otherwise('/app/login');
});
