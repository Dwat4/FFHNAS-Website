<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

$uploadDir = '../uploads/submissions/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];
$studentId    = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['student_id'] ?? 'unknown');
$assignmentId = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['assignment_id'] ?? 'unknown');

$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Only image files are allowed (JPG, PNG, GIF, WEBP)']);
    exit;
}

$maxSize = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => 'File exceeds 5MB limit']);
    exit;
}

$ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = "sub_{$studentId}_{$assignmentId}_" . time() . "." . $ext;
$dest     = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $dest)) {
    $url = 'http://' . $_SERVER['HTTP_HOST'] . '/school/uploads/submissions/' . $filename;
    echo json_encode(['success' => true, 'url' => $url, 'filename' => $filename]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
}
?>