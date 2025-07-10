<?php
header('Content-Type: application/json');
require 'db_connect.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST;
}
if (isset($data['id'])) {
    $stmt = $pdo->prepare("DELETE FROM eventos WHERE id = :id");
    $stmt->execute([':id' => $data['id']]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'ID não informado']);
}
?>