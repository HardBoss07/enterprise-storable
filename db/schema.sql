USE storable;

DROP TABLE IF EXISTS nodes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS system_settings;

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
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at DATETIME NULL,
    original_path VARCHAR(1024) NULL,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES nodes(id) ON DELETE CASCADE,
    UNIQUE KEY node_unique_per_parent (parent_id, name),
    KEY node_parent_idx (parent_id)
);

CREATE TABLE system_settings (
    setting_key VARCHAR(255) PRIMARY KEY,
    setting_value VARCHAR(255) NOT NULL
);

CREATE TABLE access_privileges (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    node_id BIGINT UNSIGNED NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    level ENUM('VIEW', 'EDIT', 'OWNER') NOT NULL,
    FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY privilege_unique (node_id, user_id)
);
