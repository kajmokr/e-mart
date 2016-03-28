/********************************************************************************************************************
 * MAIN CONTROLLER
 ********************************************************************************************************************/
emart.controller('mainCtrl', function ($rootScope, $state, $scope, $http, $cookies, $timeout, toaster, authenticationService, dataService) {
    
    $rootScope.rootData = {};
    $scope.searchTerm = "";
    $scope.userType = "";

    // WATCHES STATE CHANGES AND MAKES THEM ACCESSIBLE
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
    });
    
    // SEARCH BAR FUNCTION
    $scope.search = function (searchTerm) {
        // get the search results from the dataService
        var searchPromise = dataService.searchAuctions(searchTerm);
        searchPromise.then(function(result){
            $state.go('search');
            
            // when searchTerm is empty go to previous state 
            if ( searchTerm == ""){
                $state.go($rootScope.previousState);
            }
            $scope.searchResults = result.data;
            $scope.searchTerm = searchTerm;
        });
    };

    $scope.$watch(function(){
        return $cookies.get('userType');
    }, function(result){
        $scope.userType = result;
    });

    //LOGOUT FUNCTION
    $rootScope.logout = function () {
        authenticationService.logout();
    };

    //GET CATEGORIES AND CONDITIONS USING DATA SERVICE
    var myDataPromise = dataService.getData();
    myDataPromise.then(function(result) {
        $rootScope.rootData.categories = result.categories;
        $rootScope.rootData.conditions = result.conditions;
        $rootScope.rootData.hashedCategories = result.hashedCategories;
        $rootScope.rootData.hashedConditions = result.hashedConditions;
    });

    dataService.mailingService();
    
});
