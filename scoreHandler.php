<?php
session_start();

$hostname = "fdb6.awardspace.net";
$username = "1936059_at";
$password = "H@zelAlvis2";
$dbname = "1936059_at";
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
  /* If it is a high score, add a token to the modal to prevent
    anti-forgery */
  $token = md5(uniqid());
  $_SESSION["token"] = $token;
  $responseArray = array("isHighScore" => $isHighScore, 
                         "token" => $token);
	echo json_encode($responseArray);
	$conn->close();
	exit();
}

// If score and playerName are both set, add new high score to db
// To-do: Add security here to protect against SQL injects
if ((isset($_POST["score"])) and (isset($_POST["playerName"]))) {
  echo "\nSession token = ".$_SESSION["token"]."\nPOST token = ".$_POST["token"]."\n";
  // Protect against cross site request forgery - CSRF
  if ($_POST["token"] != $_SESSION["token"]) {
    echo "SESSION and POST tokens not equal\n";
    $conn->close();
    exit();
  }
  // Find lowest score and delete record in db
  $min = 999999999;
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
    $to = "brandon.ringe@gmail.com";
    $subject = "Alpha Type new high score";
    $body = "Name: " . $_POST["playerName"] . "\nScore: " . $_POST["score"];
    $headers = "MIME-Version: 1.0";
    $headers.= "Content-type:text/html;charset=UTF-8";
    $headers.= "From: Brandon <admin@alphatype.mygamesonline.org>";
    
    if(mail($to,$subject,$body,$headers)) echo "MAIL - OK";
    else echo "\nMAIL FAILED";
	} else {
		echo "\nError: " . $sql . "\n" . $conn->error;
  }
	$conn->close();
	exit();
}

$conn->close();
exit();
?>