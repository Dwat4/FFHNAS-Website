<?php
// Temporarily enable errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
        echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    if ($method === 'GET') {
        $result = $conn->query("SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC");
        
        if (!$result) {
            echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
            exit;
        }
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode(['success' => true, 'data' => ['users' => $users]]);
    }
    elseif ($method === 'POST') {
        $action = $input['action'] ?? 'create';
        
        if ($action === 'delete') {
            $id = $input['id'] ?? 0;
            
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'User ID required']);
                exit;
            }
            
            $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'");
            $stmt->bind_param("i", $id);
            
            if ($stmt->execute() && $stmt->affected_rows > 0) {
                echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Cannot delete admin users']);
            }
            $stmt->close();
        }
        elseif ($action === 'toggle_status') {
            echo json_encode(['success' => false, 'message' => 'Status column does not exist in database']);
        }
        else {
            // Create new user
            $first_name = $input['first_name'] ?? '';
            $last_name = $input['last_name'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            $role = $input['role'] ?? 'student';
            
            if (!$first_name || !$last_name || !$email || !$password) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                exit;
            }
            
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $first_name, $last_name, $email, $hashedPassword, $role);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'User created successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Email already exists']);
            }
            $stmt->close();
        }
    }
    elseif ($method === 'PUT') {
        $id = $input['id'] ?? 0;
        $action = $input['action'] ?? 'update';
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'User ID required']);
            exit;
        }
        
        if ($action === 'change_password') {
            $password = $input['password'] ?? '';
            if (!$password) {
                echo json_encode(['success' => false, 'message' => 'Password required']);
                exit;
            }
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->bind_param("si", $hashedPassword, $id);
        }
        else {
            // Update user info
            $first_name = $input['first_name'] ?? '';
            $last_name = $input['last_name'] ?? '';
            $email = $input['email'] ?? '';
            $role = $input['role'] ?? '';
            
            if (!$first_name || !$last_name || !$email || !$role) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                exit;
            }
            
            $stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?");
            $stmt->bind_param("ssssi", $first_name, $last_name, $email, $role, $id);
        }
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update user']);
        }
        $stmt->close();
    }
    elseif ($method === 'DELETE') {
        $id = $input['id'] ?? 0;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'User ID required']);
            exit;
        }
        
        // Prevent deleting admin users
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Cannot delete admin users']);
        }
        $stmt->close();
    }

    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>