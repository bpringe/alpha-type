<?php
/*
$hostname = "localhost";
$username = "root";
$password = "c4ntst0p";
$dbname = "alphatype";
*/

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
$sql = "SELECT name, score FROM score ORDER BY score DESC";
$result = $conn->query($sql);
  
// Add the result rows to an array
$rows = array();
while ($singleRow = mysqli_fetch_assoc($result)) {
  $rows[] = $singleRow;
}

if (!(isset($_POST["score"])) and !(isset($_POST["playerName"]))) {
	// Return the array of rows as JSON
  header("content-type:application/json");
	echo json_encode($rows);
	$conn->close();
	exit();
}

/* If score is set and playerName is not, game has just ended
	and we need to check if score is greater than any high scores */
if ((isset($_POST["score"])) and !(isset($_POST["playerName"]))) {
	$currentScore = $_POST["score"];
	$isHighScore = "false";
	foreach ($rows as $score) {
		if ($currentScore > $score["score"]) {
			$isHighScore = "true";
		}
	}
	echo $isHighScore;
	$conn->close();
	exit();
}

// If score and playerName are both set, add new high score to db
// To-do: Add security here to protect against SQL injects
if ((isset($_POST["score"])) and (isset($_POST["playerName"]))) {
  // Find lowest score and delete record in db
  $min = 6000;
  foreach ($rows as $score) {
    if ($score["score"] < $min) {
      $min = $score["score"];
    }
  }
  $sql = "DELETE FROM score WHERE score=" . $min . " LIMIT 1";
  if ($conn->query($sql) === true) {
    echo $sql . "\nRecord deleted successfully\n";
  } else {
    echo "Error: " . $sql . "\n" . $conn->error;
  }
	$sql = "INSERT INTO score(name, score) VALUES ('" . $_POST["playerName"] . 
		"'," . $_POST["score"] . ")";
	if ($conn->query($sql) === true) {
		echo $sql . "\nNew record created successfully";
	} else {
		echo "Error: " . $sql . "\n" . $conn->error;
  }
	$conn->close();
	exit();
}

$conn->close();
exit();
?>