<?php
header('Content-Type: application/json');
require 'db_connect.php';
$stmt = $pdo->query("SELECT id, title, start, end FROM eventos");
$events = $stmt->fetchAll();
echo json_encode($events);
?>