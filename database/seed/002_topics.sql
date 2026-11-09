-- Seed topics catalogue for the 9 approved GD Goenka University subjects.
-- Uses INSERT IGNORE / ON DUPLICATE KEY UPDATE to allow idempotent execution.

USE adaptive_quiz;

INSERT INTO topics (subject_code, name, description) VALUES
    -- CSE2036: Programming using Java
    ('CSE2036', 'Object-Oriented Programming Fundamentals', 'Classes, objects, methods, constructors, and encapsulation.'),
    ('CSE2036', 'Inheritance and Polymorphism', 'Method overloading, overriding, abstract classes, and interfaces.'),
    ('CSE2036', 'Exception Handling', 'Try-catch-finally, checked vs unchecked exceptions, and custom exceptions.'),
    ('CSE2036', 'Java Collections Framework', 'Lists, sets, maps, queues, iterators, and generics.'),
    ('CSE2036', 'Multithreading and Concurrency', 'Threads, Runnable, synchronization, locks, and thread lifecycle.'),

    -- CSE2036L: Programming using Java Lab
    ('CSE2036L', 'Java Syntax and Control Flow Lab', 'Practical exercises on loops, branches, and arrays in Java.'),
    ('CSE2036L', 'Object Modeling Lab', 'Hands-on class hierarchy modeling and interface implementation.'),

    -- CSE2034: Introduction to Design and Analysis of Algorithms
    ('CSE2034', 'Asymptotic Notation and Recurrences', 'Big-O, Big-Omega, Big-Theta, Master Theorem, and substitution method.'),
    ('CSE2034', 'Divide and Conquer', 'Merge sort, quick sort, binary search, and recurrence relations.'),
    ('CSE2034', 'Greedy Algorithms', 'Fractional knapsack, Prim and Kruskal minimum spanning trees, Huffman coding.'),
    ('CSE2034', 'Dynamic Programming', '0/1 Knapsack, longest common subsequence, matrix chain multiplication.'),
    ('CSE2034', 'Graph Algorithms', 'BFS, DFS, Dijkstra single-source shortest path, Bellman-Ford.'),

    -- CSE2034L: DAA Lab
    ('CSE2034L', 'Sorting and Searching Implementations', 'Benchmarking and implementation of divide-and-conquer algorithms.'),
    ('CSE2034L', 'Graph Algorithms Implementation', 'Practical BFS, DFS, and shortest path graph algorithms.'),

    -- MAT1123: Discrete Mathematical Structures
    ('MAT1123', 'Propositional and Predicate Logic', 'Truth tables, logical equivalences, tautologies, and quantifiers.'),
    ('MAT1123', 'Set Theory and Relations', 'Sets, subsets, Cartesian products, equivalence relations, and partial orders.'),
    ('MAT1123', 'Functions and Counting Principles', 'Injections, surjections, bijections, pigeonhole principle, permutations.'),
    ('MAT1123', 'Graph Theory Basics', 'Eulerian and Hamiltonian paths, trees, graph coloring, and planar graphs.'),

    -- MAT1123L: Discrete Mathematical Structures Lab
    ('MAT1123L', 'Computational Logic Lab', 'Boolean algebra simplification and combinatorial programming exercises.'),

    -- ELX2705: Digital Logic Design
    ('ELX2705', 'Number Systems and Boolean Algebra', 'Binary, octal, hex conversion, logic gates, and Boolean simplification.'),
    ('ELX2705', 'Karnaugh Maps and Combinational Logic', 'K-maps, multiplexers, decoders, encoders, and adders/subtractors.'),
    ('ELX2705', 'Sequential Circuits and Flip-Flops', 'SR, JK, D, T flip-flops, state diagrams, counters, and registers.'),

    -- COM2521: Academic Writing
    ('COM2521', 'Research Methodology and Referencing', 'Literature reviews, APA/IEEE citation styles, and plagiarism ethics.'),
    ('COM2521', 'Technical Report Structure', 'Abstract, problem statement, methodology, results, and discussion.'),

    -- UHV2701: Universal Human Values II
    ('UHV2701', 'Self-Exploration and Human Goals', 'Harmony in the human being, natural acceptance, and universal values.'),
    ('UHV2701', 'Harmony in Family and Society', 'Trust, respect, and foundational values in human relationships.')
ON DUPLICATE KEY UPDATE description = VALUES(description);
