<?php
require_once 'db.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'getByStudent':
        $student_id = $_GET['student_id'];
        $stmt = $pdo->prepare("SELECT a.*, s.subject_name FROM attendance a INNER JOIN subjects s ON a.subject_id = s.id WHERE a.student_id = ? ORDER BY a.date DESC");
        $stmt->execute([$student_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'getBySubject':
        $subject_id = $_GET['subject_id'];
        $date = $_GET['date'] ?? date('Y-m-d');
        $stmt = $pdo->prepare("SELECT a.*, st.first_name, st.last_name, st.student_id FROM attendance a INNER JOIN students st ON a.student_id = st.id WHERE a.subject_id = ? AND a.date = ? ORDER BY st.last_name");
        $stmt->execute([$subject_id, $date]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['student_id'], $data['subject_id'], $data['date'], $data['status']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
        
    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE attendance SET status=? WHERE id=?");
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(['success' => true]);
        break;
        
    case 'bulkCreate':
        $data = json_decode(file_get_contents('php://input'), true);
        $subject_id = $data['subject_id'];
        $date = $data['date'];
        $attendance_records = $data['records'];
        
        foreach($attendance_records as $record) {
            $stmt = $pdo->prepare("INSERT INTO attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=?");
            $stmt->execute([$record['student_id'], $subject_id, $date, $record['status'], $record['status']]);
        }
        echo json_encode(['success' => true]);
        break;
}
?>