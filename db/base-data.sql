USE storable;

-- Creating backend database user with limited permissions
CREATE USER 'backend_user'@'%' IDENTIFIED BY 'backend_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON storable.* TO 'backend_user'@'%';
FLUSH PRIVILEGES;

-- Basic system settings
INSERT INTO system_settings (setting_key, setting_value) VALUES ('trash_retention_days', '30');
INSERT INTO system_settings (setting_key, setting_value) VALUES ('system_timezone', 'Europe/Zurich');

-- Create root user and root directory
INSERT INTO users (id, username, email, password, role)
VALUES ('f43c0bcf-11e4-4629-b072-321ccd04e72a', 'root', 'root@m4tt3o.dev', '$2a$10$dA.gkjzVGZRgDOpwy63lfOIUtCpflbX8hKav4z55PiSNdILBPsHhq', 'ADMIN')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(1, 'f43c0bcf-11e4-4629-b072-321ccd04e72a', NULL, 'root', 'folder', NULL, 'directory', '7a614f1d-53f8-44da-9785-1b58b449a8ba'),
(100, 'f43c0bcf-11e4-4629-b072-321ccd04e72a', 1, 'Public', 'folder', NULL, 'directory', '88888888-8888-8888-8888-888888888888');