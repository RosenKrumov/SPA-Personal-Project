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

    service.GetMyProfile = function (success, error) {
        $http.get(baseServiceUrl + '/me', {headers: this.GetHeaders() })
            .success(function (data, status, headers, config) {
                success(data)
            }).error(error);
    };

    service.GetUserProfile = function (username, success, error) {
        $http.get(baseServiceUrl + '/users/' + username , {headers: this.GetHeaders() })
            .success(function (data, status, headers, config) {
                success(data)
            }).error(error);
    };

    service.EditUserProfile = function (editUserData, success, error) {
        $http.put(baseServiceUrl + '/me', editUserData, { headers: this.GetHeaders() })
            .success(function (data, status, headers, config) {
                success(data)
            }).error(error);
    };

    service.GetFriendRequests = function(headers, success, error) {
        $http.get(baseServiceUrl + '/me/requests', { headers: headers })
            .success(function (data, status, headers, config) {
                success(data);
            }).error(error);
    };

    service.ChangePassword = function (passwordData, success, error) {
        $http.put(baseServiceUrl + '/me/ChangePassword', passwordData, { headers: this.GetHeaders() })
            .success(function (data, status, headers, config) {
                success()
            }).error(error);
    };

    service.ApproveRequest = function(id, success, error) {
        var url = baseServiceUrl + '/me/requests/' + id + '?status=approved';
        $http.put(url, null, { headers: this.GetHeaders() })
            .success(function () {
                success()
            }).error(error);
    };

    service.RejectRequest = function(id, success, error) {
        var url = baseServiceUrl + '/me/requests/' + id + '?status=rejected';
        $http.put(url, null, { headers: this.GetHeaders() })
            .success(function () {
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