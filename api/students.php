<?php
require_once 'db.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'getAll':
        $stmt = $pdo->query("SELECT s.*, u.email FROM students s LEFT JOIN users u ON s.user_id = u.id ORDER BY s.last_name");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'getById':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("SELECT s.*, u.email FROM students s LEFT JOIN users u ON s.user_id = u.id WHERE s.id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;
        
    case 'getByUserId':
        $user_id = $_GET['user_id'];
        $stmt = $pdo->prepare("SELECT * FROM students WHERE user_id = ?");
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;
        
    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Create user first
        $stmt = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'student')");
        $stmt->execute([$data['email'], md5($data['password'])]);
        $user_id = $pdo->lastInsertId();
        
        // Create student
        $stmt = $pdo->prepare("INSERT INTO students (user_id, student_id, first_name, last_name, grade_level, section) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $data['student_id'], $data['first_name'], $data['last_name'], $data['grade_level'], $data['section']]);
        
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
        
    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE students SET student_id=?, first_name=?, last_name=?, grade_level=?, section=? WHERE id=?");
        $stmt->execute([$data['student_id'], $data['first_name'], $data['last_name'], $data['grade_level'], $data['section'], $data['id']]);
        echo json_encode(['success' => true]);
        break;
        
    case 'delete':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>