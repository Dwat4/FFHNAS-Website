<?php
require_once 'config.php';

$conn = getDBConnection();

$sql = "SELECT id, CONCAT(first_name, ' ', last_name) as name, email, role, status, last_login, created_at 
        FROM users 
        ORDER BY created_at DESC";
$result = $conn->query($sql);

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => [
        'users' => $users,
        'total' => count($users)
    ]
]);

$conn->close();
?>