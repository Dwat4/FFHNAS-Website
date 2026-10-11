<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $conn = new mysqli("localhost", "root", "", "school_db");
    
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    if ($method === 'POST') {
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $subject = $input['subject'] ?? '';
        $messageText = $input['message'] ?? '';

        if (empty($name) || empty($messageText)) {
            echo json_encode(['success' => false, 'message' => 'Name and message are required']);
            exit;
        }

        $fullMessage = "From: " . $name;
        if (!empty($email)) {
            $fullMessage .= " (" . $email . ")";
        }
        if (!empty($subject)) {
            $fullMessage .= "\nSubject: " . $subject;
        }
        $fullMessage .= "\n\n" . $messageText;

        $stmt = $conn->prepare("INSERT INTO messages (sender_id, sender_name, receiver_id, message) VALUES (0, ?, 0, ?)");
        $stmt->bind_param("ss", $name, $fullMessage);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to send message']);
        }
        $stmt->close();
    }
    elseif ($method === 'GET') {
    $result = $conn->query("SELECT id, sender_id, sender_name, receiver_id, message, created_at, CAST(is_read AS UNSIGNED) as is_read FROM messages ORDER BY created_at DESC");
    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
    echo json_encode(['success' => true, 'messages' => $messages]);
}
    elseif ($method === 'PUT') {
        $id = $input['id'] ?? 0;
        $is_read = $input['is_read'] ?? null;
        
        if (!$id || $is_read === null) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit;
        }
        
        $stmt = $conn->prepare("UPDATE messages SET is_read = ? WHERE id = ?");
        $stmt->bind_param("ii", $is_read, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Message updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update message']);
        }
        $stmt->close();
    }
    elseif ($method === 'DELETE') {
        $id = $input['id'] ?? 0;
        $stmt = $conn->prepare("DELETE FROM messages WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete']);
        }
        $stmt->close();
    }

    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>