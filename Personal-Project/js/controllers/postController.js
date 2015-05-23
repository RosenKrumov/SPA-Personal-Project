'use strict';

SocialNetwork.controller('postController',
    function($scope, $location, $route, $routeParams, postService, profileAuthentication, notifyService){

        $scope.username = sessionStorage['username'];
        $scope.commentsClicked = {};
        $scope.showCommentsClicked = {};
        $scope.news = [];
        $scope.userPosts = [];
        $scope.wallLastPostReached = false;
        $scope.newsLastPostReached = false;

        $scope.clickComments = function(id){
            $scope.commentsClicked[id] = !$scope.commentsClicked[id];
        };

        $scope.checkCommentsClicked = function(id) {
            return $scope.commentsClicked[id];
        };

        var getUserPosts = function () {
            if(!$scope.wallLastPostReached) {
                if($routeParams.username) {
                    var id = $routeParams.username;
                    postService.getUserPosts($scope.lastPostId, 5, id, profileAuthentication.GetHeaders(),
                        function (resp) {
                            if(resp.length == 0) {
                                $scope.wallLastPostReached = true;
                            } else {
                                $scope.userPosts.push.apply($scope.userPosts, resp);
                                $scope.lastPostId = resp[resp.length - 1].id;
                            }
                        });
                }
            }
        };

        getUserPosts();

        $scope.getNewsFeed = function() {
            if(!$scope.newsLastPostReached) {
                postService.getNewsFeed($scope.startPostId, 10, profileAuthentication.GetHeaders(),
                    function(data) {
                        if(data.length == 0) {
                            $scope.newsLastPostReached = true;
                        } else {
                            $scope.news.push.apply($scope.news, data);
                            $scope.startPostId = data[data.length - 1].id;
                        }
                    }, function(error){
                        console.log(error);
                    }
                )
            }
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
        };

        $scope.pageSize = 10;

        $(document).ready(function(){
            function addMoreNews() {
                $scope.getNewsFeed();
            }

            function addMorePosts() {
                getUserPosts();
            }

            //lastAddedLiveFunc();
            $(window).scroll(function(){

                var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
                var  scrolltrigger = 0.95;

                if  ((wintop/(docheight-winheight)) > scrolltrigger) {
                    addMoreNews();
                    addMorePosts();
                }
            });
        });
    }
);