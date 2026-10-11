<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$dbname = 'school_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// GET all announcements
if ($method === 'GET' && $action === 'getAll') {
    $stmt = $pdo->query("SELECT * FROM announcements ORDER BY created_at DESC");
    $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $announcements]);
}

// CREATE announcement
else if ($method === 'POST' && $action === 'create') {
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    $photoPath = '';
    
    // Handle photo upload
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $fileName = time() . '_' . basename($_FILES['photo']['name']);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetPath)) {
            $photoPath = 'uploads/' . $fileName;
        }
    }
    
    $stmt = $pdo->prepare("INSERT INTO announcements (title, content, photo, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$title, $content, $photoPath]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
}

// DELETE announcement
else if ($method === 'POST' && $action === 'delete') {
    $id = $_POST['id'] ?? 0;
    
    // Get photo path before deleting
    $stmt = $pdo->prepare("SELECT photo FROM announcements WHERE id = ?");
    $stmt->execute([$id]);
    $announcement = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Delete from database
    $stmt = $pdo->prepare("DELETE FROM announcements WHERE id = ?");
    $stmt->execute([$id]);
    
    // Delete photo file if exists
    if ($announcement && $announcement['photo']) {
        $filePath = '../' . $announcement['photo'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    
    echo json_encode(['success' => true]);
}

else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}
?>