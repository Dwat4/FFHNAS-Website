<?php
header('Content-Type: application/json');

// Allow file uploads
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    exit;
}

// Create uploads directory if it doesn't exist
$uploadDir = 'uploads/announcements/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Get file info
$file = $_FILES['photo'];
$fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

// Validate file type
if (!in_array($fileExtension, $allowedExtensions)) {
    echo json_encode(['success' => false, 'error' => 'Invalid file type']);
    exit;
}

// Generate unique filename
$newFileName = uniqid() . '_' . time() . '.' . $fileExtension;
$filePath = $uploadDir . $newFileName;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    echo json_encode(['success' => true, 'url' => $filePath]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to save file']);
}
?>