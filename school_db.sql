-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 10, 2026 at 03:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `category` enum('general','academic','event','urgent') DEFAULT 'general',
  `created_by` int(11) NOT NULL,
  `creator_name` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `submitted_at` datetime DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `status` enum('submitted','graded') DEFAULT 'submitted',
  `grade` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late') NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read','replied') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `last_school_attended` varchar(255) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `address` text NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `grade_level` varchar(5) NOT NULL,
  `strand` varchar(50) NOT NULL,
  `last_school` varchar(200) DEFAULT NULL,
  `guardian_name` varchar(150) NOT NULL,
  `guardian_phone` varchar(20) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `date_applied` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `first_name`, `last_name`, `last_school_attended`, `date_of_birth`, `gender`, `address`, `email`, `phone`, `grade_level`, `strand`, `last_school`, `guardian_name`, `guardian_phone`, `status`, `date_applied`, `created_at`) VALUES
(6, 'Mark Michael', 'Pedotera', NULL, '2026-02-12', 'male', 'pulong buhangin', 'pedoteramichael@gmail.com', '09916366556', '11', 'ICT', '', 'gaghawtaw', '09916366556', 'rejected', '2026-02-22 14:31:17', '2026-02-22 06:31:17'),
(7, 'Mark Michael', 'Pedotera', NULL, '2026-02-12', 'male', 'pulong buhangin', 'pedoteramichael@gmail.com', '09916366556', '12', 'Sports', '', 'gaghawtaw', '09916366556', 'rejected', '2026-02-22 14:45:20', '2026-02-22 06:45:20'),
(8, 'Mark Michael', 'Pedotera', NULL, '2026-02-12', 'female', 'pulong buhangin', 'pedoteramichael@gmail.com', '09916366556', '11', 'Sports', '', 'gaghawtaw', '09916366556', 'approved', '2026-02-22 15:12:32', '2026-02-22 07:12:32'),
(9, 'Mark Michael', 'Pedotera', NULL, '2026-02-12', 'male', 'pulong buhangin', 'pedoteramichael@gmail.com', '09916366556', '12', 'TVL-AFA', 'awtawtawraw', 'gaghawtaw', '09935439722', 'rejected', '2026-02-22 17:21:37', '2026-02-22 09:21:37'),
(10, 'jamir', 'celestino', NULL, '2009-10-18', 'male', 'pintong bato', 'jam@gmail.com', '09916366556', '12', 'ICT', 'cnhs', 'pedro', '4791827342', 'approved', '2026-02-22 20:58:32', '2026-02-22 12:58:32'),
(11, 'aron', 'eugenio', NULL, '2007-11-17', 'male', 'guyong', 'aron@gmail.com', '891239817', '11', 'ICT', 'guyong', 'berto', '26831982376', 'rejected', '2026-02-23 07:48:22', '2026-02-22 23:48:22'),
(12, 'Mark Michael', 'Pedotera', NULL, '2026-02-12', 'male', 'pulong buhangin', 'pedoteramichael@gmail.com', '09916366556', '11', 'ICT', 'guyong', 'berto', '09916366556', 'rejected', '2026-02-25 13:52:20', '2026-02-25 05:52:20');

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `quarter` varchar(20) NOT NULL,
  `grade` decimal(5,2) NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `student_id`, `subject_id`, `quarter`, `grade`, `remarks`, `created_at`) VALUES
(11, 1, 1, 'Q1', 98.00, NULL, '2026-03-06 15:42:57'),
(12, 1, 1, 'Q2', 95.00, NULL, '2026-03-06 15:42:57'),
(13, 1, 1, 'Q3', 94.00, NULL, '2026-03-06 15:42:57'),
(14, 1, 1, 'Q1', 98.00, NULL, '2026-03-06 16:14:36'),
(15, 1, 1, 'Q2', 95.00, NULL, '2026-03-06 16:14:36'),
(16, 1, 1, 'Q3', 94.00, NULL, '2026-03-06 16:14:36'),
(17, 1, 1, 'Q4', 80.00, NULL, '2026-03-06 16:14:36'),
(18, 1, 1, 'Q1', 98.00, NULL, '2026-03-06 16:19:49'),
(19, 1, 1, 'Q2', 95.00, NULL, '2026-03-06 16:19:49'),
(20, 1, 1, 'Q3', 94.00, NULL, '2026-03-06 16:19:49'),
(21, 1, 1, 'Q4', 80.00, NULL, '2026-03-06 16:19:49'),
(22, 3, 1, 'Q1', 99.00, NULL, '2026-03-06 16:43:20'),
(23, 3, 1, 'Q2', 92.00, NULL, '2026-03-06 16:43:20'),
(24, 3, 1, 'Q3', 95.00, NULL, '2026-03-06 16:43:20'),
(25, 3, 1, 'Q4', 95.00, NULL, '2026-03-06 16:43:20'),
(26, 2, 1, 'Q1', 75.00, NULL, '2026-03-06 16:43:21'),
(27, 2, 1, 'Q2', 89.00, NULL, '2026-03-06 16:43:21'),
(28, 2, 1, 'Q3', 96.00, NULL, '2026-03-06 16:43:21'),
(29, 2, 1, 'Q4', 95.00, NULL, '2026-03-06 16:43:21'),
(30, 4, 1, 'Q1', 94.00, NULL, '2026-03-06 16:43:43'),
(31, 4, 1, 'Q2', 92.00, NULL, '2026-03-06 16:43:43'),
(32, 4, 1, 'Q3', 91.00, NULL, '2026-03-06 16:43:43'),
(33, 4, 1, 'Q4', 92.00, NULL, '2026-03-06 16:43:43'),
(34, 5, 1, 'Q1', 92.00, NULL, '2026-03-06 16:43:44'),
(35, 5, 1, 'Q2', 93.00, NULL, '2026-03-06 16:43:44'),
(36, 5, 1, 'Q3', 94.00, NULL, '2026-03-06 16:43:44'),
(37, 5, 1, 'Q4', 92.00, NULL, '2026-03-06 16:43:44');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `sender_name` varchar(200) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `student_id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `grade_level` int(11) NOT NULL,
  `section` varchar(50) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `student_id`, `first_name`, `last_name`, `grade_level`, `section`, `date_of_birth`, `created_at`) VALUES
(1, NULL, '2024-0001', 'Juan', 'Dela Cruz', 11, 'gc1-11a', NULL, '2026-03-06 14:41:33'),
(2, NULL, '2024-0002', 'Maria', 'Santos', 11, 'gc1-11a', NULL, '2026-03-06 14:41:33'),
(3, NULL, '2024-0003', 'Pedro', 'Reyes', 11, 'gc1-11a', NULL, '2026-03-06 14:41:33'),
(4, NULL, '2024-0004', 'Ana', 'Garcia', 11, 'gc1-11a', NULL, '2026-03-06 14:41:33'),
(5, NULL, '2024-0005', 'Jose', 'Morales', 11, 'gc1-11a', NULL, '2026-03-06 14:41:33'),
(6, NULL, '2024-0011', 'Carlos', 'Rivera', 11, 'gc1-11b', NULL, '2026-03-06 14:41:33'),
(7, NULL, '2024-0012', 'Sofia', 'Torres', 11, 'gc1-11b', NULL, '2026-03-06 14:41:33'),
(8, NULL, '2024-0013', 'Miguel', 'Santos', 11, 'gc1-11b', NULL, '2026-03-06 14:41:33'),
(9, NULL, '2024-0014', 'Isabella', 'Cruz', 11, 'gc1-11b', NULL, '2026-03-06 14:41:33'),
(10, NULL, '2024-0021', 'Roberto', 'Diaz', 12, 'oc-12b', NULL, '2026-03-06 14:41:33'),
(11, NULL, '2024-0022', 'Carmen', 'Lopez', 12, 'oc-12b', NULL, '2026-03-06 14:41:33'),
(12, NULL, '2024-0023', 'Luis', 'Fernandez', 12, 'oc-12b', NULL, '2026-03-06 14:41:33'),
(13, NULL, '2024-0031', 'Diana', 'Reyes', 12, 'spen-12a', NULL, '2026-03-06 14:41:33'),
(14, NULL, '2024-0032', 'Marco', 'Villanueva', 12, 'spen-12a', NULL, '2026-03-06 14:41:33'),
(15, NULL, '2024-0033', 'Stella', 'Ocampo', 12, 'spen-12a', NULL, '2026-03-06 14:41:33'),
(16, NULL, '2024-0034', 'Rafael', 'Lim', 12, 'spen-12a', NULL, '2026-03-06 14:41:33'),
(17, NULL, '2024-0035', 'Janelle', 'Bautista', 12, 'spen-12a', NULL, '2026-03-06 14:41:33'),
(18, NULL, '2024-0036', 'Nico', 'Castillo', 12, 'spen-12a', NULL, '2026-03-06 14:41:33');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `subject_code` varchar(50) NOT NULL,
  `subject_name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `schedule` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `subject_code`, `subject_name`, `description`, `teacher_id`, `schedule`, `created_at`) VALUES
(1, 'GEN', 'General', NULL, NULL, NULL, '2026-03-06 15:41:24');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `teacher_id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher','student') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `employee_id` varchar(50) DEFAULT NULL,
  `contact` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `lrn` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `created_at`, `employee_id`, `contact`, `department`, `lrn`) VALUES
(16, 'Jamir', 'Celestino', 'jam@gmail.com', '$2y$10$18Pbqzx6IXtSqIT7QjVtJeoUcCqW4gP2DIza5MfCviAhg0zJkyFmG', 'admin', '2026-02-22 12:54:47', NULL, NULL, NULL, '123456789098'),
(46, 'Aron', 'Eugenio', 'aron@gmail.com', '$2y$10$6dhSCQEyFVTP5bM.vUpAiOkiPUFZ0cjicAh0c8lKbIic2hcxvBlay', 'teacher', '2026-03-09 23:52:54', 'h12-3152-123', '0956472568', 'ICT TVL', ''),
(47, 'Mark Michael', 'Pedotera', 'pedoteramichael@gmail.com', '$2y$10$dUV1JBVUrA155DD4gtOoRuvGHN7p18zP3kPDkbzLx6FUKaWfZFK8m', 'admin', '2026-09-22 13:29:23', '', '', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created_by` (`created_by`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_receiver` (`receiver_id`),
  ADD KEY `idx_read_status` (`is_read`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subject_code` (`subject_code`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `teacher_id` (`teacher_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD CONSTRAINT `assignment_submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`),
  ADD CONSTRAINT `assignment_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
