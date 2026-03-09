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

INSERT INTO users (id, username, email, password, role) VALUES 
('00000000-0000-0000-0000-000000000000', 'guest', 'guest@storable.dev', '$2a$10$NotRealHashForGuestButNeedsToExist', 'GUEST');

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

CREATE USER 'backend_user'@'%' IDENTIFIED BY 'backend_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON storable.* TO 'backend_user'@'%';
FLUSH PRIVILEGES;
