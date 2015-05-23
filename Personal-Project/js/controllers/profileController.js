'use strict';

SocialNetwork.controller('ProfileController',
    function($scope, $location, $route, $routeParams, profileAuthentication, notifyService) {
        $scope.ClearData = function () {
            $scope.loginData = "";
            $scope.registerData = "";
            $scope.userData = "";
            $scope.passwordData = "";
        };

        $scope.menuOpened = false;
        $scope.friendsOpened = false;
        $scope.username = sessionStorage['username'];

        $scope.toggleFriends = function(event) {
            $scope.friendsOpened = !$scope.friendsOpened;
            event.stopPropagation();
        };

        $scope.toggleMenu = function(event) {
            $scope.menuOpened = !($scope.menuOpened);
            event.stopPropagation();
        };

        function isDescendant(parent, child) {
            var node = child.parentNode;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }

        window.onclick = function(event) {
            var friendRequestParent = document.getElementById("friendRequestLi");
            var searchParent = document.getElementById("searchMenuDiv");
            var isDescendantFriendRequests = isDescendant(friendRequestParent, event.target);
            var isDescendantSearch = isDescendant(searchParent, event.target);
            if(!isDescendantFriendRequests) {
                if ($scope.friendsOpened) {
                    $scope.friendsOpened = false;
                    $scope.$apply();
                }
            }
            if(!isDescendantSearch) {
                if ($scope.menuOpened) {
                    $scope.menuOpened = false;
                    $scope.$apply();
                }
            }
        };

        $scope.searchMenuShown = false;

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
                            $location.path('/404');
                            console.log(error);
                        }
                    );
                }
            }

        }();

        $scope.acceptRequest = function(request) {
            profileAuthentication.ApproveRequest(request.id,
                function() {
                    var requestIndex = $scope.friendRequests.indexOf(request);
                    $scope.friendRequests.splice(requestIndex, 1);
                    $scope.getFriendsPreview();
                }, function(error) {
                    console.log(error);
                })
        };

        $scope.rejectRequest = function(request) {
            profileAuthentication.RejectRequest(request.id,
                function() {
                    var requestIndex = $scope.friendRequests.indexOf(request);
                    $scope.friendRequests.splice(requestIndex, 1);
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

        $scope.searchUserByName = function(search) {
            if(search.length > 0) {
                profileAuthentication.searchUserByName(search,
                    function(data){
                        console.log(data);
                        $scope.foundUsers = data;
                    }, function(error){
                        console.log(error);
                    })
            } else {
                $scope.foundUsers = {};
            }
        };

        $scope.sendFriendRequest = function(username) {
            profileAuthentication.SendRequest(username,
                function(data) {
                    notifyService.showInfo(data.message);
                    $scope.otherUserData.hasPendingRequest = true;
                }, function(error) {
                    console.log(error);
                }
            )
        };

        $scope.getFriendsPreview = function() {
            var username = $routeParams.username;
            if(username !== sessionStorage['username']) {
                profileAuthentication.getFriendsPreview(username,
                    function(data) {
                        $scope.friends = data;
                    }, function() {
                        $location.path('/404');
                    }
                );
            } else {
                profileAuthentication.getOwnFriendsPreview(
                    function(data) {
                        console.log(data);
                        $scope.friends = data;
                    }, function(error) {
                        console.log(error);
                    }
                );
            }
        };

        $scope.getFriends = function() {
            var username = $routeParams.username;
            if(username !== sessionStorage['username']) {
                profileAuthentication.listFriends(username,
                    function(data) {
                        console.log(data);
                        $scope.listedFriends = data;
                    }, function(error) {
                        console.log(error);
                    }
                );
            } else {
                profileAuthentication.listOwnFriends(
                    function(data) {
                        console.log(data);
                        $scope.listedFriends = data;
                    }, function(error) {
                        console.log(error);
                    }
                );
            }
        };

        $scope.getUserPreviewData = function(username, $event){
            profileAuthentication.getUserPreviewData(username,
                function(data) {
                    $scope.newsFeedhover = !$scope.newsFeedhover;
                    $scope.profileHover = !$scope.profileHover;
                    var hoverBox = document.getElementsByClassName('hoverBoxChe')[0];
                    hoverBox.style.position = 'absolute';
                    hoverBox.style.left = $event.pageX + 'px';
                    hoverBox.style.top = $event.pageY + 'px';
                    hoverBox.style.background = 'white';
                    hoverBox.style.width = 300 + 'px';
                    $scope.previewData = data;
                }, function(error) {
                    console.log(error);
                }
            );
        };

        $scope.hoverLeave = function() {
            $scope.newsFeedhover = !$scope.newsFeedhover;
            $scope.profileHover = !$scope.profileHover;
        };

        $scope.checkUserIsFriend = function(otherUserData) {
            //if(!otherUserData || (!otherUserData.isFriend && otherUserData.username !== $scope.username)) {
            //    $location.path('/news');
            //}
        };


    }
);