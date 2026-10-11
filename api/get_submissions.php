<?php
session_start();
include 'db.php';

$teacher_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("
    SELECT s.*, 
           a.title AS assignment_title, 
           a.subject,
           st.name AS student_name
    FROM assignment_submissions s
    JOIN assignments a ON s.assignment_id = a.id
    JOIN students st ON s.student_id = st.id
    WHERE a.teacher_id = ?
    ORDER BY s.submitted_at DESC
");
$stmt->execute([$teacher_id]);
$submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($submissions);