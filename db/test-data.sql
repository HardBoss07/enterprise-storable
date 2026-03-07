USE storable;

-- 1. Create the fixed guest user
INSERT INTO users (id, username, password_hash, is_admin)
VALUES ('00000000-0000-0000-0000-000000000000', 'guest', '$2a$10$XmJ.mK3e5j0N0.Fp.mYw.eY.xX.mK3e5j0N0.Fp.mYw.eY.xX', TRUE)
ON DUPLICATE KEY UPDATE id=id;

-- 2. Clean existing nodes to avoid duplicates
DELETE FROM nodes;

-- -- 3. Insert root-level nodes
-- INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
-- VALUES 
-- (1, '00000000-0000-0000-0000-000000000000', NULL, 'documents', 'folder', 4096, 'directory', 'documents/'),
-- (2, '00000000-0000-0000-0000-000000000000', NULL, 'root-file.txt', 'file', 1024, 'text/plain', 'root-file.txt');
-- 
-- -- 4. Insert documents folder contents
-- INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
-- VALUES 
-- (3, '00000000-0000-0000-0000-000000000000', 1, 'projects', 'folder', 4096, 'directory', 'documents/projects/'),
-- (4, '00000000-0000-0000-0000-000000000000', 1, 'document1.txt', 'file', 2048, 'text/plain', 'documents/document1.txt');
-- 
-- -- 5. Insert projects folder contents
-- INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
-- VALUES 
-- (5, '00000000-0000-0000-0000-000000000000', 3, 'project-plan.txt', 'file', 512, 'text/plain', 'documents/projects/project-plan.txt');
