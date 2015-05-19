'use strict';
SocialNetwork.controller('ProfileController',
    function($scope, $location, $route, profileAuthentication) {
        $scope.ClearData = function () {
            $scope.loginData = "";
            $scope.registerData = "";
            $scope.userData = "";
            $scope.passwordData = "";
        };
        $scope.uploadProfileImage = function() {
            var selector = document.body;

            $(selector).on('click', '#upload-file-button', function () {
                $('#picture').click();
            });

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
                    //Noty.error("Invalid file format.");
                    console.log('invalid format');
                }
            });
        }();

        $scope.uploadCoverImage = function() {
            var selector = document.body;

            $(selector).on('click', '#cover-upload-file-button', function () {
                $('#cover-picture').click();
            });

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
                    //Noty.error("Invalid file format.");
                    console.log('invalid format');
                }
            });
        }();

        $scope.getEditUserData = function() {
            profileAuthentication.GetUserProfile(
                function(serverData) {
                    $scope.userData = serverData;
                    console.log(serverData);
                }, function(serverError) {
                    console.log(serverError);
                }
            )
        }();

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
                    var image = new Image();
                    //image.src = $scope.userData.coverImageData;
                    $('#header').css('background-image', 'url:' + image);
                    $location.path('/profile');
                },
                function (serverError) {
                    console.log(serverError);
                });
        };

        $scope.changePassword = function () {
            profileAuthentication.ChangePassword($scope.passwordData,
                function() {
                    $scope.ClearData();
                    $location.path('/profile');
                },
                function (serverError) {
                    console.log(serverError);
                });
        };



    }
);