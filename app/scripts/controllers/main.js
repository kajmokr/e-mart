/**
 * MainCtrl - controller
 */

emart.controller('MainCtrl', function ($scope, $http, $state) {

    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';
    var now = new Date();
    (function () {
        return request = $http({
            method: "post",
            url: "/scripts/php/dateCtrl.php",
            data: {
                userID: $cookies.userID
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response!==0) { //if no error when fetching database rows
                console.log(response);
            }
            else {
                console.log("Error loading drop down menu conditions and categories from database");
            }
        });
    })();




});