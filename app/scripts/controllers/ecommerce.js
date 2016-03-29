/********************************************************************************************************************
 * ECOMMERCE CONTROLLER
 ********************************************************************************************************************/
emart.controller('ecommerceCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                            $timeout, toaster, authenticationService, dataService, $stateParams, $window) {
    
    $scope.auctions = {};
    $scope.userType = $cookies.get('userType');

        //GET AUCTIONS BY CATEGORY
    if ( $stateParams.categoryid !== null){
        $scope.loadingByCategory = true;
        var auctionsPromise = dataService.getAllLiveAuctions($stateParams.categoryid);
        auctionsPromise.then(function(result) {
            $scope.loadingByCategory = false;
            $scope.auctions = result;

            // CONVERT STRING DATES TO JAVASCRIPT DATES
            for (var i = 0; i < result.length; i++){
                $scope.auctions[i].endDate = new Date($scope.auctions[i].endDate);
            }
        });
    }

    //GET AUCTIONS ENDING SOON
    $scope.loadingEndingSoon = true;
    var endingSoonAuctionsPromise = dataService.getAuctionsEndingSoon();
    endingSoonAuctionsPromise.then(function(result) {
        $scope.loadingEndingSoon = false;
        $scope.endingsoon = result;

        // save string date values as JavaScript dates
        for (var i = 0; i < result.length; i++){
            $scope.endingsoon[i].endDate = new Date($scope.endingsoon[i].endDate);
        }
    });


    //GET A SPECIFIC AUCTION
    if ( $stateParams.auctionid !== null){
        $scope.loadingAuction = true;

        var auctionPromise = dataService.getSingleAuction($stateParams.auctionid);
        auctionPromise.then(function(result) {
            
            $scope.loadingAuction = false;
            $scope.auction = result;
            
            // console.log("userID cookie ", $cookies.get('userID'));
            // console.log("scope userID ", $scope.auction.userID );

            // ONLY INCREMENT VIEW COUNT OF AUCTION IF SOMEONE ELSE THAN THE SELLER VIEWS THE ITEM
            if ( $cookies.get('userID') !== $scope.auction.userID){
                //INCREMENT THE VIEW COUNT OF THE AUCTION
                var incViews = $http({
                    method: "post",
                    url: "/scripts/php/editRowsBySQL.php",
                    data: {
                        sql: "UPDATE auction SET numViews=numViews+1 WHERE auctionID="+$stateParams.auctionid
                    },
                    headers: { 'Content-Type': 'application/json' }
                });
                /* Successful HTTP post request or not */
                incViews.success(function (data) {
                    if (data == 1) {
                        console.log("Views incremented");
                    }
                    else {
                        console.log("Failed to increment views");
                    }
                });
            }
        });
        // CHECK IF WATCHED
        var checkIfWatched = $http({
            method: "post",
            url: "/scripts/php/selectRowBysql.php",
            data: {
                sql:"SELECT * FROM bookmark WHERE auctionID="+$stateParams.auctionid+" AND userID="+$cookies.get('userID')
            },
            headers: { 'Content-Type': 'application/json' }
        });
        checkIfWatched.success(function (data) {
            // console.log("response to check if watched request",data);
            if (data.length>0) {
                $scope.watched = true;
                $scope.watchButtonColor = "primary";
                $scope.watchAction = "Watching";
            }
            else {
                $scope.watched = false;
                $scope.watchButtonColor = "white";
                $scope.watchAction = "Watch Auction";
            }
        });

    }

    
    //TOGGLE THE VIEW
    $scope.toggleView = function() {
        if ($state.current.name == "ecommerce.grid"){
            $state.go("ecommerce.list");
        }
        else{ $state.go("ecommerce.grid"); }
    };

    //GET NAME OF CATEGORY BASED ON CATEGORYID
    $scope.getCategoryName = function (categoryID) {
         return $rootScope.rootData.hashedCategories[categoryID].name;
    };

    //GET NAME OF CONDITION BASED ON CONDITIONID
    $scope.getConditionName = function (conditionID) {
         return $rootScope.rootData.hashedConditions[conditionID].name;
    };


    //ADD BOOKMARK
    $scope.addBookmark = function (auctionID) {
         dataService.addBookmark(auctionID).then(function (data) {
             // console.log(data);
         });
     };

    //RETURN IF AUCTION IS ACTIVE
    $scope.isActive = function (status) {
        return status==1?true:false;
    };

    //FORMAT DATE FUNCTIONS
    $scope.formatDate = function (phpDateTime) {
             var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
             ];
             var date = new Date(phpDateTime);
             var day = date.getDate();
             var monthIndex = date.getMonth();
             var year = date.getFullYear();
             var hours = date.getHours();
             var minutes = date.getMinutes();
             return day+" "+monthNames[monthIndex]+" "+year+", "+hours+":"+minutes;
    };

     // ----------------------------------------------------------------------------
     // GET BID HISTORY FOR AN AUCTION
     $scope.auctionname = $stateParams.other;
    if ($stateParams.bidhistoryauctionid!=='undefined' && $stateParams.userid === 'undefined') {
        $scope.bidhistauctionid = $stateParams.bidhistoryauctionid;
        (function () {
            // console.log($stateParams);
            return request = $http({
                method: "post",
                url: "/scripts/php/bidhistory.php",
                data: {
                    auctionID: $stateParams.bidhistoryauctionid
                },
                headers: { 'Content-Type': 'application/json' }
            }).then(function (response) {
                // console.log(response);
                if (response!==0) { //if no error when fetching database rows
                    // console.log(response);
                    $scope.bids = response.data;
                }
                else {
                    console.log("Error fetching bids");
                }
            });
        })();
    }
});
