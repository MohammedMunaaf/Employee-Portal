-- Custom Employee Portal Database Schema

CREATE DATABASE IF NOT EXISTS employee_portal;
USE employee_portal;

-- Disable foreign key checks for clean resets
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS AuditLogs;
DROP TABLE IF EXISTS RolePermissions;
DROP TABLE IF EXISTS UserRoles;
DROP TABLE IF EXISTS Permissions;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE Roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE Permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
);

-- UserRoles table (junction table)
CREATE TABLE UserRoles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE
);

-- RolePermissions table (junction table)
CREATE TABLE RolePermissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES Permissions(id) ON DELETE CASCADE
);

-- AuditLogs table
CREATE TABLE AuditLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);
