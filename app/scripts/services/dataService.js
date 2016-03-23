/********************************************************************************************************************
 * DATA SERVICE
 ********************************************************************************************************************/
emart.service('dataService', function ($http, $cookies, $state, toaster, $timeout, emailService) {
    
    //--------------------------------------------------------------------
    // SELLER / BUYER DATA SERVICES
    //--------------------------------------------------------------------
    // TODO: RETURN IMAGE IN QUERY AS WELL --> GET SOLD NOT WORKING 100%?
    // GET SOLD ITEMS OF A USER
    this.getSellerSoldItems = function (auctioneerID) {
        var auctions = null;
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBysql.php",
            data: {
                sql: "SELECT auction.auctionID, auction.name, auction.description, auction.auctioneerID, "+
                "auction.startDate, auction.endDate, auction.startingPrice, auction.instantPrice, auction.reservePrice, item.itemID, item.name, auction.isActive FROM auction, item "+
                "WHERE auctioneerID="+ auctioneerID +
                " AND auction.isActive=0 AND auction.itemID= item.itemID GROUP BY auction.auctionID;"
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            console.log("GOT SOLD ITEMS", response);
            if (response!==0) { //if no error when fetching database rows
                auctions = response;
                return auctions;
            }
            else {
                console.log("Error response from database");
            }
        });
    };

    // TODO: RETURN IMAGE IN QUERY AS WELL
    //GET ITEMS ON SALE FOR THE SELLER
    this.getSellerAuctions = function (auctioneerID) {
        var auctions = null;
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBysql.php",
            data: {
                sql: "SELECT auction.auctionID, auction.name, auction.description, auction.auctioneerID, "+
                "auction.startDate, auction.endDate, auction.startingPrice, auction.instantPrice, auction.reservePrice, item.itemID, item.name, auction.isActive FROM auction, item "+
                "WHERE auctioneerID="+ auctioneerID +
                " AND auction.isActive=1 AND auction.itemID= item.itemID GROUP BY auction.auctionID;"
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            console.log("GOT SELLER AUCTIONS", response);
            if (response!==0) { //if no error when fetching database rows
                auctions = response;
                return auctions;
            }
            else {
                console.log("Error response from database");
            }
        });
    };
    
    //GET USER RATINGS
    this.getUserRatings = function (userID) {
        var ratings = null;
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBySql.php",
            data: {
                sql:'SELECT rating.description, rating.starRating, rating.created, user.userName, user.twProfileImage FROM rating INNER JOIN user ON rating.userID = '+userID+' AND rating.raterID=user.userID'
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response!==0) { //if no error when fetching database rows
                ratings = response;
                return ratings;
            }
            else {
                console.log("Error response from database");
            }
        });
    };

    // GET USER DATA
    this.getUser = function (userID) {
        var user = null;
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBySql.php",
            data: {
                sql:'SELECT userName, twProfileImage, userType, city, dateRegistered, telephoneNumber, emailAddress, firstname, lastname' +
                ' FROM user WHERE userID='+userID
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response!==0) { //if no error when fetching database rows
                user = response;
                return user;
            }
            else {
                console.log("Error response from database");
            }
        });
    };
    //---------------------------------------------------------------------
    
    
    //---------------------------------------------------------------------
    // ITEM SERVICES
    //---------------------------------------------------------------------
    //Store categories and conditions here
    this.categories = null;
    this.conditions = null;
    //Hashed categories and conditions by ID
    this.hashedCategories = null;
    this.hashedConditions = null;
    
    this.deleteItem = function(itemID) {
        var deleteItem = $http({
            method: 'post',
            url: "/scripts/php/editRowsBySQL.php",
            data: {
                sql: "DELETE FROM item WHERE itemID="+itemID
            }
        }).then(function (response) {
            if (response!==0) { //if no error when fetching database rows
                return true;
            }
            else {
                console.log("Error response from database");
                return false;
            }
        });
    };
    
    //Hashes an array of object by hashfield property, returns a hashed object (table)
    generateHashTable = function (array, hashfield) {
        var hashTable = {};
        array.forEach(function (element, index) {
            var currentHashKey = element[hashfield]+"";
            hashTable[currentHashKey] = element;
        });
        //console.log(hashTable);
        return hashTable;
    };

    //GET THE CONDITION BY ID
    this.getConditionbyID = function (conditionID) {
        if (dataServiceScope.conditions!=null) {
            dataServiceScope.conditions.forEach (function (condition) {
                if (condition.conditionID==conditionID) return condition;
            })
        }
        return null;
    };

    //GET CONDITIONS AND CATEGORIES FROM DATABASE
    this.getData = function() {
        // Angular $http() and then() both return promises themselves
        //Let's pull categories
        var data = {};
        return request = $http({
            method: "post",
            url: "/scripts/php/getAllRows.php",
            data: {
                tables: ["category","itemcondition"]
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response!==0) { //if no error when fetching database rows
                data.categories = response.data.category;
                data.conditions = response.data.itemcondition;
                this.categories = response.data.category;
                this.conditions = response.data.itemcondition;
                //hash  conditions by conditions Id dataServiceScope.conditions, and same for categories
                this.hashedCategories = generateHashTable(this.categories, "categoryID");
                this.hashedConditions = generateHashTable(this.conditions, "conditionID");
                //console.log(dataServiceScope.hashedConditions, dataServiceScope.hashedCategories);
                return data;
            }
            else {
                console.log("Error loading drop down menu conditions and categories from database");
            }
        });
    };
    
    //GET THE CONDITION BY ID
    this.getConditionbyID = function (conditionID) {
        if (dataServiceScope.conditions!=null) {
            dataServiceScope.conditions.forEach (function (condition) {
                if (condition.conditionID==conditionID) return condition;
            })
        }
        return null;
    };
    
    //GET ALL LIVE AUCTIONS
    this.getAllLiveAuctions = function () {
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowsGeneric.php",
            data: {
                table:'auction',
                where:'WHERE isActive=1'
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            console.log("GOT LIVE AUCTIONS", response);
            if (response!==0) { //if no error when fetching database rows
                items = response;
                return items;
            }
            else {
                console.log("Error response from database");
            }
        });
    };
    
    //GET IMAGES FOR AN ITEM
    this.getItemImage = function(itemID) {

        var image = {};
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowsGeneric.php",
            data: {
                tables:'image',
                where: 'WHERE itemID='+itemID
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response!==0) { //if no error when fetching database rows
                return response;
            }
            else {
                console.log("Error response from database");
            }
        });
    };

    //ADD A BOOKMARK
    //function to add bookmark
    this.addBookmark = function (auctionID) {
        return request = $http({
            method: "post",
            url: "/scripts/php/addbookmark.php",
            data: {
                auctionID: auctionID,
                userID: $cookies.get('userID')
            },
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            if (response !== 0) { //if no error when fetching database rows
                toaster.pop({
                    type: 'success',
                    title: 'Bookmark added',
                    body: 'You are now watching this auction!',
                    showCloseButton: true,
                    timeout: 2500
                });
            }
            else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'Error adding bookmark. Try again.',
                    showCloseButton: true,
                    timeout: 2500
                });
            }

        })
    }

    
    
});