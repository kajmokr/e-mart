/********************************************************************************************************************
 * DATA SERVICE
 ********************************************************************************************************************/
emart.service('dataService', function ($http, $cookies, $state, toaster, $timeout, emailService) {
    
    //--------------------------------------------------------------------
    // SELLER / BUYER DATA SERVICES
    //--------------------------------------------------------------------
    this.getSellerSoldItems = function (userID) {
        var soldItems = null;
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBysql.php",
            data: {
                sql: "SELECT auction.auctionID, auction.name, auction.description, auction.currentBidID, item.itemID, item.name, "+
                "item.buyerID, item.isSold, bid.bidID, bid.bidPrice, user.userID, user.firstName, user.userName, user.emailAddress "+
                "FROM auction, item, bid, user "+
                "WHERE item.ownerID="+userID+
                " AND item.isSold=1 AND auction.itemID = item.itemID AND item.buyerID=user.userID"+
                " AND auction.currentBidID=bid.bidID GROUP BY auction.auctionID;"
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response!==0) { //if no error when fetching database rows
                return response.data;
            }
            else {
                console.log("Error response from database");
            }
        });
    };

    //GET ITEMS ON SALE FOR THE SELLER
    this.getSellerAuctions = function (auctioneerID) {
        var auctions = null;
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBysql.php",
            data: {
                sql: "SELECT auction.auctionID, auction.name, auction.description, auction.auctioneerID, "+
                "auction.startDate, auction.endDate, auction.startingPrice, auction.instantPrice, auction.reservePrice, item.itemID, item.name, auction.isActive, auction.numViews FROM auction, item "+
                "WHERE auctioneerID="+ auctioneerID +
                " AND auction.isActive=1 AND auction.itemID= item.itemID GROUP BY auction.auctionID;"
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            // console.log("GOT SELLER AUCTIONS", response);
            if (response!==0) { //if no error when fetching database rows
                auctions = response.data;
                return auctions;
            }
            else {
                console.log("Error response from database");
            }
        });
    };

    this.getDraftItems = function (userID) {
        var auctions = null;
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBysql.php",
            data: {
                sql:  "SELECT i.* FROM item i LEFT JOIN auction a ON i.itemID = a.itemID AND a.isActive=1 "
                +"WHERE a.itemID IS NULL AND i.ownerID="+userID+" AND i.isSold=0 ;"
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            // console.log("GOT SELLER DRAFTS", response.data);
            if (response!==0) { //if no error when fetching database rows
                auctions = response.data;
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
                sql:'SELECT rating.description, rating.starRating, rating.created, user.userName, user.userID, user.twProfileImage FROM rating INNER JOIN user ON rating.userID = '+userID+' AND rating.raterID=user.userID'
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
        return deleteItem = $http({
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
                data.hashedCategories = this.hashedCategories;
                data.hashedConditions = this.hashedConditions;

                //console.log(dataServiceScope.hashedConditions, dataServiceScope.hashedCategories);
                return data;
            }
            else {
                console.log("Error loading drop down menu conditions and categories from database");
            }
        });
    };
    
    //GET ALL LIVE AUCTIONS BY CATEGORY
    this.getAllLiveAuctions = function (categoryID) {
        var auctions = null;
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBySql.php",
            data: {
                sql: "SELECT auction.auctionID, item.itemID, auction.name, auction.description, auction.instantPrice, "+
                "auction.isActive, auction.endDate, auction.currentBidID, bid.bidID, bid.bidderID, image.imageID, "+
                "image.image, image.itemID, item.categoryID, item.conditionID, "+
                "IFNULL((select max(bid.bidPrice) from bid WHERE bid.auctionID=auction.auctionID), auction.startingPrice) "+
                "as auctionPrice "+
                "FROM auction,item,bid,image "+
                "WHERE auction.startDate < now() AND auction.endDate > now() AND auction.itemID = item.itemID AND item.categoryID="+categoryID+" AND auction.isActive=1 "+
                "AND image.itemID=auction.itemID "+
                "GROUP BY auction.auctionID;"
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            // console.log("GOT LIVE AUCTIONS", response);
            if (response!==0) { //if no error when fetching database rows
                auctions = response.data;
                return auctions;
            }
            else {
                console.log("Error response from database");
            }
        });
    };

    //GET AUCTIONS ENDINGSOON
    this.getAuctionsEndingSoon = function () {
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBySql.php",
            data: {
                sql: "SELECT auction.auctionID, item.itemID, auction.name, auction.description, auction.instantPrice, "+
                "auction.isActive, auction.endDate, auction.currentBidID, bid.bidID, bid.bidderID, image.imageID, "+
                "image.image, image.itemID, item.categoryID, item.conditionID, "+
                "IFNULL((select max(bid.bidPrice) from bid WHERE bid.auctionID=auction.auctionID),auction.startingPrice) "+
                "as auctionPrice "+
                "FROM auction,item,bid,image "+
                "WHERE auction.startDate < now() AND auction.endDate > now() AND auction.itemID = item.itemID AND auction.isActive=1 "+
                "AND image.itemID=auction.itemID "+
                "GROUP BY auction.auctionID "+
                "ORDER BY auction.endDate" +
                ";"
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            // console.log("GOT ENDING SOON AUCTIONS", response);
            if (response!==0) { //if no error when fetching database rows
                return response.data;
            }
            else {
                console.log("Error response from database");
            }
        });
    };

    this.getSingleAuction = function (auctionID) {
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBySql.php",
            data: {
                sql:"SELECT auction.auctionID, item.itemID, auction.name, auction.description, auction.instantPrice, "+
                "auction.isActive, auction.endDate, auction.currentBidID, IFNULL(bid.bidID,0), IFNULL(bid.bidderID,0), image.imageID, "+
                "image.image, image.itemID, user.userID, user.firstName, user.userName, user.emailAddress, auction.startDate, "+
                "IFNULL((select max(bid.bidPrice) from bid WHERE bid.auctionID=auction.auctionID),auction.startingPrice) "+
                "as auctionPrice "+
                "FROM auction,item,bid,image,user "+
                "WHERE auction.auctionID="+auctionID+" AND auction.itemID = item.itemID "+
                "AND image.itemID=auction.itemID AND auction.auctioneerID=user.userID "+
                "GROUP BY auction.auctionID;"
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response!==0) { //if no error when fetching database rows
                return response.data[0];
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
    };
    
    this.searchAuctions = function (searchTerm) {
        var searchResults = {};
        return request = $http({
            method: "post",
            url: "/scripts/php/selectRowBysql.php",
            data: {
                sql: "SELECT auction.auctionID, auction.name, auction.description, auction.startingPrice, " +
                "bid.bidPrice, bid.auctionID, " +
                "IFNULL((select max(bid.bidPrice) from bid WHERE bid.auctionID=auction.auctionID), " +
                "auction.startingPrice) as auctionPrice " +
                "FROM auction,bid WHERE (name LIKE '%" + searchTerm + "%' " +
                " OR description LIKE '%" + searchTerm + "%') GROUP BY auction.auctionID"
            },
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            if (response !== 0) { //if no error when fetching database rows
                searchResults = response;
                return searchResults;
            }
            else {
                console.log("Error response from database");
            }
        });

    };
    
    //START EMAILING SERVICE
    this.mailingService = function () {
        return request = $http({
            method: "post",
            url: "/scripts/php/auctionCtrl.php",
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            // console.log(response);
            if (response !== 0) { //if no error when fetching database rows
                console.log(response, "Mailing service started");
            }
            else {
                console.log("Error");
            }
        });
    };

        
        
});