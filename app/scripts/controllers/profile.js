/********************************************************************************************************************
 * PROFILE CONTROLLER
 ********************************************************************************************************************/
emart.controller('profileCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                          $timeout, toaster, authenticationService, dataService, $stateParams) {

    $scope.ratings = true;
    $scope.sold = false;
    $scope.auctions = false;
    
    console.log($stateParams.userID);

    //--------------------------------
    // TOGGLE VIEWS
    //--------------------------------
    $scope.viewRatings = function () {
        $scope.ratings = true;
        $scope.auctions = false;
        $scope.sold = false;

        if ($scope.tempUser.ratings.length == 0){
            var message = $stateParams.userID === $cookies.get('userID') ? "You haven't received any ratings yet :/" : "User hasn't been rated yet.";
            toaster.pop({
                type: 'error',
                title: 'Error',
                body: message,
                showCloseButton: true,
                timeout: 10000
            });
        }
    };
    $scope.viewSold = function () {
        $scope.sold = true;
        $scope.ratings = false;
        $scope.auctions = false;
        
        if ($scope.tempUser.soldItems.length == 0){
            var message = $stateParams.userID === $cookies.get('userID') ? "You haven't sold anything yet!" : "User hasn't yet sold anything.";
            toaster.pop({
                type: 'error',
                title: 'Error',
                body: message,
                showCloseButton: true,
                timeout: 10000
            });
        }
        
    };
    $scope.viewAuctions = function () {
        $scope.auctions = true;
        $scope.sold = false;
        $scope.ratings = false;
        
        if ($scope.tempUser.auctions.length == 0){
            var message = $stateParams.userID === $cookies.get('userID') ? "You don't have any auctions!" : "User does not have any auctions";
            toaster.pop({
                type: 'error',
                title: 'Error',
                body: message,
                showCloseButton: true,
                timeout: 10000
            });
        }
    };

    var userPromise = dataService.getUser($stateParams.userID ? $stateParams.userID : $cookies.get('userID'));
    userPromise.then(function(result){
        $scope.tempUser = result.data[0]
    });

    // GET ITEMS ON SALE OF CURRENT USER
    var auctionsPromise = dataService.getSellerAuctions($stateParams.userID ? $stateParams.userID : $cookies.get('userID'));
    auctionsPromise.then(function(result) {
        console.log(result.data);
        $scope.tempUser.auctions = result.data;
    });

    // GET SOLD ITEMS OF CURRENT USER
    var soldItemsPromise = dataService.getSellerSoldItems($stateParams.userID ? $stateParams.userID : $cookies.get('userID'));
    soldItemsPromise.then(function(result) {
        console.log(result.data);
        $scope.tempUser.soldItems = result.data;
    });
    
    //GET RATINGS OF CURRENT USER
    var userRatingsPromise = dataService.getUserRatings($stateParams.userID ? $stateParams.userID : $cookies.get('userID'));
    userRatingsPromise.then(function(result) {
        console.log(result.data);
        $scope.tempUser.ratings = result.data;
    });
    
});
