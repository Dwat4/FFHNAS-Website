<?php
require_once 'config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
       $stmt = $conn->query("SELECT * FROM enrollments ORDER BY id DESC");
        $enrollments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(true, $enrollments);
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
      $sql = "INSERT INTO enrollments (first_name, last_name, date_of_birth, gender, address, email, phone, grade_level, strand, last_school, guardian_name, guardian_phone, status, date_applied) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

$stmt->execute([
    $data['firstName'], 
    $data['lastName'], 
    $data['birthdate'],
    $data['gender'], 
    $data['address'], 
    $data['email'], 
    $data['phone'], 
    $data['gradeLevel'], 
    $data['strand'], 
    $data['last_school'] ?? '',
    $data['guardianName'], 
    $data['guardianPhone']
]);
        sendResponse(true, ['id' => $conn->lastInsertId()], 'Enrollment submitted successfully');
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("UPDATE enrollments SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);
        sendResponse(true, null, 'Status updated');
        break;
        
    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM enrollments WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(true, null, 'Enrollment deleted');
        break;
}
?>