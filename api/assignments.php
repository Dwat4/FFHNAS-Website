<?php
require_once 'db.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'getAll':
        $stmt = $pdo->query("SELECT a.*, s.subject_name FROM assignments a INNER JOIN subjects s ON a.subject_id = s.id ORDER BY a.due_date DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'getBySubject':
        $subject_id = $_GET['subject_id'];
        $stmt = $pdo->prepare("SELECT * FROM assignments WHERE subject_id = ? ORDER BY due_date DESC");
        $stmt->execute([$subject_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'getByStudent':
        $student_id = $_GET['student_id'];
        $stmt = $pdo->prepare("SELECT a.*, s.subject_name FROM assignments a INNER JOIN subjects s ON a.subject_id = s.id INNER JOIN enrollments e ON s.id = e.subject_id WHERE e.student_id = ? ORDER BY a.due_date DESC");
        $stmt->execute([$student_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO assignments (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['subject_id'], $data['title'], $data['description'], $data['due_date']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
        
    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE assignments SET title=?, description=?, due_date=? WHERE id=?");
        $stmt->execute([$data['title'], $data['description'], $data['due_date'], $data['id']]);
        echo json_encode(['success' => true]);
        break;
        
    case 'delete':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM assignments WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>