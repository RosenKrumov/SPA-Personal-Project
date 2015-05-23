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