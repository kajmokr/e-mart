/********************************************************************************************************************
 * SELLER CONTROLLER
 ********************************************************************************************************************/
emart.controller('sellerCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                          $timeout, toaster, authenticationService, dataService, $stateParams, $window) {


    //GET DRAFT, AUCTIONS AND SOLD ITEMS
    var draftPromise = dataService.getDraftItems($rootScope.user.userID);
    draftPromise.then(function(result) {
        $scope.draftItems = result;
    });

    var itemPromise = dataService.getSellerAuctions($rootScope.user.userID);
    itemPromise.then(function(result) {
        $scope.auctions = result;
    });

    var soldPromise = dataService.getSellerSoldItems($rootScope.user.userID);
    soldPromise.then(function(result) {
        $scope.soldItems = result;
    });

    //CONTACT BUYER METHOD
    $scope.goToURL = function (email, subject) {
        $window.open("mailto:"+email+"?Subject="+subject, "_blank");
    };
    
    //SAVE CATEGORIES AND CONDITIONS FROM ROOT SCOPE
    $scope.categories = $rootScope.rootData.categories;
    $scope.conditions = $rootScope.rootData.conditions;
    
    // ADD ITEM VARIABLES
    $scope.slideInterval =  2000;
    $scope.imagesSaved = false;
    $scope.imageStrings = [];
    $scope.item = {};
    $scope.auction = {};

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
                            $state.go('seller.draft', {}, { reload: true });
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
    // ADD ITEM METHODS
    //---------------------------------------------------------------
     $scope.deleteItem = function (itemID) {
         swal({
             title: "Are you sure?",
             text: "Deleting this item cannot be undone!",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "Yes",
             cancelButtonText: "Cancel!",
             allowOutsideClick: true,
             closeOnConfirm: false,
             closeOnCancel: true
         }, function(isConfirm){
             if (isConfirm) {

                 var deleteItemPromise = dataService.deleteItem(itemID);
                 deleteItemPromise.then(function (data) {
                     if (data) {
                         //Item deleted
                         $state.reload();
                         swal({
                             title: "Success!",
                             text: "Item has been deleted!",
                             type: "success",
                             timer: 2000,
                             showConfirmButton: false
                         });
                     }
                     else {
                         swal({
                             title: "Delete failed!",
                             text: "Item deletion was not completed.",
                             type: "warning",
                             timer: 2000,
                             showConfirmButton: false
                         });
                     }
                 });
             }
         });
     };

    //---------------------------------------------------------------
    // ADD AUCTION
    //---------------------------------------------------------------
    // function that adds days to date object
    function addDays(theDate, days) {
        return new Date(theDate.getTime() + days*24*60*60*1000);
    }
    
    $scope.auctionItem = {
        name: null,
        description: null,
        item: 2,
        startdate: new Date(),
        enddate: addDays(new Date(), 7),
        startingprice: null,
        reserveprice: null,
        instantprice: null
    };

    // CREATE AN AUCTION FROM A DRAFT ITEM
    $scope.addAuction = function (auctionForm) {
        if (auctionForm.$valid) {
            console.log($scope.auctionItem);

            var request = $http({
                method: "post",
                url: "/scripts/php/addauction.php",
                data: {
                    auctioneerid: $cookies.get('userID'),
                    itemid: $scope.auctionItem.item,
                    auctionname: $scope.auctionItem.name,
                    description: $scope.auctionItem.description,
                    startingprice: $scope.auctionItem.startingprice,
                    reserveprice: $scope.auctionItem.reserveprice,
                    instantprice: $scope.auctionItem.instantprice,
                    startdate: $scope.auctionItem.startdate,
                    enddate: $scope.auctionItem.enddate
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

            // Successful HTTP post request or not
            request.success(function (data) {
                console.log("Response: ", data);
                if (data == 1) {
                    $state.go('seller.onsale', {}, { reload: true });
                    toaster.pop({
                        type: 'success',
                        title: 'Auction added',
                        body: 'Your auction has been added successfully!',
                        showCloseButton: false,
                        timeout: 2500
                    });
                }
                else {
                    toaster.pop({
                        type: 'error',
                        title: 'Error',
                        body: 'Something went wrong.',
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
                body: 'Please fill out all fields before proceeding!',
                showCloseButton: false,
                timeout: 2000
            });

        }

    };

   $scope.getCategoryName = function (categoryID) {
       return $rootScope.rootData.hashedCategories[categoryID].name;
   }

   $scope.getConditionName = function (conditionID) {
       return $rootScope.rootData.hashedConditions[conditionID].name;
   }

})

.controller('editItemCtrl', function ($rootScope, $scope, $http, $state, $cookies,
                                   $timeout, toaster, $stateParams) {

    // ----------------------------------------------------------------------------
    //EDIT ITEM
    //EDIT ITEM VARIABLES
    $scope.editItemSlideInterval =  2000;
    $scope.editItemImagesSaved = false;
    $scope.editItemImageStrings = [];
    $scope.editItemUpdatedImageStrings = [];
    $scope.editItem = {};

    //EDIT ITEM METHODS
    //Set the current item values
    if ($stateParams.itemid) {
        console.log("ITEM ID TO EDIT: ",$stateParams.itemid);
        var reqItem = $http({
            method: "post",
            url: "/scripts/php/selectRowsGeneric.php",
            data: {
                table: 'item',
                where: 'WHERE itemID='+$stateParams.itemid
            },
            headers: { 'Content-Type': 'application/json' }
        });

        reqItem.success(function (data) {
            if (data) {
                console.log("Item returned", data);
                var currentItem = $scope.editItem.itemcategory = $scope.editItem.itemcondition = data[0];
                $scope.editItem.itemname = currentItem.name;
                $scope.editItem.itemdescription = currentItem.description;
            }
        });

        //GET IMAGES FOR THE ITEM
        var getImages = $http({
            method: "post",
            url: "/scripts/php/selectRowsGeneric.php",
            data: {
                table: 'image',
                where: 'WHERE itemID='+$stateParams.itemid
            },
            headers: { 'Content-Type': 'application/json' }
        });

        getImages.success(function (data) {
            if (data) {
                console.log("Images returned", data);
                $scope.imageObject = data;
                data.forEach(function (image) {
                    $scope.editItemImageStrings.push(image.image);
                });
                console.log($scope.editItemImageStrings);
            }
        });

        $scope.deleteImage = function (idx) {
            $scope.editimageStrings.splice(idx, 1);
        };

        //PROCESS IMAGE UPLOADINGS
        $scope.editItemProcessFiles = function(files){
            angular.forEach(files, function(flowFile, i){
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    var uri = event.target.result;
                    $scope.editItemImageStrings.push(uri);
                };
                fileReader.readAsDataURL(flowFile.file);
            });

        };

        //EDIT ITEM
        $scope.editItem = function () {
            console.log("Inside edit item method...");
            console.log($scope.editItem.itemcondition.conditionID);
            var request = $http({
                method: "post",
                url: "/scripts/php/editRowsBySQL.php",
                data: {
                    sql: "UPDATE item SET name='"
                    +$scope.editItem.itemname+"',description='"+$scope.editItem.itemdescription+"',categoryID='"
                    +$scope.editItem.itemcategory.categoryID+"', conditionID='"+$scope.editItem.itemcondition.conditionID
                    +"' WHERE itemID='"+$stateParams.itemid+"'"
                },
                headers: { 'Content-Type': 'application/json' }
            });
            /* Successful HTTP post request or not */
            request.success(function (data) {
                if(data==1) {
                    //ITEM EDITED SUCCESSFULLY
                    //remove all old images from database
                    var deleteImages = $http({
                        method: "post",
                        url: "/scripts/php/editRowsBySQL.php",
                        data: {
                            sql: "DELETE FROM image WHERE itemID="+$stateParams.itemid+"",
                        },
                        headers: {'Content-Type': 'application/json'}
                    });
                    deleteImages.success(function (data) {
                        console.log("Image deletion response....", data);
                        if (data==1) {
                            console.log("Images sucessfully deleted!");
                            //Now add the new images
                            var insertImages = $http({
                                method: "post",
                                url: "/scripts/php/addImages.php",
                                data: {
                                    itemID: $stateParams.itemid,
                                    images: $scope.editItemImageStrings
                                },
                                headers: {'Content-Type': 'application/json'}
                            });
                            insertImages.success(function (data) {
                                console.log("Image insertion response from database", data);
                                if (data == 1) {
                                    $state.go('seller.draft', {}, { reload: true });
                                }
                            });
                        }
                    });
                }
                else {
                    $scope.responseMessage = "Couldn't write to DB!";
                }
            });
        };
    }

});
