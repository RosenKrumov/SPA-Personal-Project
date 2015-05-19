'use strict';
SocialNetwork.controller('ProfileController',
    function($scope, $location, $route, profileAuthentication) {
        $scope.uploadImage = function() {
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
                        $scope.editUserData.profileImageData = $('.picture-preview').attr('src');
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
            profileAuthentication.EditUserProfile($scope.editUserData,
                function() {
                    //$scope.ClearData();
                    $location.path('/profile');
                },
                function (serverError) {
                    console.log(serverError);
                });
        };

        $scope.changePassword = function () {
            profileAuthentication.ChangePassword($scope.passwordData,
                function() {
                    //$scope.ClearData();
                    $location.path('/profile');
                },
                function (serverError) {
                    console.log(serverError);
                });
        };



    }
);