-- Sample questions for initial testing of question delivery, grading, and adaptive practice.
-- Uses subqueries on (subject_code, topic_name) to link with topics safely.

USE adaptive_quiz;

-- Question 1: Java Inheritance
INSERT INTO questions (
    topic_id, question_text, option_a, option_b, option_c, option_d,
    correct_option, explanation, difficulty, generation_source, generation_reference
)
SELECT
    t.id,
    'Which keyword is used in Java to inherit a class?',
    'implements',
    'extends',
    'inherits',
    'instanceof',
    'B',
    'In Java, the extends keyword is used by a child class to inherit fields and methods from a parent class.',
    'EASY',
    'seed_script_v1',
    'JAVA_INH_001'
FROM topics t
WHERE t.subject_code = 'CSE2036' AND t.name = 'Inheritance and Polymorphism'
ON DUPLICATE KEY UPDATE question_text = VALUES(question_text);

-- Question 2: Java Collections
INSERT INTO questions (
    topic_id, question_text, option_a, option_b, option_c, option_d,
    correct_option, explanation, difficulty, generation_source, generation_reference
)
SELECT
    t.id,
    'Which collection class allows unique elements only and preserves no insertion order?',
    'ArrayList',
    'LinkedList',
    'HashSet',
    'TreeSet',
    'C',
    'HashSet uses a hash table to store elements, guarantees uniqueness, and does not maintain any insertion order.',
    'MEDIUM',
    'seed_script_v1',
    'JAVA_COLL_001'
FROM topics t
WHERE t.subject_code = 'CSE2036' AND t.name = 'Java Collections Framework'
ON DUPLICATE KEY UPDATE question_text = VALUES(question_text);

-- Question 3: Java Exception Handling
INSERT INTO questions (
    topic_id, question_text, option_a, option_b, option_c, option_d,
    correct_option, explanation, difficulty, generation_source, generation_reference
)
SELECT
    t.id,
    'Which of the following is an unchecked exception in Java?',
    'IOException',
    'SQLException',
    'NullPointerException',
    'ClassNotFoundException',
    'C',
    'NullPointerException extends RuntimeException and is therefore an unchecked exception that does not need to be explicitly declared.',
    'MEDIUM',
    'seed_script_v1',
    'JAVA_EXC_001'
FROM topics t
WHERE t.subject_code = 'CSE2036' AND t.name = 'Exception Handling'
ON DUPLICATE KEY UPDATE question_text = VALUES(question_text);

-- Question 4: DAA Asymptotic Complexity
INSERT INTO questions (
    topic_id, question_text, option_a, option_b, option_c, option_d,
    correct_option, explanation, difficulty, generation_source, generation_reference
)
SELECT
    t.id,
    'What is the worst-case time complexity of Merge Sort?',
    'O(n)',
    'O(n log n)',
    'O(n^2)',
    'O(log n)',
    'B',
    'Merge Sort consistently divides the array into halves and merges them in linear time, yielding O(n log n) in all cases.',
    'EASY',
    'seed_script_v1',
    'DAA_ASYM_001'
FROM topics t
WHERE t.subject_code = 'CSE2034' AND t.name = 'Divide and Conquer'
ON DUPLICATE KEY UPDATE question_text = VALUES(question_text);

-- Question 5: Digital Logic Design
INSERT INTO questions (
    topic_id, question_text, option_a, option_b, option_c, option_d,
    correct_option, explanation, difficulty, generation_source, generation_reference
)
SELECT
    t.id,
    'Which flip-flop eliminates the invalid state present in an SR flip-flop when both inputs are 1?',
    'D flip-flop',
    'T flip-flop',
    'JK flip-flop',
    'Master-Slave SR flip-flop',
    'C',
    'In a JK flip-flop, when J=1 and K=1, the output toggles, successfully resolving the undefined state of an SR flip-flop.',
    'MEDIUM',
    'seed_script_v1',
    'DLD_SEQ_001'
FROM topics t
WHERE t.subject_code = 'ELX2705' AND t.name = 'Sequential Circuits and Flip-Flops'
ON DUPLICATE KEY UPDATE question_text = VALUES(question_text);
