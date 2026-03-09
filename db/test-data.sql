USE storable;

-- 1. Create base user (Password is 'm4tt3o')
INSERT INTO users (id, username, email, password, role)
VALUES ('e17dbb63-16ab-484b-b6a4-59e0548eaa91', 'm4tt3o', 'matteobosshard@gmail.com', '$2a$10$J978U2UKWEl/sopXjTzl4Ox6zgggvxEkDt77FBehAF.CLEYqP8lC6', 'ADMIN')
ON DUPLICATE KEY UPDATE id=id;

-- 2. Clean existing nodes
DELETE FROM nodes;

-- 3. The Root
-- ID: 1
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES (1, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', NULL, 'root', 'folder', NULL, 'directory', '7a614f1d-53f8-44da-9785-1b58b449a8ba');

-- 4. Level 1: Under Root
-- IDs: 2, 3
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(2, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 1, 'guest', 'folder', NULL, 'directory', 'b3b83802-1579-48cc-821f-a55364eb495b'),
(3, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 1, 'm4tt3o', 'folder', NULL, 'directory', '6232b572-0107-436b-aef7-f4b2cfea5d00');

-- 5. Level 2: Under guest (ID 2) and m4tt3o (ID 3)
-- IDs: 4, 5, 6, 7
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(4, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 2, 'documents', 'folder', NULL, 'directory', '8e23081f-24a6-483f-9306-0a11e83bf6c2'),
(5, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 2, 'random-guest-file.txt', 'file', 31, 'text/plain', '6c5106ff-54e6-4f8f-a159-85195763fc10'),
(6, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 3, 'files', 'folder', NULL, 'directory', 'a3354335-09cb-49c5-b564-65bdc69ead95'),
(7, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 3, 'test-file.txt', 'file', 36, 'text/plain', '8ae365c8-b2dc-44d8-968f-05f3fc1fe097');

-- 6. Level 3: Under guest/documents (ID 4) and m4tt3o/files (ID 6)
-- IDs: 8, 9, 10
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(8, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 4, 'projects', 'folder', NULL, 'directory', 'da50d160-3161-42ba-a6bf-b0326bc5c3d2'),
(9, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 4, 'document1.txt', 'file', 19, 'text/plain', 'a92fffd8-8286-4ac3-8c90-5488b105587f'),
(10, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 6, 'some-document.txt', 'file', 22, 'text/plain', '0c739db5-8341-4e5f-b639-01af13e12dc8');

-- 7. Level 4: Under guest/documents/projects (ID 8)
-- ID: 11
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(11, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 8, 'project-plan.txt', 'file', 26, 'text/plain', 'dffd5f1b-9b77-409a-a126-3be1e8e41351');
