USE storable;

-- Create a dummy user
INSERT INTO users (id, username, password_hash, is_admin) VALUES (1, 'testuser', 'somehash', true);

-- Root file
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES (1, 1, NULL, 'root-file.txt', 'file', 1024, 'text/plain', 'root-file.txt');

-- Root folder
INSERT INTO nodes (id, owner_id, parent_id, name, kind)
VALUES (2, 1, NULL, 'documents', 'folder');

-- File in 'documents' folder
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES (3, 1, 2, 'document1.txt', 'file', 2048, 'text/plain', 'documents/document1.txt');

-- Subfolder in 'documents' folder
INSERT INTO nodes (id, owner_id, parent_id, name, kind)
VALUES (4, 1, 2, 'projects', 'folder');

-- File in 'projects' subfolder
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES (5, 1, 4, 'project-plan.txt', 'file', 4096, 'text/plain', 'documents/projects/project-plan.txt');
