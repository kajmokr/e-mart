<?php
require_once("dbConnection.php");
ob_start();
dbConnect();

// STORES INPUT IN DATABASE IF SUBMIT BUTTON PRESSED
if(isset($_POST)) {

    // STORE POSTED VALUES IN VARIABLES
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $stars = $request->stars;
    $description = mysqli_real_escape_string($connection, stripslashes($request->description));
    $userID = $request->userID;
    $raterID = $request->raterID;
    $auctionID = $request->auctionID;

    $sql = "INSERT INTO rating (starRating, description, userID, auctionID, raterID, created)
                VALUES ('$stars', '$description', '$userID', '$auctionID', '$raterID', CURRENT_TIMESTAMP)";

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