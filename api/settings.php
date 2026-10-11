<?php
require_once 'config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    $id = intval($data['id']);
    $firstName = $data['first_name'] ?? null;
    $lastName = $data['last_name'] ?? null;
    $email = $data['email'] ?? null;

    // If only password change (no first_name sent)
    if (empty($firstName) && !empty($data['new_password'])) {
        // Verify current password
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($data['current_password'], $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            exit;
        }

        $newPassword = password_hash($data['new_password'], PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$newPassword, $id]);
        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
        exit;
    }

    // Check email taken
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->execute([$email, $id]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already in use by another account']);
        exit;
    }

    // Handle optional password change
    if (!empty($data['new_password']) && !empty($data['current_password'])) {
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($data['current_password'], $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            exit;
        }

        $newPassword = password_hash($data['new_password'], PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET first_name=?, last_name=?, email=?, password=? WHERE id=?");
        $stmt->execute([$firstName, $lastName, $email, $newPassword, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET first_name=?, last_name=?, email=? WHERE id=?");
        $stmt->execute([$firstName, $lastName, $email, $id]);
    }

    echo json_encode(['success' => true, 'message' => 'Settings updated successfully']);
}

$pdo = null;
?>