-- Skema Database untuk Proyek UNILIFE
-- Nama Database: db_unilife

--
-- Struktur tabel untuk `users`
-- Menyimpan data pengguna, termasuk admin dan member.
--
CREATE TABLE `users` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin', 'Member') NOT NULL DEFAULT 'Member',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Struktur tabel untuk `committees` (Panitia)
--
CREATE TABLE `committees` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Struktur tabel untuk `events`
--
CREATE TABLE `events` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `status` ENUM('Upcoming', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
  `image_url` VARCHAR(2048),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Struktur tabel untuk `lineups`
--
CREATE TABLE `lineups` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `artist_name` VARCHAR(255) NOT NULL,
  `day` VARCHAR(100) NOT NULL,
  `time` TIME NOT NULL,
  `event_id` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
);

--
-- Struktur tabel untuk `tickets`
--
CREATE TABLE `tickets` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `type` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('Available', 'Sold Out') NOT NULL DEFAULT 'Available',
  `event_id` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
);

--
-- Struktur tabel untuk `banners`
--
CREATE TABLE `banners` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `image_url` VARCHAR(2048),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Struktur tabel untuk `recaps`
--
CREATE TABLE `recaps` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `status` ENUM('Published', 'Draft') NOT NULL DEFAULT 'Draft',
  `event_id` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE SET NULL
);

--
-- Struktur tabel untuk `abouts`
--
CREATE TABLE `abouts` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Struktur tabel untuk `login_sessions` (Login)
-- Menyimpan histori atau sesi login aktif.
--
CREATE TABLE `login_sessions` (
  `session_id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `login_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `logout_time` TIMESTAMP NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

--
-- Contoh data untuk tabel users (misal: satu admin)
--
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`) VALUES
('USR_ADMIN_01', 'Admin', 'admin@unlife.com', 'hash_password_disini', 'Admin');
