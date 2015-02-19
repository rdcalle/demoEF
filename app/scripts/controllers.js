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
                  value: $scope.value,
                  dateString: $scope.date
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

          // Almacena el nuevo dato
          $scope.modify = function() {
            var line = this;
            var DMY = line.dataline.dateString.split("/");
            line.dataline.date = new Date(DMY[2], String(Number(DMY[1])-1), DMY[0]).toISOString();
            Main.modifydata(line.dataline, function(res) {
              if(res) {
                line.canEdit = false;
              }
            }, function() {
              $rootScope.error = 'Falló modificar los datos';
            });
          };

          // Resetea los campos al cancelar la entrada de datos a editar
          $scope.resetFields = function() {
            var line = this;
            line.canEdit = false;
            Main.getData(line.dataline._id, function(res) {
              line.dataline = res.data;
            }, function() {
              $rootScope.error = 'Falló recuperar esta línea de datos';
            });
          };

          $scope.deleteData = function() {
            var line = this;
            Main.deleteData(line.dataline._id, function(res) {
              if(res) {
                var i = $scope.datas.indexOf(line.dataline);
                $scope.datas.splice(i, 1);
                line.dataline = {};
              }
            }, function() {
              $rootScope.error = 'Falló eliminar el dato';
            });
          };

      }]);

}());
