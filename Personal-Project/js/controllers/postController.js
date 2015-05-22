'use strict';

SocialNetwork.controller('postController',
    function($scope, $location, $route, $routeParams, postService, profileAuthentication, notifyService){

        $scope.username = sessionStorage['username'];
        $scope.commentsClicked = {};
        $scope.showCommentsClicked = {};

        $scope.clickComments = function(id){
            $scope.commentsClicked[id] = !$scope.commentsClicked[id];
        };

        $scope.checkCommentsClicked = function(id) {
            return $scope.commentsClicked[id];
        };

        var getUserPosts = function () {
            if($routeParams.username) {
                var id = $routeParams.username;
                postService.getUserPosts(id, profileAuthentication.GetHeaders(),
                    function (resp) {
                        console.log(resp);
                        $scope.userPosts = resp;
                    });
            }
        };

        getUserPosts();

        $scope.getNewsFeed = function() {
            postService.getNewsFeed(profileAuthentication.GetHeaders(),
                function(data) {
                    $scope.news = data;
                }, function(error){
                    console.log(error);
                }
            )
        };

        $scope.getNewsFeed();

        $scope.addPost = function () {
            $scope.postData.username = $routeParams.username;
            postService.addPost($scope.postData, profileAuthentication.GetHeaders(),
                function() {
                    notifyService.showInfo("Successful Ad Publish!");
                    $route.reload();
                },
                function (serverError) {
                    notifyService.showError("Unsuccessful Ad Publish!", serverError)
                })
        };

        $scope.addCommentToPost = function(post) {
            postService.addCommentToPost(post.id, $scope.commentData, profileAuthentication.GetHeaders(),
                function(data) {
                    post.comments.unshift(data);
                    $scope.commentData = {};
                },
                function(serverError){
                    console.log(serverError);
                })
        };

        $scope.editPost = function (post) {
            postService.editPost(post.id, post, profileAuthentication.GetHeaders(),
                function() {
                    $route.reload();
                },
                function (serverError) {
                    console.log(serverError);
                })
        };

        $scope.deletePost = function (post) {
            postService.deletePost(post.id, profileAuthentication.GetHeaders(),
                function() {
                    $scope.userPosts = {};
                    getUserPosts();
                },
                function (serverError) {
                    console.log(serverError);
                })
        };

        $scope.likePost = function(post) {
            postService.likePost(post.id, profileAuthentication.GetHeaders(),
                function() {
                    post.liked = true;
                    post.likesCount++;
                },
                function(serverError) {
                    console.log(serverError);
                }
            )
        };

        $scope.unlikePost = function(post) {
            postService.unlikePost(post.id, profileAuthentication.GetHeaders(),
                function() {
                    post.liked = false;
                    post.likesCount--;
                },
                function(serverError) {
                    console.log(serverError);
                }
            )
        };

        $scope.deleteCommentOnPost = function(post, comment) {
            postService.deleteCommentOnPost(comment.id, post.id, profileAuthentication.GetHeaders(),
                function() {
                    var commentIndex = post.comments.indexOf(comment);
                    post.comments.splice(commentIndex, 1);
                }, function(error) {
                    console.log(error);
                }
            )
        };

        $scope.editCommentOnPost = function(post, comment) {
            postService.editCommentOnPost(comment.id, post.id, comment, profileAuthentication.GetHeaders(),
                function() {
                    $route.reload();
                }, function(error) {
                    console.log(error);
                }
            )
        };

        $scope.likeCommentOnPost = function(postId, comment) {
            postService.likeCommentOnPost(comment.id, postId, profileAuthentication.GetHeaders(),
                function() {
                    comment.liked = true;
                    comment.likesCount++;
                }, function(error) {
                    console.log(error);
                }
            )
        };

        $scope.unlikeCommentOnPost = function(postId, comment) {
            postService.unlikeCommentOnPost(comment.id, postId, profileAuthentication.GetHeaders(),
                function() {
                    comment.liked = false;
                    comment.likesCount--;
                }, function(error) {
                    console.log(error);
                }
            )
        };

        $scope.showAllCommentsOnPost = function(post) {
            postService.showAllCommentsOnPost(post.id, profileAuthentication.GetHeaders(),
                function(data){
                    post.comments = data;
                    $scope.showCommentsClicked[post.id] = true;
                }, function(error){
                    console.log(error);
                }
            )
        };

        $scope.hideAllCommentsOnPost = function(post) {
            post.comments = post.comments.slice(0, 3);
            $scope.showCommentsClicked[post.id] = false;
        }
    }
);