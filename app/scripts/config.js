/************************************************************************
 * Emart uses AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 ************************************************************************/

emart.config(function ($stateProvider, $urlRouterProvider){

    //Flow factory for file uploads

    // flowFactoryProvider.defaults = {
    //     target: 'php/upload.php',
    //     permanentErrors: [404, 500, 501],
    //     maxChunkRetries: 1,
    //     chunkRetryInterval: 5000,
    //     simultaneousUploads: 4
    // };
    // flowFactoryProvider.on('catchAll', function (event) {
    //     console.log('catchAll', arguments);
    // });

    $urlRouterProvider.otherwise("/login");

    $stateProvider

        //-----------------------------------------------------
        // ROOT
        //-----------------------------------------------------
        .state ('root', {
            abstract: true,
            templateUrl: 'views/common/content.html'
        })

        //-----------------------------------------------------
        // AUTHENTICATION - LOGIN | REGISTER | FORGOT PASSWORD
        //-----------------------------------------------------
        .state('login', {
            url: "/login",
            controller: "authCtrl",
            templateUrl: "views/authentication/login.html",
            data: { pageTitle: 'Login', specialClass: 'gray-bg' }
        })
        .state('register', {
            abstract: true,
            controller: "authCtrl",
            templateUrl: "views/authentication/register.html",
            data: { pageTitle: 'Register', specialClass: 'gray-bg' }
        })
        .state('register1', {
            parent: 'register',
            url: '/register',
            templateUrl: 'views/authentication/register1.html'
        })
        .state('register2', {
            parent: 'register',
            url: '/register2',
            templateUrl: 'views/authentication/register2.html'
        })
        .state('register3', {
            parent: 'register',
            url: '/register3',
            templateUrl: 'views/authentication/register3.html'
        })
        .state('forgot_password', {
            url: "/forgot_password",
            controller: "authCtrl",
            templateUrl: "views/authentication/forgot_password.html",
            data: { pageTitle: 'Forgot password', specialClass: 'gray-bg' }
        })

        //-----------------------------------------------------
        // PROFILE
        //-----------------------------------------------------
        .state ('profile', {
            parent: 'root',
            url: '/profile',
            controller: 'profileCtrl',
            templateUrl: 'views/profile/profile.html',
            params: { userID: null },
            resolve: { authenticate: authenticate },
            data: { name: 'My Profile', mainState: 'profile', hide: true, pageTitle: 'E-Mart: My Profile' }
        })

        //-----------------------------------------------------
        // BUYER DASHBOARD
        //-----------------------------------------------------
        .state('buyer', {
            templateUrl: "views/common/content.html",
            resolve: { authenticate: authenticate },
            data: { mainState: 'buyer.bids', mainStateName: 'My Bids', name: 'Buyer Dashboard' }
        })
        .state('buyer.mybids', {
            url: "/bybids",
            templateUrl: "views/buyer/mybids.html",
            data: { pageTitle: 'Buyer Dashboard | My Bids' }
        })
        .state('buyer.boughtItems', {
            url: "/bought-items",
            templateUrl: "views/buyer/boughtItems.html",
            data: { pageTitle: 'Buyer Dashboard | Bought Items', subStateName: "Bought Items" }
        })
        .state('buyer.bookmarks', {
            url: "/bookmarks",
            templateUrl: "views/buyer/bookmarks.html",
            data: { pageTitle: 'Buyer Dashboard | Bookmarks', subStateName: "Bookmarks" }
        })
        .state('buyer.createbid', {
            parent: "root",
            url:"/createbid?:id&{other}",
            param: { id: null, other: null },
            data: { pageTitle: "Create Bid" }
        })

        //-----------------------------------------------------
        // SELLER DASHBOARD
        //-----------------------------------------------------
        .state('seller', {
            templateUrl: "views/common/content.html",
            controller: "sellerCtrl",
            resolve: { authenticate: authenticate },
            data: { mainState: 'seller.onsale', mainStateName: 'On Sale', name: 'Seller Dashboard', toggleView: false }
        })
        .state('seller.additem', {
            url:"/additem",
            templateUrl: "views/seller/additem.html",
            data: { pageTitle: 'Seller Dashboard | Add Item', subStateName: 'Add Item', toggleView: false }
        })
        .state('seller.draft', {
            url: "/seller-draft",
            templateUrl: "views/seller/seller_draft.html",
            data: { pageTitle: 'Seller Dashboard | Items Drafted', subStateName: 'Items Drafted' }
        })
        .state('seller.onsale', {
            url: "/seller-onsale",
            templateUrl: "views/seller/seller_onsale.html",
            data: { pageTitle: 'Seller Dashboard | Items On Sale', subStateName: 'Items On Sale' }
        })
        .state('seller.sold', {
            url: "/seller-sold",
            templateUrl: "views/seller/seller_sold.html",
            data: { pageTitle: 'Seller Dashboard | Items Sold', subStateName: 'Items Sold' }
        })
        .state('seller.edititem', {
            url:"/edititem?:itemid",
            controller: "editItemCtrl",
            templateUrl: function (param){
                return "views/seller/edititem.html?itemid="+param.id;
            },
            data: { pageTitle: 'Seller Dashboard | Edit Item', subStateName: 'Edit Item' }
        })
        .state('seller.addauction', {
            url:"/addauction",
            templateUrl: "views/seller/addauction.html",
            data: {pageTitle: "Seller Dashboard | Create Auction"}
        })
            
        //-----------------------------------------------------
        // E-COMMERCE
        //-----------------------------------------------------
        .state('ecommerce', {
            templateUrl: "views/common/content.html",
            controller: "ecommerceCtrl",
            params: { categoryid: null , itemid: null, auctionid: null, bidid: null, other: null},
            resolve: { authenticate: authenticate },
            data: { mainState: 'ecommerce.grid', mainStateName: 'Browsing', name: 'Browsing Auctions', toggleView: true }
        })
        .state('ecommerce.grid', {
            url:"/ecommerce",
            templateUrl: "views/ecommerce/products_grid.html",
            data: { pageTitle: 'Browsing Auctions | By Category', subStateName: 'By Category' }
        })
        .state('ecommerce.list', {
            url: "/ecommerce-list",
            templateUrl: "views/ecommerce/ecommerce_product_list.html",
            data: { pageTitle: 'E-commerce | Product List', subStateName: 'Product List' }
        })
        .state('ecommerce.details', {
            url: "/ecommerce-details",
            templateUrl: "views/ecommerce/ecommerce_product_details.html",
            data: { pageTitle: 'Browsing Auctions | Auction Details', subStateName: 'Auction Details' }
        })
        .state('ecommerce.bidhistory', {
            url: "/bidhistory",
            templateUrl: "views/ecommerce/bidhistory.html",
            data: { pageTitle: 'View Bid' }
        })
        .state('ecommerce.endingsoon', {
            url: "/ecommerce-endingsoon",
            templateUrl: "views/buyer/ending_soon.html",
            data: { mainState: 'endingsoon', mainStateName: 'Buyer', name: 'Ending Soon', hide: true, toggleView: false }
        })
            
        //-----------------------------------------------------
        // HELP & OTHERS & VIDEO
        //-----------------------------------------------------
        .state('faq', {
            parent: "root",
            url: "/faq",
            templateUrl: "views/other/faq.html",
            resolve: { authenticate: authenticate },
            data: { pageTitle: 'FAQ', name: 'Help', mainStateName: 'Frequently Asked Questions' }
        })
        .state('contact', {
            parent: "root",
            url: "/contact",
            templateUrl: "views/other/contactUs.html",
            resolve: { authenticate: authenticate },
            data: { pageTitle: 'Contact us', name: 'Help', mainStateName: 'Contact us' }
        })
        .state('tos', {
            parent: "root",
            url: "/tos",
            templateUrl: "views/other/tos.html",
            resolve: { authenticate: authenticate },
            data: { pageTitle: 'Terms & Conditions', name: 'Help', mainStateName: 'Terms & Conditions' }
        })
        .state('search', {
            parent: "root",
            url:"/search",
            templateUrl: "views/other/search.html",
            resolve: { authenticate: authenticate },
            data: { pageTitle: 'Search Results', name: 'Search Results', hide: true }
        })
        .state('video', {
            parent: "root",
            url: "/video",
            templateUrl: "views/other/video.html",
            resolve: { authenticate: authenticate },
            data: { pageTitle: 'Video', name: 'Video', hide: true }
        });
    
        //-----------------------------------------------------
        // ONLY ALLOW LOGGED IN USERS TO ACCESS APP ROUTES
        //-----------------------------------------------------
        // source: http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
        function authenticate($q, $cookies, $state, $timeout, toaster, $rootScope) {
            if ($cookies.get('loggedIn')) {

                // get logged in user from cookies
                $rootScope.user = JSON.parse($cookies.get('user'));
                // Resolve the promise successfully
                return $q.when()
            } else {
                // The next bit of code is asynchronously tricky.
                $timeout(function() {
                    // This code runs after the authentication promise has been rejected.
                    // Go to the log-in page
                    toaster.pop({
                        type: 'error',
                        title: 'Error',
                        body: 'Login is required to access that page.',
                        showCloseButton: false,
                        timeout: 2000
                    });
                    $state.go('login')
                });

                // Reject the authentication promise to prevent the state from loading
                return $q.reject()
            }
        }
    
});
