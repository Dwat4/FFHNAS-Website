<?php
require_once 'db.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'getAll':
        $stmt = $pdo->query("SELECT s.*, t.first_name, t.last_name FROM subjects s LEFT JOIN teachers t ON s.teacher_id = t.id ORDER BY s.subject_code");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'getByTeacher':
        $teacher_id = $_GET['teacher_id'];
        $stmt = $pdo->prepare("SELECT * FROM subjects WHERE teacher_id = ?");
        $stmt->execute([$teacher_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'getByStudent':
        $student_id = $_GET['student_id'];
        $stmt = $pdo->prepare("SELECT s.* FROM subjects s INNER JOIN enrollments e ON s.id = e.subject_id WHERE e.student_id = ?");
        $stmt->execute([$student_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO subjects (subject_code, subject_name, description, teacher_id, schedule) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['subject_code'], $data['subject_name'], $data['description'], $data['teacher_id'], $data['schedule']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
        
    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE subjects SET subject_code=?, subject_name=?, description=?, teacher_id=?, schedule=? WHERE id=?");
        $stmt->execute([$data['subject_code'], $data['subject_name'], $data['description'], $data['teacher_id'], $data['schedule'], $data['id']]);
        echo json_encode(['success' => true]);
        break;
        
    case 'delete':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM subjects WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>