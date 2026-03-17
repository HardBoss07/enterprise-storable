USE storable;

-- 1. Create users
INSERT INTO users (id, username, email, password, role)
VALUES
('e17dbb63-16ab-484b-b6a4-59e0548eaa91', 'm4tt3o', 'matteobosshard@gmail.com', '$2a$10$J978U2UKWEl/sopXjTzl4Ox6zgggvxEkDt77FBehAF.CLEYqP8lC6', 'USER'),
('acd113ec-3452-4fa0-bddc-57d8bdfe2485', 'testuser', 'testuser@m4tt3o.dev', '$2a$10$tPXkkf.EH/XXsIo/ZthGRey4hBVjKkB4pfIZBnU7u1QoOiZogHX.W', 'USER')
ON DUPLICATE KEY UPDATE id=id;

-- 2. Home Directories (Parent is Root ID: 1)
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(102, 'acd113ec-3452-4fa0-bddc-57d8bdfe2485', 1, 'testuser', 'folder', NULL, 'directory', 'b3b83802-1579-48cc-821f-a55364eb495b'),
(103, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 1, 'm4tt3o', 'folder', NULL, 'directory', '6232b572-0107-436b-aef7-f4b2cfea5d00')
ON DUPLICATE KEY UPDATE id=id;

-- 3. Content for testuser (Under ID 102)
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(104, 'acd113ec-3452-4fa0-bddc-57d8bdfe2485', 102, 'documents', 'folder', NULL, 'directory', '8e23081f-24a6-483f-9306-0a11e83bf6c2'),
(105, 'acd113ec-3452-4fa0-bddc-57d8bdfe2485', 102, 'random-testuser-file.txt', 'file', 31, 'text/plain', '6c5106ff-54e6-4f8f-a159-85195763fc10')
ON DUPLICATE KEY UPDATE id=id;

-- 4. Content for m4tt3o (Under ID 103)
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(106, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 103, 'files', 'folder', NULL, 'directory', 'a3354335-09cb-49c5-b564-65bdc69ead95'),
(107, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 103, 'test-file.txt', 'file', 36, 'text/plain', '8ae365c8-b2dc-44d8-968f-05f3fc1fe097')
ON DUPLICATE KEY UPDATE id=id;

-- 5. Deeper levels...
INSERT INTO nodes (id, owner_id, parent_id, name, kind, size, mime, storage_key)
VALUES 
(108, 'acd113ec-3452-4fa0-bddc-57d8bdfe2485', 104, 'projects', 'folder', NULL, 'directory', 'da50d160-3161-42ba-a6bf-b0326bc5c3d2'),
(109, 'e17dbb63-16ab-484b-b6a4-59e0548eaa91', 106, 'some-document.txt', 'file', 22, 'text/plain', '0c739db5-8341-4e5f-b639-01af13e12dc8')
ON DUPLICATE KEY UPDATE id=id;