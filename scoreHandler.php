<?php
$hostname = "sql312.byethost32.com";
$username = "b32_16555827";
$password = "c4ntst0p";
$dbname = "b32_16555827_alphatype";

// Create connection
$conn = new mysqli($hostname, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Query the DB
$sql = "SELECT name, score FROM score";
$result = $conn->query($sql);

// Add the result rows to an array
$rows = array();
while ($singleRow = mysqli_fetch_assoc($result)) {
	$rows[] = $singleRow;
}

header("content-type:application/json");

// Return the array of rows as JSON
echo json_encode($rows);

// Close the connection
$conn->close();

// Friendly way of terminating script when sole purpose is Ajax calls
exit();
?>