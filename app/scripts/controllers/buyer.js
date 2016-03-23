/********************************************************************************************************************
 * BUYER CONTROLLER
 ********************************************************************************************************************/
emart.controller('buyerCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                          $timeout, toaster, authenticationService, dataService, $stateParams) {



        // ----------------------------------------------------------------------------
        // STUFF FROM BUYER DASHBOARD CTRL
        $scope.data = {}; //creating new scope that can be used inside tabset
        $scope.data.getItemNamebyID = function (itemID) {
            return $scope.data.hashedItems[itemID].name;
        };
        (function () {
            console.log($cookies);
            return request = $http({
                method: "post",
                url: "/scripts/php/mybids.php",
                data: {
                    bidderID: $cookies.get('userID')
                },
                headers: {'Content-Type': 'application/json'}
            }).then(function (response) {
                console.log(response);
                if (response !== 0) { //if no error when fetching database rows
                    console.log(response);
                    $scope.data.auctions = response.data;
                    console.log($scope.data.auctions);
                    if(($scope.data.auctions).length==0){
                        toaster.pop({
                            type: 'false',
                            title: 'No bid',
                            body: "You have no bid at the momoent. Why don't you place a bid? :)",
                            showCloseButton: false,
                            timeout: 2500
                        })
                    }
                }
                else {
                    console.log("Error loading drop down menu conditions and categories from database");
                }
            });
        })();
        console.log($cookies);
    })

    .controller('bookmarkCtrl', function ($scope, $http, $state, $cookies, toaster, dataService) {
        $scope.data = {}; //creating new scope that can be used inside tabset
        (function () {
            return request = $http({
                method: "post",
                url: "/scripts/php/bookmarklist.php",
                data: {
                    userID: $cookies.get('userID')
                },
                headers: {'Content-Type': 'application/json'}
            }).then(function (response) {
                console.log(response);
                if (response !== 0) { //if no error when fetching database rows
                    console.log(response);
                    $scope.data.auctions = response.data;
                    console.log($scope.data.auctions);
                }
                else {
                    console.log("Error loading drop down menu conditions and categories from database");
                }
            });
        })();
        $scope.data.removeBookmark = function (auctionID) {
            return request = $http({
                method: "post",
                url: "/scripts/php/removebookmark.php",
                data: {
                    auctionID: auctionID,
                    userID: $cookies.get('userID')
                },
                headers: {'Content-Type': 'application/json'}
            }).then(function (response) {
                console.log(response);
                if (response !== 0) { //if no error when fetching database rows
                    console.log(response);
                    alert("Bookmark is removed!")
                    $state.go("endingsoon")
                }
                else {
                    console.log("Error loading drop down menu conditions and categories from database");
                }

            })
        }
    })

    .controller('boughtItemsCtrl', function ($scope, $http, $state, $cookies, toaster, dataService) {
        console.log("Inside bought items ctrl");
        $scope.data = {}; //creating new scope that can be used inside tabset
        var request = $http({
            method: "post",
            url: "/scripts/php/selectRowBysql.php",
            data: {
                sql: "SELECT item.name, item.description, auction.auctioneerID, user.userID, user.firstName, "+
                "auction.auctionID, auction.name, auction.endDate, bid.bidID, bid.bidPrice, user.emailAddress "+
                "FROM item, auction, user, bid "+
                "WHERE item.buyerID="+$cookies.get('userID')+" AND item.itemID=auction.itemID AND "+
                "user.userID = auction.auctioneerID AND bid.bidID=auction.currentBidID GROUP BY item.itemID;"
            },
            headers: {'Content-Type': 'application/json'}
        });

        request.then(function (response) {
            console.log("Bought items", response);
            if (response !== 0) { //if no error when fetching database rows
                console.log(response);
                $scope.data.boughtitems = response.data;
                console.log($scope.data.boughtitems);
            }
            else {
                console.log("Error loading drop down menu conditions and categories from database");
            }
        });
        // ----------------------------------------------------------------------------


        // ----------------------------------------------------------------------------
        // STUFF FROM CREATE A BID CTRL
        $scope.data = {}; //creating new scope that can be used inside tabset
        $scope.data.auctionname = $stateParams.other;

        (function () {
            return request = $http({
                method: "post",
                url: "/scripts/php/selectRowBysql.php",
                data: {
                    sql: "select bidPrice, bidderID from bid where bidPrice = (select max(bidPrice) from bid WHERE auctionID=" + $stateParams.id + ")"
                },
                headers: {'Content-Type': 'application/json'}
            }).then(function (response) {
                console.log(response);
                if (response !== 0) { //if no error when fetching database rows
                    console.log(response);
                    $scope.data.currentbidPrice = response.data[0].bidPrice;
                    $scope.data.previousBidderID = response.data[0].bidderID;

                }
                else {
                    console.log("Error loading drop down menu conditions and categories from database");
                }
            });
        })();
        console.log($cookies);

        $scope.data.createBid = function () {
            // If x is Not a Number or less than one or greater than 10
            if ($scope.data.bidPrice <= $scope.data.currentbidPrice) {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'Bid needs to be HIGHER than current bid:(',
                    showCloseButton: false,
                    timeout: 2500
                });
            } else {
                var request = $http({
                    method: "post",
                    url: "/scripts/php/createBidCtrl.php",
                    data: {
                        bidPrice: $scope.data.bidPrice,
                        auctionID: $stateParams.id,
                        bidderID: $cookies.get('userID')
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                /* Successful HTTP post request or not */
                request.success(function (data) {
                    console.log("Response: ", data);
                    if (data == 1) {
                        $state.go('buyer.mybids');
                        toaster.pop({
                            type: 'success',
                            title: 'SUCCESS',
                            body: 'YOUR BID ADDED SUCCESSFULLY! :)',
                            showCloseButton: false,
                            timeout: 2500
                        })
                        sendemailtobuyer();
                        sendemailtoseller();


                    }
                    else {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'Unexpected error has occurred :(',
                            showCloseButton: false,
                            timeout: 2500
                        });
                    }
                })
            }
        }
        function sendemailtobuyer() {
            var request = $http({
                method: "post",
                url: "/scripts/php/sendEmailtoBuyer.php",
                data: {
                    bidderID: $scope.data.previousBidderID
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

            /* Successful HTTP post request or not */
            request.success(function (data) {
                console.log(data);
                if (data == true) {
                    console.log("Email sent to previous bidder")
                }
                else {
                    console.log("Unexpected error has occurred :(")
                }
            })
        }

        function sendemailtoseller() {
            var request = $http({
                method: "post",
                url: "/scripts/php/message.php",
                data: {
                    auctionID: $stateParams.id
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            /* Successful HTTP post request or not */
            request.success(function (data) {
                if (data == true) {
                    console.log("Email sent to seller")
                }
                else {
                    console.log("Unexpected error has occurred :(")
                }
            })
        }

        function sendemessagetoseller() {
            var request = $http({
                method: "post",
                url: "/scripts/php/sendEmailtoSeller.php",
                data: {
                    auctionID: $stateParams.id
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            /* Successful HTTP post request or not */
            request.success(function (data) {
                if (data == true) {
                    console.log("Email sent to seller")
                }
                else {
                    console.log("Unexpected error has occurred :(")
                }
            })}
        // ----------------------------------------------------------------------------



    });
