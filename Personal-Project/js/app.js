'use strict';

var SocialNetwork = angular.module('SocialNetwork', ['ngRoute', 'ui.bootstrap']);

SocialNetwork.constant('baseServiceUrl', 'http://softuni-social-network.azurewebsites.net/api');

SocialNetwork.config(function($routeProvider) {

   $routeProvider
       .when('/', {
           templateUrl: 'templates/welcome-screen.html'
       })
       .when('/login', {
           templateUrl: 'templates/login.html'
       })
       .when('/register', {
           templateUrl: 'templates/register.html'
       })
       .when('/profile/edit', {
           templateUrl: 'templates/edit-profile.html',
           controller: 'ProfileController'
       })
       .when('/profile/changePassword', {
           templateUrl: 'templates/change-password.html',
           controller: 'ProfileController'
       })
       .when('/news', {
           templateUrl: 'templates/news-feed.html',
           controller: 'ProfileController'
       })
       .when('/404', {
           templateUrl: 'templates/404-not-found.html',
           controller: 'ProfileController'
       })
       .when('/:username', {
           templateUrl: 'templates/profile.html',
           controller: 'ProfileController'
       })
       .when('/:username/friends', {
           templateUrl: 'templates/friends.html',
           controller: 'ProfileController'
       })
       .otherwise({redirectTo:'/'});


});

SocialNetwork.run(function ($rootScope, $location, profileAuthentication) {
    $rootScope.$on('$locationChangeStart', function () {
        if ($location.path().indexOf("login") === -1 && $location.path().indexOf("register") === -1 && !profileAuthentication.isLoggedIn()) {
            $location.path("/");
        }
        if (($location.path().indexOf("login") !== -1 || $location.path().indexOf("register")) !== -1 && profileAuthentication.isLoggedIn()) {
            $location.path("/news");
        }
    });
});

SocialNetwork.controller('CollapseDemoCtrl', function ($scope) {
    $scope.isCollapsed = false;
    $scope.isCommentCollapsed = true;

    $scope.collapse = function(condition) {
        if(condition === 'post') {
            $scope.isCollapsed = !$scope.isCollapsed;
        } else {
            $scope.isCommentCollapsed = !$scope.isCommentCollapsed;
        }
    };
});
