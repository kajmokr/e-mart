<?php
require_once("dbConnection.php");
ob_start();
dbConnect();


// STORES INPUT IN DATABASE IF SUBMIT BUTTON PRESSED
if(isset($_POST)) {

    // STORE POSTED VALUES IN VARIABLES
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $username = $request->username;
    $firstname = ucfirst($request->firstname);
    $lastname = ucfirst($request->lastname);
    $email = $request->email;
    $username = $request->username;
    $password = $request->password;
    $address = $request->address;
    $city = $request->city;
    $postalcode = $request->postalcode;
    $country = $request->country;
    $telephoneNumber = $request->telephoneNumber;
    $usertype = $request->usertype;
    $twUsername = $request->twUsername;
    $twProfileImage = $request->twProfileImage;

    // PROTECT AGAINST MYSQL INJECTION
    $firstname = mysqli_real_escape_string($connection, stripslashes($firstname));
    $lastname = mysqli_real_escape_string($connection, stripslashes($lastname));
    $email = mysqli_real_escape_string($connection, stripslashes($email));
    $username = mysqli_real_escape_string($connection, stripslashes($username));
    $password = mysqli_real_escape_string($connection, stripslashes($password));
    $address = mysqli_real_escape_string($connection, stripslashes($address));
    $city = mysqli_real_escape_string($connection, stripslashes($city));
    $postalcode = mysqli_real_escape_string($connection, stripslashes($postalcode));
    $country = mysqli_real_escape_string($connection, stripslashes($country));
    $telephoneNumber = mysqli_real_escape_string($connection, stripslashes($telephoneNumber));
    $usertype = stripslashes($usertype);
    $twUsername = stripslashes($twUsername);
    $twProfileImage = stripslashes($twProfileImage);

    // hashes the password using the bcrypt algorithm (default as of PHP 5.5.0)
    $password = password_hash($password, PASSWORD_DEFAULT);


    $sql = "INSERT INTO user (userName, firstName, lastName, emailAddress, password, address, city, postalCode, country, telephoneNumber, userType, dateRegistered, twUsername, twProfileImage)
                VALUES ('$username', '$firstname', '$lastname', '$email', '$password', '$address', '$city', '$postalcode', '$country', '$telephoneNumber', '$usertype', CURRENT_TIMESTAMP, '$twUsername', '$twProfileImage')";

    if ($connection->query($sql) == TRUE ){
        echo true;
    }
    else{
        // logs errors to console
        error_log("error" . $sql . $connection->error);
        echo false;
    }

}

dbClose();
ob_end_flush();
?>