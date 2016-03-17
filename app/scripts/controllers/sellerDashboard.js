/**
 * Created by kimeshan on 10/03/2016.
 */

emart.controller('sellerDashboardCtrl', function ($scope, $http, $state, $cookies, toaster, dataService) {
    $scope.data = {}; //creating new scope that can be used inside tabset
    $scope.data.categories = dataService.hashedCategories;
    $scope.data.conditions = dataService.hashedConditions;


    $scope.data.getCategoryOfItem = function (item) {
        return $scope.data.categories[item.categoryID].name;
    }

    $scope.data.getConditionOfItem = function (item) {
        return $scope.data.conditions[item.conditionID].name;
    }

    $scope.data.getItemNamebyID = function (itemID) {
        return $scope.data.hashedItems[itemID].name;
    }


    //Get items of the current user
    var sellerItemsPromise = dataService.getSellerItems($cookies.userID);
    sellerItemsPromise.then(function(result) {
        //inside promise then
        $scope.data.items = result.data;
        $scope.data.hashedItems = dataService.generateHashTable($scope.data.items, "itemID");
    });

    //Get the auctions of the current user
    var sellerAuctionsPromise = dataService.getSellerAuctions($cookies.userID);
    sellerAuctionsPromise.then(function(result) {
        //inside promise then
        $scope.data.auctions = result.data;
        console.log(result.data);
    });

});
