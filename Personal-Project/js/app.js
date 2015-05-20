'use strict';

var SocialNetwork = angular.module('SocialNetwork', ['ngRoute']);

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
       .when('/requests', {
           templateUrl: 'templates/friend-request.html',
           controller: 'ProfileController'
       })
       .when('/:username', {
           templateUrl: 'templates/profile.html',
           controller: 'ProfileController'
       })
       .otherwise({redirectTo:'/'})
});