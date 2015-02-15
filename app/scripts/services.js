(function () {
  'use strict';

  angular.module('angularRestfulAuth')
      .factory('Main', ['$http', function($http){
          var baseUrl = "http://localhost:3001";
          function changeUser(user) {
              angular.extend(currentUser, user);
          }

          function urlBase64Decode(str) {
              var output = str.replace('-', '+').replace('_', '/');
              switch (output.length % 4) {
                  case 0:
                      break;
                  case 2:
                      output += '==';
                      break;
                  case 3:
                      output += '=';
                      break;
                  default:
                      throw 'Illegal base64url string!';
              }
              return window.atob(output);
          }

          function getUserFromToken() {
              var user = {};
              if(typeof(window.localStorage) !== 'undefined') {
                var token = window.localStorage.getItem('token');
                if (token) {
                    var encoded = token.split('.')[1];
                    user = JSON.parse(urlBase64Decode(encoded));
                }
              }
              return user;
          }

          var currentUser = getUserFromToken();

          return {
              save: function(data, success, error) {
                  $http.post(baseUrl + '/signup', data).success(success).error(error);
              },
              signin: function(data, success, error) {
                  $http.post(baseUrl + '/authenticate', data).success(success).error(error);
              },
              me: function(success, error) {
                  $http.get(baseUrl + '/me').success(success).error(error);
              },
              delete: function(id, success, error) {
                  $http.delete(baseUrl + '/delete/' + id).success(success).error(error);
              },
              logout: function(success) {
                  changeUser({});
                  window.localStorage.removeItem('token');
                  success();
              }
          };
      }
  ]);
}());
