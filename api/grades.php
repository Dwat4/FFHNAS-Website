<?php
require_once 'db.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'getByStudent':
        $student_id = $_GET['student_id'];
        $stmt = $pdo->prepare("SELECT g.*, s.subject_name, s.subject_code FROM grades g INNER JOIN subjects s ON g.subject_id = s.id WHERE g.student_id = ? ORDER BY g.graded_at DESC");
        $stmt->execute([$student_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'getBySubject':
        $subject_id = $_GET['subject_id'];
        $stmt = $pdo->prepare("SELECT g.*, st.first_name, st.last_name, st.student_id FROM grades g INNER JOIN students st ON g.student_id = st.id WHERE g.subject_id = ? ORDER BY st.last_name");
        $stmt->execute([$subject_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO grades (student_id, subject_id, grade_type, score, max_score) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['student_id'], $data['subject_id'], $data['grade_type'], $data['score'], $data['max_score']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
        
    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE grades SET grade_type=?, score=?, max_score=? WHERE id=?");
        $stmt->execute([$data['grade_type'], $data['score'], $data['max_score'], $data['id']]);
        echo json_encode(['success' => true]);
        break;
        
    case 'delete':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM grades WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>