'use strict';

SocialNetwork.factory('postService',
    function($http, baseServiceUrl) {
        var service = {};

        service.params = {};

        var serviceUrl =    baseServiceUrl + '/Posts/';

        service.addPost = function(postData, headers, success, error) {
            $http.post(serviceUrl, postData, {headers: headers})
                .success(function (data, status, headers, config) {
                    success(data);
                }).error(error);
        };

        service.getUserPosts = function(id, headers, success, error) {
            $http.get(baseServiceUrl + '/users/' + id + '/wall?PageSize=10', { headers: headers})
                .success(function (data, status, headers, config) {
                    success(data);
                }).error(error);
        };

        service.getNewsFeed = function(headers, success, error) {
            $http.get(baseServiceUrl + '/me/feed?PageSize=10', { headers: headers})
                .success(function (data, status, headers, config) {
                    success(data);
                }).error(error);
        };

        return service;
    }
);