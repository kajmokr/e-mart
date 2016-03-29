/********************************************************************************************************************
 * PROFILE CONTROLLER
 ********************************************************************************************************************/
emart.controller('profileCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                          $timeout, toaster, authenticationService, dataService, $stateParams) {

    $scope.ownProfile = false;

    // GET INITIAL USER DATA
    var userPromise = dataService.getUser($stateParams.userID ? $stateParams.userID : $cookies.get('userID'));
    userPromise.then(function(result){
        $scope.tempUser = result.data[0];
        $scope.tempUser.dateRegistered = new Date($scope.tempUser.dateRegistered);

        // if own profile hide contact button
        if (!$stateParams.userID){
            $scope.ownProfile = true;
        }
    });

    //GET RATINGS OF CURRENT USER
    var userRatingsPromise = dataService.getUserRatings($stateParams.userID ? $stateParams.userID : $cookies.get('userID'));
    userRatingsPromise.then(function(result) {
        $scope.tempUser.ratings = result.data;

        // calculate the average rating for the user
        var ratingSum = 0;
        for (var i = 0; i < result.data.length; i++){
            ratingSum += +result.data[i].starRating;
        }
        $scope.tempUser.ratingsAvg = +ratingSum / +result.data.length;
    });

});
