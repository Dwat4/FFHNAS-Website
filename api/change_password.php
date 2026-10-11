<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'db.php'; // your DB connection

$data = json_decode(file_get_contents('php://input'), true);
$id       = intval($data['id']);
$current  = $data['current_password'];
$new      = $data['new_password'];

$stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) { echo json_encode(['success'=>false,'message'=>'User not found']); exit; }

// Support both plain text and hashed passwords
$valid = ($user['password'] === $current) || password_verify($current, $user['password']);
if (!$valid) { echo json_encode(['success'=>false,'message'=>'Current password is incorrect']); exit; }

$hashed = password_hash($new, PASSWORD_DEFAULT);
$update = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
$update->execute([$hashed, $id]);

echo json_encode(['success'=>true]);