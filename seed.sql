INSERT INTO records (title, category, description, status)
SELECT seed.title, seed.category, seed.description, seed.status
FROM (
    VALUES
    (
        'Introduction to Programming',
        'Programming',
        'I need help understanding basic programming concepts and variables.',
        'Pending'
    ),
    (
        'Understanding Calculus',
        'Mathematics',
        'I need help understanding differentiation and integration.',
        'In progress'
    ),
    (
        'Database Design',
        'Databases',
        'I need help understanding database relationships and ER diagrams.',
        'Pending'
    ),
    (
        'HTML and CSS Basics',
        'Web Development',
        'I need help creating and styling web pages using HTML and CSS.',
        'Completed'
    ),
    (
        'JavaScript Functions',
        'Programming',
        'I need help understanding JavaScript functions and event handling.',
        'Pending'
    ),
    (
        'Linear Algebra',
        'Mathematics',
        'I need help understanding matrices, determinants and solving equations.',
        'In progress'
    ),
    (
        'SQL Queries',
        'Databases',
        'I need help understanding SQL queries.',
        'Pending'
    ),
    (
        'Computer Networking',
        'Computer Science',
        'I need help understanding networking fundamentals.',
        'Completed'
    )
) AS seed(title, category, description, status)
WHERE NOT EXISTS (
    SELECT 1
    FROM records
    WHERE records.title = seed.title
);
