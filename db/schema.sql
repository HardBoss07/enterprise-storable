USE storable;

DROP TABLE IF EXISTS nodes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nodes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id VARCHAR(36) NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(255) NOT NULL,
    kind ENUM('file', 'folder') NOT NULL,
    size BIGINT NULL,
    mime VARCHAR(255) NULL,
    storage_key VARCHAR(1024) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES nodes(id) ON DELETE CASCADE,
    UNIQUE KEY node_unique_per_parent (parent_id, name),
    KEY node_parent_idx (parent_id)
);

INSERT INTO users (id, username, email, password, role)
VALUES ('f43c0bcf-11e4-4629-b072-321ccd04e72a', 'root', 'root@m4tt3o.dev', '$2a$10$dA.gkjzVGZRgDOpwy63lfOIUtCpflbX8hKav4z55PiSNdILBPsHhq', 'ADMIN')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(1, 'f43c0bcf-11e4-4629-b072-321ccd04e72a', NULL, 'root', 'folder', NULL, 'directory', '7a614f1d-53f8-44da-9785-1b58b449a8ba');


CREATE USER 'backend_user'@'%' IDENTIFIED BY 'backend_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON storable.* TO 'backend_user'@'%';
FLUSH PRIVILEGES;
