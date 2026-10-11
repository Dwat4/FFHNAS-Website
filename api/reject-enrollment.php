<?php
require_once 'config.php';

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Invalid request method');
}

// Get JSON data from request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate enrollment ID
if (!isset($data['id']) || empty($data['id'])) {
    sendResponse(false, null, 'Enrollment ID is required');
}

$enrollmentId = $data['id'];

try {
    $conn = getDBConnection();
    
    // Update enrollment status to 'rejected'
    $stmt = $conn->prepare("UPDATE enrollments SET status = 'rejected' WHERE id = :id");
    $stmt->bindParam(':id', $enrollmentId, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        sendResponse(true, ['id' => $enrollmentId], 'Enrollment rejected successfully');
    } else {
        sendResponse(false, null, 'Failed to reject enrollment');
    }
    
} catch(PDOException $e) {
    sendResponse(false, null, 'Database error: ' . $e->getMessage());
}
?>