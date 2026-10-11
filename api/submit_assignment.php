<?php
session_start();
include 'db.php';

$assignment_id = $_POST['assignment_id'];
$student_id = $_SESSION['user_id'];
$notes = $_POST['notes'];
$file_path = null;

// Handle file upload
if (!empty($_FILES['file']['name'])) {
    $upload_dir = 'uploads/submissions/';
    $file_path = $upload_dir . basename($_FILES['file']['name']);
    move_uploaded_file($_FILES['file']['tmp_name'], $file_path);
}

$stmt = $pdo->prepare("INSERT INTO assignment_submissions 
    (assignment_id, student_id, notes, file_path) 
    VALUES (?, ?, ?, ?)");
$stmt->execute([$assignment_id, $student_id, $notes, $file_path]);

echo json_encode(['success' => true]);