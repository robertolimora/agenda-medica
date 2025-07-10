<?php
header('Content-Type: application/json');
require 'db_connect.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST;
}
if (isset($data['id']) && !empty($data['id'])) {
    $stmt = $pdo->prepare("UPDATE eventos SET title = :title, start = :start, end = :end WHERE id = :id");
    $stmt->execute([
        ':title' => $data['title'],
        ':start' => $data['start'],
        ':end'   => $data['end']
    ]);
    echo json_encode(['success' => true]);
} else {
    $stmt = $pdo->prepare("INSERT INTO eventos (title, start, end) VALUES (:title, :start, :end)");
    $stmt->execute([
        ':title' => $data['title'],
        ':start' => $data['start'],
        ':end'   => $data['end']
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
}
?>