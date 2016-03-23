<?php
require_once("dbConnection.php");
ob_start();

if(isset($_POST)) {
    dbConnect();

    // STORE POSTED VALUES IN VARIABLES
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    
    // PROTECT AGAINST MYSQL INJECTION
    $email = stripslashes($request->email);
    $password = stripslashes($request->password);

    // DATABASE QUERY
    $sql = 'SELECT * FROM user WHERE emailAddress="' . $email . '"';
    
    if ( $result = $connection->query($sql) ){

        // VALIDATION: ONLY IF ONE ROW RETURNED
        if ($result->num_rows == 1) {

            $data = mysqli_fetch_array($result);

            if ( password_verify($password, $data['password']) ){
                echo json_encode($data);
            }
            else {
                error_log("error1 " . $connection->error);
                echo false;
            }
        }
        else {
            error_log("error2 " . $connection->error);
            echo false;
        }
    }
    else {
        error_log("error3 " . $connection->error);
        echo false;
    }
    dbClose();

}

ob_end_flush();
?>