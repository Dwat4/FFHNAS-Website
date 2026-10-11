<?php
require_once 'db.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'getAll':
        $stmt = $pdo->query("SELECT t.*, u.email FROM teachers t LEFT JOIN users u ON t.user_id = u.id ORDER BY t.last_name");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'getById':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("SELECT t.*, u.email FROM teachers t LEFT JOIN users u ON t.user_id = u.id WHERE t.id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;
        
    case 'getByUserId':
        $user_id = $_GET['user_id'];
        $stmt = $pdo->prepare("SELECT * FROM teachers WHERE user_id = ?");
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;
        
    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Create user first
        $stmt = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'teacher')");
        $stmt->execute([$data['email'], md5($data['password'])]);
        $user_id = $pdo->lastInsertId();
        
        // Create teacher
        $stmt = $pdo->prepare("INSERT INTO teachers (user_id, teacher_id, first_name, last_name, department) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $data['teacher_id'], $data['first_name'], $data['last_name'], $data['department']]);
        
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
        
    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE teachers SET teacher_id=?, first_name=?, last_name=?, department=? WHERE id=?");
        $stmt->execute([$data['teacher_id'], $data['first_name'], $data['last_name'], $data['department'], $data['id']]);
        echo json_encode(['success' => true]);
        break;
        
    case 'delete':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM teachers WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>