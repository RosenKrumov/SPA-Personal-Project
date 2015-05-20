'use strict';

SocialNetwork.controller('AuthenticationController',
    function ($scope, $location, $route, profileAuthentication, notifyService) {

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
                    notifyService.showInfo("Successfully logged in");
                    profileAuthentication.SetCredentials(serverData);
                    $scope.ClearData();
                    $location.path('/news');
                },
                function (serverError) {
                    notifyService.showError("Login error", serverError);
                    console.log(serverError);
                });
        };

        $scope.register = function () {
            profileAuthentication.Register($scope.registerData,
                function(serverData) {
                    console.log(serverData);
                    notifyService.showInfo("Successfully registered");
                    profileAuthentication.SetCredentials(serverData);
                    $scope.ClearData();
                    $location.path('/news');
                },
                function (serverError) {
                    notifyService.showError("Registration error", serverError);
                    console.log(serverError);
                });
        };

        $scope.logout = function () {
            $scope.ClearData();
            profileAuthentication.ClearCredentials();
            notifyService.showInfo("Logout successful");
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