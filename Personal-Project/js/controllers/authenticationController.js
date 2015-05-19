'use strict';

SocialNetwork.controller('AuthenticationController',
    function ($scope, $location, $route, profileAuthentication) {

        $scope.ClearData = function () {
            $scope.loginData = "";
            $scope.registerData = "";
            $scope.userData = "";
            $scope.passwordData = "";
        };

        $scope.login = function () {
            profileAuthentication.Login($scope.loginData,
                function(serverData) {
                    console.log(serverData);
                    profileAuthentication.SetCredentials(serverData);
                    $scope.ClearData();
                    $location.path('/news');
                },
                function (serverError) {
                    console.log(serverError);
                });
        };

        $scope.register = function () {
            profileAuthentication.Register($scope.registerData,
                function(serverData) {
                    console.log(serverData);
                    profileAuthentication.SetCredentials(serverData);
                    $scope.ClearData();
                    $location.path('/news');
                },
                function (serverError) {
                    console.log(serverError);
                });
        };

        $scope.logout = function () {
            $scope.ClearData();
            profileAuthentication.ClearCredentials();
            $route.reload();
        };

        $scope.clear = function () {
            $route.reload();
        };

        $scope.clearStatus = function () {
            $route.reload();
        }
    }
);