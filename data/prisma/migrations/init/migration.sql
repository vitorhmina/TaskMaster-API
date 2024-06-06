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
    photo TEXT,
    user_type_id INTEGER REFERENCES user_types(id)
);

-- Create Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_end_date DATE,
    status TEXT NOT NULL
);

-- Create User Projects table
CREATE TABLE user_projects (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    rating DECIMAL(3, 1),
    user_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id)
);

-- Create Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_end_date DATE,
    status VARCHAR(50),
    project_id INTEGER REFERENCES projects(id)
);

-- Create User Tasks table
CREATE TABLE user_tasks (
    id SERIAL PRIMARY KEY,
    date DATE,
    location VARCHAR(255),
    completion_rate DECIMAL(5, 2),
    time_spent DECIMAL(5, 2),
    user_id INTEGER REFERENCES users(id),
    task_id INTEGER REFERENCES tasks(id)
);

-- Create Observations table
CREATE TABLE observations (
    id SERIAL PRIMARY KEY,
    comments TEXT NOT NULL,
    photo TEXT,
    task_id INTEGER REFERENCES tasks(id),
    user_id INTEGER REFERENCES users(id)
);

INSERT INTO user_types (user_type)
VALUES ('Administrator'), ('Project Manager'), ('User');

INSERT INTO users (email, password, name, user_type_id)
VALUES 
  ('admin@example.com', '$2a$08$Na8Jeugw5/qN0PlzTqg4U.U.DTPlyGO2IUJ8klFA9N.U80yGqpCJO', 'Admin Admin', 1),
  ('manager@example.com', '$2a$08$CERlfHwdas.lj6dL8bNS0Op/sP4o0XigQ94paoKeSloOk7AS/aCJW', 'Manager manager', 2),
  ('user1@example.com', '$2a$08$$2a$08$jl9.YEanVCfSRH1RwdbWdudS8FdCFAHPVACXUZMeZkOnAqHfTmjq6', 'User One', 3),
  ('user2@example.com', '$2a$08$6Htob5HxpwHThi8FfmfM.urFwsuNjrDv3yH4u1TIZmJnb6vqRjMb6', 'User Two', 3);

INSERT INTO projects (name, description, start_date, planned_end_date, actual_end_date, status)
VALUES 
  ('Project 1', 'Description for Project 1', '2024-04-30', '2024-06-30', NULL, 'Active'),
  ('Project 2', 'Description for Project 2', '2024-05-01', '2024-07-01', NULL, 'Inactive');

INSERT INTO user_projects (role, rating, user_id, project_id)
VALUES 
  ('Project Manager', NULL, 2, 1),
  ('Backend Developer', NULL, 3, 1),
  ('Fullstack Developer', NULL, 3, 2),
  ('Frontend Developer', NULL, 4, 1);

INSERT INTO tasks (name, description, start_date, planned_end_date, actual_end_date, status, project_id)
VALUES 
  ('Task 1', 'Description for Task 1', '2024-05-01', '2024-05-15', NULL, 'In Progress', 1),
  ('Task 2', 'Description for Task 2', '2024-05-05', '2024-05-20', '2024-05-22', 'Pending', 1),
  ('Task 3', 'Description for Task 3', '2024-05-10', '2024-05-25', '2024-05-25', 'Completed', 2);

  INSERT INTO user_tasks (date, location, completion_rate, time_spent, user_id, task_id)
VALUES 
  ('2024-05-01', 'Location for User Task 1', 80.5, 10.0, 3, 1),
  ('2024-05-05', 'Location for User Task 2', 60.0, 8.5, 3, 2),
  ('2024-05-10', 'Location for User Task 3', 100.0, 12.0, 4, 3);

INSERT INTO observations (comments, photo, task_id, user_id)
VALUES 
  ('Observation for Task 1', NULL, 1, 3),
  ('Observation for Task 2', NULL, 2, 3),
  ('Observation for Task 3', NULL, 3, 4);