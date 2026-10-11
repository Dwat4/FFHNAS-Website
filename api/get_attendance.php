<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$conn = new mysqli('localhost', 'root', '', 'school_db');
$section = $_GET['section'] ?? '';
$date    = $_GET['date']    ?? date('Y-m-d');

$result = $conn->query("
    SELECT s.id, s.student_id, CONCAT(s.first_name, ' ', s.last_name) as name,
        COALESCE(a.status, '') as status
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id AND a.date = '$date'
    WHERE s.section = '$section'
");

$rows = [];
while ($row = $result->fetch_assoc()) $rows[] = $row;
echo json_encode($rows);