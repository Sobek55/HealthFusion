CREATE DATABASE IF NOT EXISTS healthfusion;

USE healthfusion;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE User_Profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    age INT,
    height DECIMAL(5,2),
    weight DECIMAL(6,2),
    activity_level VARCHAR(50),

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Nutrition_Goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    calorie_goal INT,
    protein_goal DECIMAL(6,2),
    carb_goal DECIMAL(6,2),
    fat_goal DECIMAL(6,2),

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Foods (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    serving_size DECIMAL(8,2) NOT NULL,
    serving_unit VARCHAR(30) NOT NULL,
    calories DECIMAL(8,2) NOT NULL,
    protein DECIMAL(8,2) DEFAULT 0,
    carbs DECIMAL(8,2) DEFAULT 0,
    fat DECIMAL(8,2) DEFAULT 0
);

CREATE TABLE Meals (
    meal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Meal_Items (
    meal_item_id INT AUTO_INCREMENT PRIMARY KEY,
    meal_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity DECIMAL(8,2) NOT NULL DEFAULT 1,

    FOREIGN KEY (meal_id)
        REFERENCES Meals(meal_id)
        ON DELETE CASCADE,

    FOREIGN KEY (food_id)
        REFERENCES Foods(food_id)
        ON DELETE CASCADE
);

CREATE TABLE Meal_Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_id INT NOT NULL,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (meal_id)
        REFERENCES Meals(meal_id)
        ON DELETE CASCADE
);