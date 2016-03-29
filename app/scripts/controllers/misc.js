/********************************************************************************************************************
 * PROFILE CONTROLLER
 ********************************************************************************************************************/
emart.controller('miscCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                          $timeout, toaster, authenticationService, dataService, $stateParams, $timeout) {

        $scope.stars = 1;
        $scope.description = "";
    
        // get user
        var rateUser = dataService.getUser($stateParams.userid);
        rateUser.then(function(result){
            $scope.rateUser = result.data[0];
        });

        // get stars
        $scope.getSelectedRating = function (stars) {
            $scope.stars = stars;
        };

    console.log($stateParams);


    $scope.saveRating = function (stars, description) {

            var request = $http({
                method: "post",
                url: "/scripts/php/saveRating.php",
                data: {
                        stars: stars,
                        description: description,
                        userID: $stateParams.userid,
                        raterID: $cookies.get('userID'),
                        auctionID: $stateParams.auctionid
                },
                headers: {'Content-Type': 'application/json'}
            });
            request.success(function (response) {
                if (response == true) { //if no error when fetching database rows
                    $state.go('profile');
                    toaster.pop({
                        type: 'success',
                        title: 'SUCCESS',
                        body: 'Your rating was successfully posted',
                        showCloseButton: false,
                        timeout: 2500
                    });
                }
                else {
                    console.log("Error saving rating");
                }
            });
        }
});


