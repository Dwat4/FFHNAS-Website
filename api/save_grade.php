<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli('localhost', 'root', '', 'school_db');

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$student_id = $data['student_id'] ?? null;
$subject_id = $data['subject_id'] ?? 1;

$quarters = [
    'Q1' => $data['q1'] ?? null,
    'Q2' => $data['q2'] ?? null,
    'Q3' => $data['q3'] ?? null,
    'Q4' => $data['q4'] ?? null
];

$success = true;

foreach ($quarters as $quarter => $grade) {
    if ($grade === null || $grade === '') continue;
    $stmt = $conn->prepare("
        INSERT INTO grades (student_id, subject_id, quarter, grade)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE grade = VALUES(grade)
    ");
    $stmt->bind_param('sssd', $student_id, $subject_id, $quarter, $grade);
    if (!$stmt->execute()) {
        $success = false;
    }
}

echo json_encode(['success' => $success]);