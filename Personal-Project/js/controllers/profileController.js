'use strict';

SocialNetwork.controller('ProfileController',
    function($scope, $location, $route, $routeParams, profileAuthentication, notifyService) {
        $scope.ClearData = function () {
            $scope.loginData = "";
            $scope.registerData = "";
            $scope.userData = "";
            $scope.passwordData = "";
        };

        $scope.getFriendRequests = function() {
            profileAuthentication.GetFriendRequests(profileAuthentication.GetHeaders(),
                function(data) {
                    $scope.friendRequests = data;
                }, function(error) {
                    console.log(error);
                }
            );
        }();

        $scope.uploadProfileImage = function() {
            var selector = document.body;

            $(selector).on('change', '#picture', function () {
                var file = this.files[0],
                    reader;

                if (file.type.match(/image\/.*/)) {
                    reader = new FileReader();
                    reader.onload = function () {
                        $('.picture-name').text(file.name);
                        $('.picture-preview').attr('src', reader.result);
                        $scope.userData.profileImageData = $('.picture-preview').attr('src');
                    };
                    reader.readAsDataURL(file);
                } else {
                    notifyService.showError("Invalid file format");
                    console.log('invalid format');
                }
            });
        }();

        $scope.uploadCoverImage = function() {
            var selector = document.body;

            $(selector).on('change', '#cover-picture', function () {
                var file = this.files[0],
                    reader;

                if (file.type.match(/image\/.*/)) {
                    reader = new FileReader();
                    reader.onload = function () {
                        $('.cover-picture-name').text(file.name);
                        $('.cover-picture-preview').attr('src', reader.result);
                        $scope.userData.coverImageData = $('.cover-picture-preview').attr('src');
                    };
                    reader.readAsDataURL(file);
                } else {
                    notifyService.showError("Invalid file format");
                    console.log('invalid format');
                }
            });
        }();

        $scope.getMyData = function() {
            profileAuthentication.GetMyProfile(
                function(serverData) {
                    $scope.userData = serverData;
                }, function(serverError) {
                    console.log(serverError);
                }
            )
        }();

        $scope.getUserData = function() {
            if($routeParams.username) {
                if($routeParams.username === sessionStorage['username']) {
                    profileAuthentication.GetMyProfile(
                        function(serverData) {
                            $scope.otherUserData = serverData;
                            $scope.canPost = true;
                        }, function(serverError) {
                            console.log(serverError);
                        }
                    )
                } else {
                    profileAuthentication.GetUserProfile($routeParams.username,
                        function(data) {
                            $scope.otherUserData = data;
                            $scope.canPost = data.isFriend;
                        }, function(error) {
                            console.log(error);
                        }
                    );
                }
            }

        }();

        $scope.acceptRequest = function(id) {
            profileAuthentication.ApproveRequest(id,
                function() {
                    $route.reload();
                }, function(error) {
                    console.log(error);
                })
        };

        $scope.rejectRequest = function(id) {
            profileAuthentication.RejectRequest(id,
                function() {
                    $route.reload();
                }, function(error) {
                    console.log(error);
                })
        };

        $scope.editUser = function () {
            if (!$scope.userData.profileImageData) {
                delete $scope.userData.profileImageData;
            }
            if (!$scope.userData.coverImageData) {
                delete $scope.userData.coverImageData;
            }
            if (!$scope.userData.gender) {
                delete $scope.userData.gender;
            }
            if (!$scope.userData.name) {
                delete $scope.userData.name;
            }
            if (!$scope.userData.email) {
                delete $scope.userData.email;
            }
            profileAuthentication.EditUserProfile($scope.userData,
                function() {
                    $scope.ClearData();
                    notifyService.showInfo("Profile successfully edited");
                    var username = sessionStorage['username'];
                    $location.path('/' + username);
                    $location.path('/profile');
                },
                function (serverError) {
                    console.log(serverError);
                    notifyService.showError("Error editing profile", serverError);
                });
        };

        $scope.changePassword = function () {
            profileAuthentication.ChangePassword($scope.passwordData,
                function() {
                    $scope.ClearData();
                    notifyService.showInfo("Password changed successfully");
                    var username = sessionStorage['username'];
                    $location.path('/' + username);
                },
                function (serverError) {
                    console.log(serverError);
                    notifyService.showError("Error changing password", serverError);
                });
        };
    }
);