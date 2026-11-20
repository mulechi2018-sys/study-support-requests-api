CREATE TABLE IF NOT EXISTS records (
    id SERIAL PRIMARY KEY,
    title VARCHAR(80) NOT NULL,
    category VARCHAR(40) NOT NULL,
    description VARCHAR(300) NOT NULL,
    status VARCHAR(20) NOT NULL,

    CONSTRAINT valid_title
        CHECK (LENGTH(TRIM(title)) BETWEEN 3 AND 80),

    CONSTRAINT valid_category
        CHECK (LENGTH(TRIM(category)) BETWEEN 2 AND 40),

    CONSTRAINT valid_description
        CHECK (LENGTH(TRIM(description)) BETWEEN 5 AND 300),

    CONSTRAINT valid_status
        CHECK (status IN ('Pending', 'In progress', 'Completed'))
);