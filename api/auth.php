<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

define('ADMIN_SECRET_KEY', 'FFHNAS_ADMIN_2026');

$host     = 'localhost';
$dbname   = 'school_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$input = file_get_contents('php://input');
$data  = json_decode($input, true);

if (!$data) {
    $data = $_POST;
}

$action = isset($data['action']) ? $data['action'] : '';

// ─── REGISTER ───────────────────────────────────────────────────────────────
if ($action === 'register') {
    $firstName  = isset($data['firstName'])   ? trim($data['firstName'])  : '';
    $lastName   = isset($data['lastName'])    ? trim($data['lastName'])   : '';
    $email      = isset($data['email'])       ? trim($data['email'])      : '';
    $password   = isset($data['password'])    ? $data['password']         : '';
    $role       = isset($data['role'])        ? $data['role']             : '';
    $adminKey   = isset($data['adminKey'])    ? $data['adminKey']         : '';
    $lrn        = isset($data['lrn'])         ? trim($data['lrn'])        : '';
    $employeeId = isset($data['employee_id']) ? trim($data['employee_id']): '';
    $contact    = isset($data['contact'])     ? trim($data['contact'])    : '';
    $department = isset($data['department'])  ? trim($data['department']) : '';

    if (empty($firstName) || empty($lastName) || empty($email) || empty($password) || empty($role)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    if ($role === 'admin' && $adminKey !== ADMIN_SECRET_KEY) {
        echo json_encode(['success' => false, 'message' => 'Invalid admin key']);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, password, role, lrn, employee_id, contact, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$firstName, $lastName, $email, $hashedPassword, $role, $lrn, $employeeId, $contact, $department]);
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
    }

// ─── LOGIN ───────────────────────────────────────────────────────────────────
} elseif ($action === 'login') {
    $email    = isset($data['email'])    ? trim($data['email'])  : '';
    $password = isset($data['password']) ? $data['password']     : '';
    $role     = isset($data['role'])     ? $data['role']         : '';

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password required']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Account not found']);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
        exit;
    }

    if ($user['role'] !== $role) {
        echo json_encode(['success' => false, 'message' => 'Wrong account type selected']);
        exit;
    }

    unset($user['password']);
    echo json_encode(['success' => true, 'message' => 'Login successful', 'user' => $user]);

// ─── INVALID ACTION ──────────────────────────────────────────────────────────
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>