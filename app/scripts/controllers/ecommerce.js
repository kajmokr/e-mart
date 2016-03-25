/********************************************************************************************************************
 * ECOMMERCE CONTROLLER
 ********************************************************************************************************************/
emart.controller('ecommerceCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                            $timeout, toaster, authenticationService, dataService, $stateParams, $window) {
    
    $scope.auctions = {};
    //GET AUCTIONS BY CATEGORY
    if ( $stateParams.categoryid !== 'undefined' ){
        var auctionsPromise = dataService.getAllLiveAuctions($stateParams.categoryid);
        auctionsPromise.then(function(result) {
            $scope.auctions = result;
        });
    }

    //GET AUCTIONS ENDING SOON
    var endingSoonAuctionsPromise = dataService.getAuctionsEndingSoon();
    endingSoonAuctionsPromise.then(function(result) {
        $scope.endingsoon = result;
    });


    //GET A SPECIFIC AUCTION
    if ( $stateParams.auctionid !== 'undefined'){
        var auctionPromise = dataService.getSingleAuction($stateParams.auctionid);
        auctionPromise.then(function(result) {
            console.log("helllo", result);
            $scope.auction = result;
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
            console.log("response to check if watched request",data);
            if (data.length>0) {
                $scope.watched = true;
                $scope.watchButtonColor = "primary";
                $scope.watchAction = "Watching";
            }
            else {
                $scope.watched = false;
                $scope.watchButtonColor = "white"
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
             console.log(data);

         });
     }

    //CONTACT BUYER / SELLER
    $scope.goToURL = function (email, subject) {
        $window.open("mailto:"+email+"?Subject="+subject, "_blank");
    };

    //
    // // $scope.data.getCategoryOfItem = function (item) {
    // //     return dataService.hashedCategories[item.categoryID].name;
    // // };
    // //
    // // $scope.data.getConditionOfItem = function (item) {
    // //     return dataService.hashedConditions[item.conditionID].name;
    // // };
    // //
    // // $scope.data.getItemNamebyID = function (itemID) {
    // //     return $scope.data.hashedItems[itemID].name;
    // // };
    // //
    // // $scope.data.createAuction = function () {
    // //     $state.go('addauction');
    // // };
    //
    // // TODO: delete item function
    // // $scope.data.deleteItem = function (itemID) {
    // //     swal({
    // //         title: "Are you sure?",
    // //         text: "Deleting this item cannot be undone!",
    // //         type: "warning",
    // //         showCancelButton: true,
    // //         confirmButtonColor: "#DD6B55",
    // //         confirmButtonText: "Yes",
    // //         cancelButtonText: "Cancel!",
    // //         allowOutsideClick: true,
    // //         closeOnConfirm: false,
    // //         closeOnCancel: true
    // //     }, function(isConfirm){
    // //         if (isConfirm) {
    // //
    // //             dataService.deleteItem(itemID);
    // //
    // //             dataService.deleteItem.success(function (data) {
    // //                 if (data==1) {
    // //                     //Item deleted
    // //                     $state.reload();
    // //                     swal({
    // //                         title: "Success!",
    // //                         text: "Item has been deleted!",
    // //                         type: "success",
    // //                         timer: 2000,
    // //                         showConfirmButton: false
    // //                     });
    // //                 }
    // //                 else {
    // //                     swal({
    // //                         title: "Delete failed!",
    // //                         text: "Item deletion was not completed.",
    // //                         type: "warning",
    // //                         timer: 2000,
    // //                         showConfirmButton: false
    // //                     });
    // //                 }
    // //             });
    // //         }
    // //     });
    // // };
    //
    //
    //
    // $scope.data.getItemNamebyID = function (itemID) {
    //     return $scope.data.hashedItems[itemID].name;
    // };
    //
    // $scope.data.createAuction = function () {
    //     $state.go('addauction');
    // };
    //
    // (function () {
    //     //Get items that do not have auctions coming up or are already in a live auction
    //     var requestDraftItems = $http({
    //         method: "post",
    //         url: "/scripts/php/selectRowBysql.php",
    //         data: {
    //             sql:  "SELECT i.* FROM item i LEFT JOIN auction a ON i.itemID = a.itemID AND a.isActive=1 "
    //             +"WHERE a.itemID IS NULL AND i.ownerID=1371 AND i.isSold=0 ;"
    //         },
    //         headers: { 'Content-Type': 'application/json' }
    //     });
    //     requestDraftItems.success(function (result) {
    //         console.log("DRAFT ITEMS: ", result);
    //         $scope.data.items = result;
    //     });
    //
    //     //Get sold items of user
    //     var sellerSoldItemsPromise = dataService.getSellerSoldItems($cookies.get('userID'));
    //     sellerSoldItemsPromise.then(function(result) {
    //         //inside promise then
    //         $scope.data.soldItems = result.data;
    //     });
    //
    //     //Get the auctions of the current user
    //     var sellerAuctionsPromise = dataService.getSellerAuctions($cookies.get('userID'));
    //     sellerAuctionsPromise.then(function(result) {
    //         //inside promise then
    //         $scope.data.auctions = result.data;
    //     });
    // })();
    //

    //

    //
    // // ----------------------------------------------------------------------------
    // // STUFF FROM BID HISTORY
    // $scope.data = {}; //creating new scope that can be used inside tabset
    // $scope.data.auctionname = $stateParams.other;
    // $scope.data.formatDate = function (phpDateTime) {
    //     var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    //         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    //     ];
    //     var date = new Date(phpDateTime);
    //     var day = date.getDate();
    //     var monthIndex = date.getMonth();
    //     var year = date.getFullYear();
    //     var hours = date.getHours();
    //     var minutes = date.getMinutes();
    //     return day+" "+monthNames[monthIndex]+" "+year+", "+hours+":"+minutes;
    // };
    //
    // (function () {
    //     console.log($stateParams);
    //     return request = $http({
    //         method: "post",
    //         url: "/scripts/php/bidhistory.php",
    //         data: {
    //             auctionID: $stateParams.id
    //         },
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(function (response) {
    //         console.log(response);
    //         if (response!==0) { //if no error when fetching database rows
    //             console.log(response);
    //             $scope.data.bids = response.data;
    //         }
    //         else {
    //             console.log("Error loading drop down menu conditions and categories from database");
    //         }
    //     });
    // })();
    // // ----------------------------------------------------------------------------
    //
    //
    //
    // // ----------------------------------------------------------------------------
    // // STUFF FROM PRODUCT DETAILS CTRL
    // // checks if auction ID is set and then gets the auction data
    // if ($stateParams.auctionid != null){
    //     $scope.data.auctionid = $stateParams.auctionid;
    //
    //     console.log("this auction is called");
    //     console.log($stateParams);
    //
    //     //Get the details for the auction
    //
    //     var getAuctionDetails = $http({
    //         method: "post",
    //         url: "/scripts/php/selectRowBysql.php",
    //         data: {
    //             sql:"SELECT auction.auctionID, item.itemID, auction.name, auction.description, auction.instantPrice, "+
    //             "auction.isActive, auction.endDate, auction.currentBidID, bid.bidID, bid.bidderID, image.imageID, "+
    //             "image.image, image.itemID, user.userID, user.firstName, user.userName, user.emailAddress, auction.startDate, "+
    //             "IFNULL((select max(bid.bidPrice) from bid WHERE bid.auctionID=auction.auctionID),auction.startingPrice) "+
    //             "as auctionPrice "+
    //             "FROM auction,item,bid,image,user "+
    //             "WHERE auction.auctionID="+$stateParams.auctionid+" AND auction.itemID = item.itemID "+
    //             "AND image.itemID=auction.itemID AND auction.auctioneerID=user.userID "+
    //             "GROUP BY auction.auctionID;"
    //         },
    //         headers: { 'Content-Type': 'application/json' }
    //     });
    //     getAuctionDetails.success(function (data) {
    //         if (data) {
    //             $scope.auction = data[0];
    //         }
    //     });
    //
    //
    // }

});
