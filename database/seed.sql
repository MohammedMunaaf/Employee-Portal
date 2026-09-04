-- Custom Employee Portal Seed Data
USE employee_portal;

-- Seed Roles
INSERT INTO Roles (id, name, description) VALUES
(1, 'Admin', 'Full administrative access to portal, user management, and all Zoho apps'),
(2, 'HR', 'Human Resources role with access to Zoho People'),
(3, 'Sales', 'Sales role with access to Zoho CRM'),
(4, 'Support', 'Customer Support role with access to Zoho Desk'),
(5, 'Finance', 'Finance role with access to Zoho Books');

-- Seed Permissions
INSERT INTO Permissions (id, name, description) VALUES
(1, 'dashboard.view', 'View employee dashboard'),
(2, 'users.view', 'View system users'),
(3, 'users.create', 'Create new users'),
(4, 'users.edit', 'Edit existing users'),
(5, 'users.delete', 'Delete users'),
(6, 'roles.view', 'View roles'),
(7, 'roles.manage', 'Manage roles'),
(8, 'permissions.manage', 'Manage permissions'),
(9, 'audit.view', 'View system audit logs'),
(10, 'zoho.people', 'Access Zoho People application'),
(11, 'zoho.crm', 'Access Zoho CRM application'),
(12, 'zoho.desk', 'Access Zoho Desk application'),
(13, 'zoho.books', 'Access Zoho Books application');

-- Seed RolePermissions
-- Admin gets all permissions
INSERT INTO RolePermissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13);

-- HR gets dashboard and zoho.people
INSERT INTO RolePermissions (role_id, permission_id) VALUES
(2, 1), (2, 10);

-- Sales gets dashboard and zoho.crm
INSERT INTO RolePermissions (role_id, permission_id) VALUES
(3, 1), (3, 11);

-- Support gets dashboard and zoho.desk
INSERT INTO RolePermissions (role_id, permission_id) VALUES
(4, 1), (4, 12);

-- Finance gets dashboard and zoho.books
INSERT INTO RolePermissions (role_id, permission_id) VALUES
(5, 1), (5, 13);

-- Seed Users (Bcrypt hash for password: Password123!)
-- Hash below is generated using bcrypt salt round 10 for 'Password123!'
INSERT INTO Users (id, name, email, password_hash, is_active) VALUES
(1, 'System Admin', 'admin@example.com', '$2a$10$rv8UO44PYeGTAmliiIPrUuWn8c4O5ohVj0b2TCG2Z2KLC0U2iwnSq', 1),
(2, 'HR Manager', 'hr@example.com', '$2a$10$rv8UO44PYeGTAmliiIPrUuWn8c4O5ohVj0b2TCG2Z2KLC0U2iwnSq', 1),
(3, 'Sales Lead', 'sales@example.com', '$2a$10$rv8UO44PYeGTAmliiIPrUuWn8c4O5ohVj0b2TCG2Z2KLC0U2iwnSq', 1),
(4, 'Support Tech', 'support@example.com', '$2a$10$rv8UO44PYeGTAmliiIPrUuWn8c4O5ohVj0b2TCG2Z2KLC0U2iwnSq', 1),
(5, 'Finance Executive', 'finance@example.com', '$2a$10$rv8UO44PYeGTAmliiIPrUuWn8c4O5ohVj0b2TCG2Z2KLC0U2iwnSq', 1);

-- Seed UserRoles
INSERT INTO UserRoles (user_id, role_id) VALUES
(1, 1), -- Admin
(2, 2), -- HR
(3, 3), -- Sales
(4, 4), -- Support
(5, 5); -- Finance
