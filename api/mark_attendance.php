<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$conn = new mysqli('localhost', 'root', '', 'ffhnas_db');
$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare("
    INSERT INTO attendance (student_id, section, date, status)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status)
");
$stmt->bind_param('isss', $data['student_id'], $data['section'], $data['date'], $data['status']);
echo json_encode(['success' => $stmt->execute()]);