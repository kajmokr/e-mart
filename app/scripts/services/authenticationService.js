/********************************************************************************************************************
 * AUTHENTICATION SERVICE
 ********************************************************************************************************************/
emart.service('authenticationService', function ($http, $cookies, $state, toaster, $timeout, emailService) {
    
    // USER AUTHENTICATION VARIABLES
    var loggedIn = false;
    var user = null;

    // LOGIN USER
    this.login = function (email, password) {
        var request = $http({
            method: "post",
            url: "/scripts/php/login.php",
            data: {
                email: email,
                password: password
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        request.success(function (data) {

            // login was successful
            if (typeof data.userID != 'undefined') {

                // save login state in loggedIn variable
                loggedIn = true;

                // save user data
                user = data;
                
                // storing user data in cookies
                $cookies.put('user', JSON.stringify(user));
                
                $cookies.put('userID', user.userID);
                $cookies.put('userName', user.userName);
                $cookies.put('twUsername', user.twUsername);
                $cookies.put('twProfileImage', user.twProfileImage);
                $cookies.put('firstName', user.firstName);
                $cookies.put('lastName', user.lastName);
                $cookies.put('userType', user.userType);
                $cookies.put('dateRegistered', user.dateRegistered);
                $cookies.put('city', user.city);
                $cookies.put('loggedIn', true);

                // go to new state
                $state.go('profile');

                // display success message
                toaster.pop({
                    type: 'success',
                    title: 'Welcome',
                    body: 'Happy Shopping :)',
                    showCloseButton: true,
                    timeout: 2500
                });
            }
            // login was unsuccessful
            else {
                loggedIn = false;
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'Failed to login :(',
                    showCloseButton: true,
                    timeout: 2500
                });
            }
        });
    };

    // REGISTER NEW USER
    this.registerUser = function (user) {
        var request = $http({
            method: "post",
            url: "/scripts/php/register.php",
            data: user,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        request.success(function (data) {
            if(data == true){
                $state.go('login');
                toaster.pop({
                    type: 'success',
                    title: 'Success',
                    body: 'You have successfully registered your account. You may login now.',
                    showCloseButton: false,
                    timeout: 3000
                });
                emailService.sendEmail(user.email, "Hi " + user.firstname + " and welcome to E-Mart! You have successfully registered your account :)", "New E-Mart Account");
            }
            else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'Failed to register user.',
                    showCloseButton: false,
                    timeout: 2000
                });
            }
        });
    };

    // LOGOUT USER
    this.logout = function () {
        $timeout(function() {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
            loggedIn = false;
        });
        $state.go('login');
        toaster.pop({
            type: 'success',
            title: 'Success',
            body: 'Logout successful! See you soon :)',
            showCloseButton: false,
            timeout: 3000
        });
    };

    // CHECK LOGIN STATUS
    this.isLoggedIn = function() {
        return loggedIn;
    };

    // GET USER DATA
    this.getUser = function () {
        return user;
    }
});