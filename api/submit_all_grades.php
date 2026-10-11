<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$conn = new mysqli('localhost', 'root', '', 'school_db');
$data = json_decode(file_get_contents('php://input'), true);

$students = $data['students'] ?? [];
$success = true;

foreach ($students as $student) {
    $quarters = ['Prelim' => $student['prelim'], 'Midterm' => $student['midterm'], 'Finals' => $student['finals']];
    foreach ($quarters as $quarter => $grade) {
        $stmt = $conn->prepare("
            INSERT INTO grades (student_id, subject_id, quarter, grade)
            VALUES (?, 1, ?, ?)
            ON DUPLICATE KEY UPDATE grade = VALUES(grade)
        ");
        $stmt->bind_param('isd', $student['id'], $quarter, $grade);
        if (!$stmt->execute()) $success = false;
    }
}

echo json_encode(['success' => $success]);