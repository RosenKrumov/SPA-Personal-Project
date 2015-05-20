'use strict';

SocialNetwork.controller('postController',
    function($scope, $location, $route, $routeParams, postService, profileAuthentication, notifyService){

        var getUserPosts = function (postId) {
            if($routeParams.username) {
                if (!postId) {
                    var id = $routeParams.username;
                    postService.getUserPosts(id, profileAuthentication.GetHeaders(),
                        function (resp) {
                            console.log(resp);
                            $scope.userPosts = resp;
                        });
                } else {
                    id = $routeParams.username;
                    postService.getUserPosts(id, postId, profileAuthentication.GetHeaders(),
                        function (resp) {
                            console.log(resp);
                            $scope.currentPost = resp;
                        })
                }
            }
        }();

        $scope.getNewsFeed = function() {
            postService.getNewsFeed(profileAuthentication.GetHeaders(),
                function(data) {
                    $scope.news = data;
                    console.log(data);
                }, function(error){
                    console.log(error);
                }
            )
        }();

        $scope.addPost = function () {
            $scope.postData.Username = $routeParams.username;
            postService.addPost($scope.postData, profileAuthentication.GetHeaders(),
                function() {
                    notifyService.showInfo("Successful Ad Publish!");
                    $route.reload();
                },
                function (serverError) {
                    notifyService.showError("Unsuccessful Ad Publish!", serverError)
                })
        };
    }
);