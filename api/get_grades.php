<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$conn = new mysqli('localhost', 'root', '', 'school_db');
$section = $_GET['section'] ?? '';

$result = $conn->query("
    SELECT s.id, s.student_id, CONCAT(s.first_name, ' ', s.last_name) as name,
        MAX(CASE WHEN g.quarter='Q1' THEN g.grade ELSE NULL END) as q1,
        MAX(CASE WHEN g.quarter='Q2' THEN g.grade ELSE NULL END) as q2,
        MAX(CASE WHEN g.quarter='Q3' THEN g.grade ELSE NULL END) as q3,
        MAX(CASE WHEN g.quarter='Q4' THEN g.grade ELSE NULL END) as q4
    FROM students s
    LEFT JOIN grades g ON s.id = g.student_id
    WHERE s.section = '$section'
    GROUP BY s.id, s.student_id, s.first_name, s.last_name
");

$rows = [];
while ($row = $result->fetch_assoc()) $rows[] = $row;
echo json_encode($rows);