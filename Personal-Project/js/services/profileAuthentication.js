'use strict';

SocialNetwork.factory('profileAuthentication', function ($http, baseServiceUrl) {
    var service = {};

    var serviceUrl = baseServiceUrl + '/users';

    service.Login = function (loginData, success, error) {
        $http.post(serviceUrl + '/Login', loginData)
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    };

    service.Register = function (registerData, success, error) {
        $http.post(serviceUrl + '/Register', registerData)
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    };

    service.GetUserProfile = function (success, error) {
        $http.get(baseServiceUrl + '/me', {headers: this.GetHeaders()})
            .success(function (data, status, headers, config) {
                success(data)
            }).error(error);
    };

    service.EditUserProfile = function (editUserData, success, error) {
        $http.put(baseServiceUrl + '/me', editUserData, {headers: this.GetHeaders()})
            .success(function (data, status, headers, config) {
                success(data)
            }).error(error);
    };

    service.ChangePassword = function (passwordData, success, error) {
        $http.put(baseServiceUrl + '/me/ChangePassword', passwordData, {headers: this.GetHeaders()})
            .success(function (data, status, headers, config) {
                success()
            }).error(error);
    };

    service.SetCredentials = function (serverData) {
        sessionStorage['accessToken'] = serverData.access_token;
        sessionStorage['username'] = serverData.userName;
    };

    service.GetUsername = function () {
        return sessionStorage['username'];
    };

    service.ClearCredentials = function () {
        sessionStorage.clear();
    };

    service.GetHeaders = function() {
        return {
            Authorization: "Bearer " + sessionStorage['accessToken']
        };
    };

    service.isLoggedIn = function () {
        return sessionStorage['accessToken'];
    };

    return service;
});