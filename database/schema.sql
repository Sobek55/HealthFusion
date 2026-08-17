CREATE DATABASE IF NOT EXISTS healthfusion;

USE healthfusion;

-- ========================================
-- USERS
-- ========================================

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- USER PROFILES
-- ========================================

CREATE TABLE User_Profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    age INT,
    height DECIMAL(5,2),
    weight DECIMAL(6,2),
    target_weight DECIMAL(6,2),
    health_goal VARCHAR(50),
    activity_level VARCHAR(50),
    dietary_preferences TEXT,
    food_restrictions TEXT,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);

-- ========================================
-- NUTRITION GOALS
-- ========================================

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

-- ========================================
-- FOODS
-- ========================================

CREATE TABLE Foods (
    food_id INT AUTO_INCREMENT PRIMARY KEY,

    created_by_user_id INT NULL,

    name VARCHAR(150) NOT NULL,

    category VARCHAR(30)
        NOT NULL
        DEFAULT 'Other',

    serving_size DECIMAL(8,2)
        NOT NULL,

    serving_unit VARCHAR(30)
        NOT NULL,

    calories DECIMAL(8,2)
        NOT NULL,

    protein DECIMAL(8,2)
        NOT NULL
        DEFAULT 0,

    carbs DECIMAL(8,2)
        NOT NULL
        DEFAULT 0,

    fat DECIMAL(8,2)
        NOT NULL
        DEFAULT 0,

    FOREIGN KEY (
        created_by_user_id
    )
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    INDEX idx_food_name (
        name
    ),

    INDEX idx_food_category (
        category
    ),

    INDEX idx_food_creator (
        created_by_user_id
    )
);

-- ========================================
-- MEALS
-- ========================================

CREATE TABLE Meals (
    meal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    meal_name VARCHAR(150)
        NOT NULL,

    meal_type VARCHAR(20),

    meal_date DATE,

    serving_size DECIMAL(8,2),

    serving_unit VARCHAR(30),

    calories DECIMAL(8,2),

    protein DECIMAL(8,2),

    carbs DECIMAL(8,2),

    fat DECIMAL(8,2),

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    INDEX idx_meal_user (
        user_id
    ),

    INDEX idx_meal_date (
        meal_date
    ),

    INDEX idx_meal_type (
        meal_type
    )
);

-- ========================================
-- MEAL ITEMS
-- ========================================

CREATE TABLE Meal_Items (
    meal_item_id INT
        AUTO_INCREMENT
        PRIMARY KEY,

    meal_id INT NOT NULL,

    food_id INT NOT NULL,

    quantity DECIMAL(8,2)
        NOT NULL
        DEFAULT 1,

    FOREIGN KEY (meal_id)
        REFERENCES Meals(meal_id)
        ON DELETE CASCADE,

    FOREIGN KEY (food_id)
        REFERENCES Foods(food_id)
        ON DELETE CASCADE
);

-- ========================================
-- MEAL LOGS
-- ========================================

CREATE TABLE Meal_Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    meal_id INT NOT NULL,

    logged_at DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (meal_id)
        REFERENCES Meals(meal_id)
        ON DELETE CASCADE,

    INDEX idx_meal_log_user (
        user_id
    ),

    INDEX idx_meal_log_date (
        logged_at
    )
);

-- ========================================
-- DIET PLANS
-- ========================================

CREATE TABLE Diet_Plans (
    diet_plan_id INT
        AUTO_INCREMENT
        PRIMARY KEY,

    user_id INT
        NOT NULL
        UNIQUE,

    plan_type VARCHAR(20)
        NOT NULL,

    preset_key VARCHAR(50),

    plan_name VARCHAR(100)
        NOT NULL,

    description TEXT,

    primary_goal VARCHAR(50),

    current_weight DECIMAL(6,2),

    target_weight DECIMAL(6,2),

    activity_level VARCHAR(50),

    dietary_preferences TEXT,

    food_restrictions TEXT,

    calorie_target INT,

    protein_target DECIMAL(6,2),

    carb_target DECIMAL(6,2),

    fat_target DECIMAL(6,2),

    confirmed BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);

-- ========================================
-- WEIGHT HISTORY
-- ========================================

CREATE TABLE Weight_History (
    weight_entry_id INT
        AUTO_INCREMENT
        PRIMARY KEY,

    user_id INT NOT NULL,

    weight DECIMAL(6,2)
        NOT NULL,

    recorded_date DATE
        NOT NULL,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    UNIQUE KEY
        unique_user_weight_date (
            user_id,
            recorded_date
        ),

    INDEX idx_weight_user (
        user_id
    ),

    INDEX idx_weight_date (
        recorded_date
    )
);