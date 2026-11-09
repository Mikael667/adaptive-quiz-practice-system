-- Run after database/schema/schema.sql on a new database.
-- Re-running this file keeps the required subject names in sync by code.

INSERT INTO subjects (code, full_name) VALUES
    ('MAT1123',  'Discrete Mathematical Structures'),
    ('CSE2034',  'Introduction to Design and Analysis of Algorithms'),
    ('CSE2036',  'Programming using Java'),
    ('CSE2036L', 'Programming using Java Lab'),
    ('ELX2705',  'Digital Logic Design'),
    ('MAT1123L', 'Discrete Mathematical Structures Lab'),
    ('COM2521',  'Academic Writing'),
    ('UHV2701',  'Universal Human Values II'),
    ('CSE2034L', 'Introduction to Design and Analysis of Algorithms Lab')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);
