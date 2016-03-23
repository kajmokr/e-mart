/********************************************************************************************************************
 * MAIN CONTROLLER
 ********************************************************************************************************************/
emart.controller('mainCtrl', function ($rootScope, $scope, $http, $state, $cookies, $timeout, toaster, authenticationService, dataService) {

    // ----------------------------------------------------------------
    // TOP NAVBAR CONTROLLER
    //Search service
    console.log($state.current.name);

    $scope.data.navSearch = function () {
        $state.go('search');
        searchService.setSearchTerm($scope.data.navSearchTerm);
    };
    // ----------------------------------------------------------------
    
    
    $rootScope.rootData = {};
    
    //LOGOUT FUNCTION
    $rootScope.logout = function () {
        authenticationService.logout();
    };

    //GET CATEGORIES AND CONDITIONS USING DATA SERVICE
    var myDataPromise = dataService.getData();
    myDataPromise.then(function(result) {
        $rootScope.rootData.categories = result.categories;
        $rootScope.rootData.conditions = result.conditions;
    });


    // TODO: WHAT IS THIS FOR?
    //START EMAILING SERVICE
    (function () {
        return request = $http({
            method: "post",
            url: "/scripts/php/auctionCtrl.php",
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            console.log(response);
            if (response !== 0) { //if no error when fetching database rows
                console.log(response);
            }
            else {
                console.log("Error");
            }
        });
    })();
    
});
