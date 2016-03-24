/********************************************************************************************************************
 * SELLER CONTROLLER
 ********************************************************************************************************************/
emart.controller('sellerCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                          $timeout, toaster, authenticationService, dataService, $stateParams) {
    
    // save categories and conditions on the $Scope
    $scope.categories = $rootScope.rootData.categories;
    $scope.conditions = $rootScope.rootData.conditions;
    
    // ADD ITEM VARIABLES
    $scope.slideInterval =  2000;
    $scope.imagesSaved = false;
    $scope.imageStrings = [];
    $scope.item = {};

    //---------------------------------------------------------------
    // ADD ITEM METHODS
    //---------------------------------------------------------------
    $scope.processFiles = function(files){
        angular.forEach(files, function(flowFile, i){
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var uri = event.target.result;
                $scope.imageStrings[i] = uri;
            };
            fileReader.readAsDataURL(flowFile.file);
        });

    };

    $scope.addItem = function (itemForm) {
        if (itemForm.name.$valid &&
            itemForm.category.$valid &&
            itemForm.description.$valid &&
            itemForm.condition.$valid
        ) {
            //Insert the item into the database now that it is validated
            var request = $http({
                method: "post",
                url: "/scripts/php/additem.php",
                data: {
                    itemname: $scope.item.name,
                    description: $scope.item.description,
                    category: $scope.item.category,
                    condition: $scope.item.condition,
                    ownerID: $cookies.get('userID')
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
    
            /* Successful HTTP post request or not */
            request.success(function (data) {
                console.log("Response: ",data);
                if(data[0]) {
                    $scope.newItemID = data[0];
                    //insert images into database
                    var insertImages = $http({
                        method: "post",
                        url: "/scripts/php/addImages.php",
                        data: {
                            itemID: $scope.newItemID,
                            images: $scope.imageStrings
                        },
                        headers: {'Content-Type': 'application/json'}
                    });
    
                    insertImages.success(function (data) {
                        console.log("Image insertion response from database", data);
                        if (data == 1) {
                            $state.go('seller.draft');
                            toaster.pop({
                                type: 'success',
                                title: 'Item Added',
                                body: 'Your item has been added successfully!',
                                showCloseButton: false,
                                timeout: 2500
                            });
                        }
                    });
                }
    
                else {
                    toaster.pop({
                        type: 'error',
                        title: 'Error',
                        body: 'Something went wrong, try again.',
                        showCloseButton: false,
                        timeout: 2000
                    });
                }
            });
    
        }
    
        else {
            toaster.pop({
                type: 'error',
                title: 'Error',
                body: 'Please fill out all fields correctly before proceeding!',
                showCloseButton: false,
                timeout: 2000
            });
        }
    };

    //---------------------------------------------------------------
    // 
    //---------------------------------------------------------------


    // ----------------------------------------------------------------------------
    // STUFF FROM ADD AUCTION
    //Initial the start and end date fields
    // var defaultAuctionLength = 7;
    // $scope.data.today = new Date();
    // $scope.data.startdate = $scope.data.today;
    // $scope.data.futureDate = new Date();
    // $scope.data.futureDate.setDate($scope.data.futureDate.getDate() + defaultAuctionLength);
    // $scope.data.enddate =   $scope.data.futureDate;
    //
    //
    // // //Get items of the current users
    // // var sellerItemsPromise = dataService.getSellerItems($cookies.get('userID'));
    // // sellerItemsPromise.then(function(result) {
    // //     //inside promise then
    // //     $scope.data.items = result.data;
    // // });
    //
    // //get the item chosen
    // $scope.data.addAuction = function () {
    //     console.log($scope.data);
    //     console.log($scope.data.startdate, $scope.data.enddate);
    //     //Validation
    //
    //
    //     if ($scope.data.auctionForm.name.$valid &&
    //         $scope.data.auctionForm.description.$valid &&
    //         $scope.data.auctionForm.startdate.$valid &&
    //         $scope.data.auctionForm.enddate.$valid &&
    //         $scope.data.auctionForm.startprice.$valid &&
    //         $scope.data.auctionForm.reserveprice.$valid &&
    //         $scope.data.auctionForm.instantprice.$valid
    //     ) {
    //         var request = $http({
    //             method: "post",
    //             url: "/scripts/php/addauction.php",
    //             data: {
    //                 auctioneerid: $cookies.get('userID'),
    //                 itemid: $scope.data.item,
    //                 auctionname: $scope.data.name,
    //                 description: $scope.data.description,
    //                 startingprice: $scope.data.startingprice,
    //                 reserveprice: $scope.data.reserveprice,
    //                 instantprice: $scope.data.instantprice,
    //                 startdate: $scope.data.startdate,
    //                 enddate: $scope.data.enddate
    //
    //             },
    //             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    //         });
    //
    //         // Successful HTTP post request or not
    //         request.success(function (data) {
    //             console.log("Response: ", data);
    //             if (data == 1) {
    //                 $scope.data.responseMessage = "";
    //                 $state.go('seller.onsale');
    //                 toaster.pop({
    //                     type: 'success',
    //                     title: 'Auction added',
    //                     body: 'Your auction has been added successfully!',
    //                     showCloseButton: false,
    //                     timeout: 2500
    //                 });
    //             }
    //             else {
    //                 toaster.pop({
    //                     type: 'error',
    //                     title: 'Error',
    //                     body: 'Something went wrong.',
    //                     showCloseButton: false,
    //                     timeout: 2000
    //                 });
    //             }
    //         });
    //     }
    //     else {
    //         toaster.pop({
    //             type: 'error',
    //             title: 'Error',
    //             body: 'Please fill out all fields before proceeding!',
    //             showCloseButton: false,
    //             timeout: 2000
    //         });
    //
    //     }
    //
    // };

    // ----------------------------------------------------------------------------
    // // STUFF FROM AUCTION LIST
    // $scope.data = {}; //creating new scope that can be used inside tabset
    // $scope.data.categoryID = $stateParams.categoryid;
    //
    // //GET AUCTIONS FOR SPECIFIC CATEGORY
    // // (function () {
    // //     return request = $http({
    // //         method: "post",
    // //         url: "/scripts/php/selectRowBysql.php",
    // //         data: {
    // //             sql: "SELECT auction.auctionID, item.itemID, auction.name, auction.description, auction.instantPrice, "+
    // //             "auction.isActive, auction.endDate, auction.currentBidID, bid.bidID, bid.bidderID, image.imageID, "+
    // //             "image.image, image.itemID, item.categoryID, item.conditionID, "+
    // //             "IFNULL((select max(bid.bidPrice) from bid WHERE bid.auctionID=auction.auctionID), auction.startingPrice) "+
    // //             "as auctionPrice "+
    // //             "FROM auction,item,bid,image "+
    // //             "WHERE auction.startDate < now() AND auction.endDate > now() AND auction.itemID = item.itemID AND item.categoryID="+$scope.data.categoryID+" AND auction.isActive=1 "+
    // //             "AND image.itemID=auction.itemID "+
    // //             "GROUP BY auction.auctionID;"
    // //         },
    // //         headers: {'Content-Type': 'application/json'}
    // //     }).then(function (response) {
    // //         if (response !== 0) { //if no error when fetching database rows
    // //             //console.log("AUCTIONS FOR THIS CATEGORY ", response.data);
    // //             $scope.data.auctions = response.data;
    // //         }
    // //         else {
    // //             console.log("Error loading drop down menu conditions and categories from database");
    // //         }
    // //     });
    // // })();
    //
    // //GET AUCTIONS ENDING SOON
    // // (function () {
    // //     return request = $http({
    // //         method: "post",
    // //         url: "/scripts/php/selectRowBysql.php",
    // //         data: {
    // //             sql: "SELECT auction.auctionID, item.itemID, auction.name, auction.description, auction.instantPrice, "+
    // //             "auction.isActive, auction.endDate, auction.currentBidID, bid.bidID, bid.bidderID, image.imageID, "+
    // //             "image.image, image.itemID, item.categoryID, item.conditionID, "+
    // //             "IFNULL((select max(bid.bidPrice) from bid WHERE bid.auctionID=auction.auctionID),auction.startingPrice) "+
    // //             "as auctionPrice "+
    // //             "FROM auction,item,bid,image "+
    // //             "WHERE auction.startDate < now() AND auction.endDate > now() AND auction.itemID = item.itemID AND auction.isActive=1 "+
    // //             "AND image.itemID=auction.itemID "+
    // //             "GROUP BY auction.auctionID "+
    // //             "ORDER BY auction.endDate" +
    // //             ";"
    // //         },
    // //         headers: {'Content-Type': 'application/json'}
    // //     }).then(function (response) {
    // //         if (response !== 0) { //if no error when fetching database rows
    // //             //console.log("AUCTIONS ENDING SOON: ", response.data);
    // //             $scope.data.endingsoon = response.data;
    // //         }
    // //         else {
    // //             console.log("Error loading drop down menu conditions and categories from database");
    // //         }
    // //     });
    // // })();
    //
    // $scope.data.addBookmark = function (auctionID) {
    //     dataService.addBookmark(auctionID);
    // }
    //
    // $scope.data.getCategoryName = function (categoryID) {
    //     return dataService.hashedCategories[categoryID].name;
    // }
    //
    // $scope.data.getConditionName = function (conditionID) {
    //     return dataService.hashedConditions[conditionID].name;
    // }
    //
    //
    // // ----------------------------------------------------------------------------
    // // STUFF FROM EDIT ITEM
    // $scope.data = {}; //creating new scope that can be used inside tabset
    // $scope.data.itemid = $stateParams.itemid;
    // //$scope.data.slideInterval = 2000;
    // $scope.data.imageStrings = [];
    //
    // $scope.data.deleteImage = function (idx) {
    //     console.log($scope.data.imageStrings.length);
    //     $scope.data.imageStrings.splice(idx, 1);
    //     console.log($scope.data.imageStrings.length);
    // };
    // console.log("ITEM ID", $scope.data.itemid);
    //
    // //Set default values
    // var reqItem = $http({
    //     method: "post",
    //     url: "/scripts/php/selectRowsGeneric.php",
    //     data: {
    //         table: 'item',
    //         where: 'WHERE itemID='+$scope.data.itemid
    //     },
    //     headers: { 'Content-Type': 'application/json' }
    // });
    //
    // reqItem.success(function (data) {
    //     if (data) {
    //         console.log("Item returned", data);
    //         var currentItem = $scope.data.category = $scope.data.condition = data[0];
    //         $scope.data.name = currentItem.name;
    //         $scope.data.description = currentItem.description;
    //         //$scope.data.imageStrings = ;
    //     }
    // });
    //
    // var getImages = $http({
    //     method: "post",
    //     url: "/scripts/php/selectRowsGeneric.php",
    //     data: {
    //         table: 'image',
    //         where: 'WHERE itemID='+$scope.data.itemid
    //     },
    //     headers: { 'Content-Type': 'application/json' }
    // });
    //
    // getImages.success(function (data) {
    //     if (data) {
    //         console.log("Images returned", data);
    //         $scope.data.imageObject = data;
    //         data.forEach(function (image) {
    //             $scope.data.imageStrings.push(image.image);
    //         });
    //         console.log($scope.data.imageStrings);
    //         console.log($scope.data.imageObject);
    //     }
    // });
    //
    //
    // $scope.data.select = "selected";
    // //Add image
    //
    // $scope.data.imagesSaved = false;
    // $scope.data.imagesAdded = "Add images first.";
    //
    // //process files
    // $scope.data.processFiles = function(files) {
    //     $scope.data.imageStrings = [];
    //     angular.forEach(files, function (flowFile, i) {
    //         var fileReader = new FileReader();
    //         fileReader.onload = function (event) {
    //             var uri = event.target.result;
    //             $scope.data.imageStrings[i] = uri;
    //         };
    //         fileReader.readAsDataURL(flowFile.file);
    //     });
    //     $scope.data.imagesAdded = "Now Click Upload";
    //
    // };
    //
    // $scope.data.saveImages = function () {
    //     if ($scope.data.imageStrings.length>0) {
    //         $scope.data.imagesSaved = true;
    //     }
    // };
    //
    // $scope.data.editItem = function () {
    //     console.log("Inside edit item method...");
    //     console.log($scope.data.name,$scope.data.description, $scope.data.category, $scope.data.condition);
    //     var request = $http({
    //         method: "post",
    //         url: "/scripts/php/editRowsBySQL.php",
    //         data: {
    //             sql: "UPDATE item SET name='"
    //             +$scope.data.name+"',description='"+$scope.data.description+"',categoryID='"
    //             +$scope.data.category.categoryID+"', conditionID='"+$scope.data.condition.conditionID
    //             +"' WHERE itemID='"+$scope.data.itemid+"'"
    //         },
    //         headers: { 'Content-Type': 'application/json' }
    //     });
    //
    //
    //     /* Successful HTTP post request or not */
    //     request.success(function (data) {
    //         if(data==1) {
    //             //ITEM EDITED SUCCESSFULLY
    //             //remove all old images from database
    //             var deleteImages = $http({
    //                 method: "post",
    //                 url: "/scripts/php/editRowsBySQL.php",
    //                 data: {
    //                     sql: "DELETE FROM image WHERE itemID="+$scope.data.itemid+"",
    //                 },
    //                 headers: {'Content-Type': 'application/json'}
    //             });
    //
    //             deleteImages.success(function (data) {
    //                 console.log("Image deletion response....", data);
    //                 if (data==1) {
    //                     console.log("Images sucessfully deleted!");
    //                     //Now add the new images
    //                     var insertImages = $http({
    //                         method: "post",
    //                         url: "/scripts/php/addImages.php",
    //                         data: {
    //                             itemID: $scope.data.itemid,
    //                             images: $scope.data.imageStrings
    //                         },
    //                         headers: {'Content-Type': 'application/json'}
    //                     });
    //
    //                     insertImages.success(function (data) {
    //                         console.log("Image insertion response from database", data);
    //                         if (data == 1) {
    //                             $scope.data.responseMessage = "ITEM AND IMAGES SUCCESSFULLY UPDATED!";
    //                             $state.go('seller.draft');
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //         else {
    //             $scope.data.responseMessage = "Couldn't write to DB!";
    //         }
    //     });
    // };
    //


});
