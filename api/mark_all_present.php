<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$conn = new mysqli('localhost', 'root', '', 'school_db');
$data = json_decode(file_get_contents('php://input'), true);

$students = $conn->query("SELECT id FROM students WHERE section = '{$data['section']}'");
$success = true;
while ($s = $students->fetch_assoc()) {
    $stmt = $conn->prepare("
        INSERT INTO attendance (student_id, section, date, status)
        VALUES (?, ?, ?, 'Present')
        ON DUPLICATE KEY UPDATE status = 'Present'
    ");
    $stmt->bind_param('iss', $s['id'], $data['section'], $data['date']);
    if (!$stmt->execute()) $success = false;
}
echo json_encode(['success' => $success]);