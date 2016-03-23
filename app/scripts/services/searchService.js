/********************************************************************************************************************
 * SEARCH SERVICE
 ********************************************************************************************************************/
emart.service('searchService', ['$rootScope', '$http', function ($rootScope, $http) {
    var searchServiceScope = this;
    searchServiceScope.currentSearchTerm = "";

    searchServiceScope.setSearchTerm = function (term) {
        console.log("Setting search term...");
        searchServiceScope.currentSearchTerm = term;
        $rootScope.$broadcast('navSearchChanged', { newterm: term });
    }
}]);