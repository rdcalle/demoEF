(function () {
  'use strict';

  /* Controllers */

  angular.module('demoEF')
      .controller('HomeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {

          $scope.signin = function() {
              var formData = {
                  email: $scope.email,
                  password: $scope.password
              };

              Main.signin(formData, function(res) {
                  if (res.type === false) {
                      alert(res.data);
                  } else {
                      window.localStorage.setItem('token', res.data.token);
                      window.location = "/";
                  }
              }, function() {
                  $rootScope.error = 'Failed to signin';
              });
          };

          $scope.signup = function() {
              var formData = {
                  email: $scope.email,
                  password: $scope.password
              };

              Main.save(formData, function(res) {
                  if (res.type === false) {
                      alert(res.data);
                  } else {
                      window.localStorage.setItem('token', res.data.token);
                      window.location = "/";
                  }
              }, function() {
                  $rootScope.error = 'Failed to signup';
              });
          };

          $scope.me = function() {
              Main.me(function(res) {
                  $scope.myDetails = res;
              }, function() {
                  $rootScope.error = 'Failed to fetch details';
              });
          };

          $scope.logout = function() {
              Main.logout(function() {
                  window.location = "/";
              }, function() {
                  alert("Failed to logout!");
              });
          };

          $scope.token = window.localStorage.getItem('token') || 0;
      }])

      .controller('MeCtrl', ['$rootScope', '$scope', 'Main', function($rootScope, $scope, Main) {

          Main.me(function(res) {
              $scope.myDetails = res;
          }, function() {
              $rootScope.error = 'Falló el acceso a los datos de usuario';
          });

          $scope.delete = function() {
              Main.delete($scope.myDetails.data._id, function(res) {
                if (res.type === false) {
                    alert(res.data);
                } else {
                    window.localStorage.removeItem('token', res.data.token);
                    window.location = "/";
                }
              }, function() {
                alert('Falló el borrado del usuario');
              });
          };
      }])

      .controller('WorkCtrl', ['$rootScope', '$scope', 'Main', function($rootScope, $scope, Main) {

          kendo.culture("es-ES"); // Para poner el DatePicker de kendo en español

          // Nos traemos todos los datos almacenados en la colección de datos
          Main.work(function(res) {
            $scope.datas = res.data;
          }, function() {
            $rootScope.error = 'Falló el acceso a los datos';
          });

          // Almacena el nuevo dato
          $scope.newData = function() {
              var formData = {
                  date: $scope.objDate,
                  value: $scope.value
              };

              Main.newdata(formData, function(res) {
                  if (res.type === false) {
                      alert(res.data);
                  } else {
                      $scope.datas.push(res.data);
                      $scope.date = {};
                      $scope.value = "";
                  }
              }, function() {
                  $rootScope.error = 'Falló grabar el dato';
              });
          };
      }]);

}());
