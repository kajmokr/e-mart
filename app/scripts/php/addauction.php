<?php

require_once("dbConnection.php");
ob_start();

if(!empty($_POST)) {
    dbConnect();
    // STORE POSTED VALUES IN VARIABLES

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $auctioneerid = stripslashes($request->auctioneerid);
    $itemid = stripslashes($request -> itemid);
    $auctionname = mysqli_real_escape_string($connection, stripslashes($request -> auctionname));
    $description = mysqli_real_escape_string($connection, stripslashes($request -> description));
    $startingprice = stripslashes($request -> startingprice);
    $instantprice = stripslashes($request -> instantprice);
    $reserveprice = stripslashes($request -> reserveprice);
    $isactive = true;
    $startdate = $request -> startdate;
    $enddate = $request -> enddate;
    $startdate = date("Y-m-d H:i:s",strtotime($startdate));
    $enddate = date("Y-m-d H:i:s",strtotime($enddate));
    // DATABASE QUERY
    $sql = "INSERT INTO auction (auctioneerID, itemID, name, description, startingPrice, instantPrice, reservePrice, isActive, startDate, endDate, numViews)
            VALUES ('$auctioneerid', '$itemid', '$auctionname', '$description', '$startingprice', '$instantprice', '$reserveprice', '$isactive', '$startdate', '$enddate', 0)";

    if ($connection->query($sql) == TRUE ){
        echo true;
    }
    else{
        // logs errors to console
        error_log("Error adding auction: " . $sql . $connection->error);
        echo false;
    }
}

else {
    echo "Post is empty";
}

dbClose();
ob_end_flush();
?>