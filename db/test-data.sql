USE storable;

-- 1. Create the fixed guest user
INSERT INTO users (id, username, password_hash, is_admin)
VALUES ('00000000-0000-0000-0000-000000000000', 'guest', '$2a$10$XmJ.mK3e5j0N0.Fp.mYw.eY.xX.mK3e5j0N0.Fp.mYw.eY.xX', TRUE)
ON DUPLICATE KEY UPDATE id=id;

-- 2. Clean existing nodes
DELETE FROM nodes;

-- 3. The Root
-- ID: 1
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES (1, '00000000-0000-0000-0000-000000000000', NULL, 'root', 'folder', NULL, 'directory', '7a614f1d-53f8-44da-9785-1b58b449a8ba');

-- 4. Level 1: Under Root
-- IDs: 2, 3
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(2, '00000000-0000-0000-0000-000000000000', 1, 'guest', 'folder', NULL, 'directory', 'b3b83802-1579-48cc-821f-a55364eb495b'),
(3, '00000000-0000-0000-0000-000000000000', 1, 'm4tt3o', 'folder', NULL, 'directory', '6232b572-0107-436b-aef7-f4b2cfea5d00');

-- 5. Level 2: Under guest (ID 2) and m4tt3o (ID 3)
-- IDs: 4, 5, 6, 7
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(4, '00000000-0000-0000-0000-000000000000', 2, 'documents', 'folder', NULL, 'directory', '8e23081f-24a6-483f-9306-0a11e83bf6c2'),
(5, '00000000-0000-0000-0000-000000000000', 2, 'random-guest-file.txt', 'file', 31, 'text/plain', '6c5106ff-54e6-4f8f-a159-85195763fc10'),
(6, '00000000-0000-0000-0000-000000000000', 3, 'files', 'folder', NULL, 'directory', 'a3354335-09cb-49c5-b564-65bdc69ead95'),
(7, '00000000-0000-0000-0000-000000000000', 3, 'test-file.txt', 'file', 36, 'text/plain', '8ae365c8-b2dc-44d8-968f-05f3fc1fe097');

-- 6. Level 3: Under guest/documents (ID 4) and m4tt3o/files (ID 6)
-- IDs: 8, 9, 10
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(8, '00000000-0000-0000-0000-000000000000', 4, 'projects', 'folder', NULL, 'directory', 'da50d160-3161-42ba-a6bf-b0326bc5c3d2'),
(9, '00000000-0000-0000-0000-000000000000', 4, 'document1.txt', 'file', 19, 'text/plain', 'a92fffd8-8286-4ac3-8c90-5488b105587f'),
(10, '00000000-0000-0000-0000-000000000000', 6, 'some-document.txt', 'file', 22, 'text/plain', '0c739db5-8341-4e5f-b639-01af13e12dc8');

-- 7. Level 4: Under guest/documents/projects (ID 8)
-- ID: 11
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(11, '00000000-0000-0000-0000-000000000000', 8, 'project-plan.txt', 'file', 26, 'text/plain', 'dffd5f1b-9b77-409a-a126-3be1e8e41351');