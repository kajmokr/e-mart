/********************************************************************************************************************
 * EMAIL SERVICE
 ********************************************************************************************************************/
emart.service('emailService', function ($http, $cookies, $state, toaster) {
    
    // SENDS FORGOT PASSWORD MAIL
    this.forgotPassword = function(email) {
        var request = $http({
            method: "post",
            url: "/scripts/php/sendEmail.php",
            data: {
                email: email,
                emailtype: "forgotPassword"
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        /* Successful HTTP post request or not */
        request.success(function (data) {
            
            // email has been sent successfully
            if(data == true){
                $state.go('login');
                toaster.pop({
                    type: 'success',
                    title: 'Success',
                    body: 'We have sent you an email with a link to reset your password :)',
                    showCloseButton: false,
                    timeout: 2500
                });
            }
            // email has NOT been sent successfully
            else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'Password reset failed :(',
                    showCloseButton: false,
                    timeout: 2500
                });
            }
        });
    };

    // SEND MAIL GENERIC TEMPLATE
    this.sendEmail = function(email, body, title) {
        var request = $http({
            method: "post",
            url: "/scripts/php/sendEmail.php",
            data: {
                email: email,
                body: body,
                title: title,
                emailtype: "standard"
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        /* Successful HTTP post request or not */
        request.success(function (data) {

            // email has been sent successfully
            if(data == true){
                console.log("sent");
            }
            // email has NOT been sent successfully
            else {
                console.log("not sent");
            }
        });
    };
    
});