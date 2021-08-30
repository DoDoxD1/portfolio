<?php

$server = 'localhost';
$username = 'root';
$password = '';
$database = 'contact';

$conn = mysqli_connect($server, $username, $password, $database);
if(!$conn){
    die("Error ". mysqli_connect_error());
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = $_POST["name"];
    $email = $_POST["email"];
    $project = $_POST["project"];
    if(isset($_POST["msg"])){
        $msg = $_POST["msg"];
    }
    else{
        $msg = null;
    }
    

    // $sql = "INSERT INTO `formtb` (`name`, `age`, `mobile`, `city`, `state`, `pin`, `education`, `mar_status`, `id`) VALUES 
    // ('$name', '$age', '$mobileNo', '$city', '$state', '$pincode', '$education', '$martialStatus', null)";

$sql = "INSERT INTO `contact`(`name`, `email`, `project`, `msg`) VALUES ('$name','$email','$project','$msg')";
$result = mysqli_query($conn, $sql);
    if($result){
        echo"<script>alert('Hola! Your record is submitted. You will be redirected now.');window.location = '/portfolio/index.html';</script>";
        
    }else{
        echo"<script>alert('Oh! An error occured! Your record not submitted');window.location = '/portfolio/index.html';</script>";
    }
    
    // header("location:  \portfolio/index.html");
}
?>