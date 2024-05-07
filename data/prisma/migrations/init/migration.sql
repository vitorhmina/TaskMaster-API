-- Create User Type table
CREATE TABLE user_types (
    id SERIAL PRIMARY KEY,
    user_type TEXT NOT NULL UNIQUE
);

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    photo BYTEA,
    user_type_id INTEGER REFERENCES user_types(id)
);

-- Create Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL
);

-- Create User Projects table
CREATE TABLE user_projects (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    rating INTEGER,
    user_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id)
);

-- Create Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    scheduled_end_date DATE,
    conclusion_date DATE,
    status VARCHAR(50),
    project_id INTEGER REFERENCES projects(id)
);

-- Create User Tasks table
CREATE TABLE user_tasks (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    completion_rate DECIMAL(5, 2) NOT NULL,
    time_spent DATE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    task_id INTEGER REFERENCES tasks(id)
);

-- Create Observations table
CREATE TABLE observations (
    id SERIAL PRIMARY KEY,
    comments TEXT NOT NULL,
    photo_url BYTEA,
    task_id INTEGER REFERENCES tasks(id),
    user_id INTEGER REFERENCES users(id)
);

INSERT INTO user_types (user_type)
VALUES ('Administrator'), ('Project Manager'), ('User');

INSERT INTO users (email, password, name, user_type_id)
VALUES ('admin@example.com', '$2a$08$Na8Jeugw5/qN0PlzTqg4U.U.DTPlyGO2IUJ8klFA9N.U80yGqpCJO', 'Admin Admin', 1);

