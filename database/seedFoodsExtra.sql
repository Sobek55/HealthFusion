USE healthfusion;

-- ========================================
-- HEALTHFUSION EXPANDED FOOD LIBRARY
--
-- Global foods use:
-- created_by_user_id = NULL
--
-- Run this file ONCE.
-- ========================================

INSERT INTO Foods
(
    created_by_user_id,
    name,
    category,
    serving_size,
    serving_unit,
    calories,
    protein,
    carbs,
    fat
)
VALUES

-- ========================================
-- PROTEIN
-- ========================================

(NULL, 'Pork Tenderloin', 'Protein', 4, 'oz', 165, 26, 0, 6),
(NULL, 'Pork Chop', 'Protein', 4, 'oz', 210, 28, 0, 10),
(NULL, 'Cod', 'Protein', 4, 'oz', 100, 23, 0, 1),
(NULL, 'Tilapia', 'Protein', 4, 'oz', 110, 23, 0, 2),
(NULL, 'Mahi Mahi', 'Protein', 4, 'oz', 110, 24, 0, 1),
(NULL, 'Crab Meat', 'Protein', 4, 'oz', 110, 22, 0, 2),
(NULL, 'Scallops', 'Protein', 4, 'oz', 125, 24, 5, 1),
(NULL, 'Rotisserie Chicken', 'Protein', 4, 'oz', 190, 28, 0, 8),
(NULL, 'Deli Turkey', 'Protein', 4, 'oz', 120, 24, 4, 2),
(NULL, 'Deli Ham', 'Protein', 4, 'oz', 140, 20, 4, 5),
(NULL, 'Chicken Sausage', 'Protein', 1, 'link', 150, 14, 3, 9),
(NULL, 'Turkey Sausage', 'Protein', 1, 'link', 120, 13, 2, 7),
(NULL, 'Turkey Bacon', 'Protein', 2, 'slices', 70, 6, 1, 5),
(NULL, 'Canadian Bacon', 'Protein', 3, 'slices', 60, 10, 1, 2),
(NULL, 'Black Beans', 'Protein', 1, 'cup cooked', 227, 15, 41, 1),
(NULL, 'Kidney Beans', 'Protein', 1, 'cup cooked', 225, 15, 40, 1),
(NULL, 'Chickpeas', 'Protein', 1, 'cup cooked', 269, 15, 45, 4),
(NULL, 'Lentils', 'Protein', 1, 'cup cooked', 230, 18, 40, 1),
(NULL, 'Tempeh', 'Protein', 4, 'oz', 220, 21, 11, 12),
(NULL, 'Seitan', 'Protein', 4, 'oz', 140, 25, 12, 2),

-- ========================================
-- CARBS
-- ========================================

(NULL, 'Basmati Rice', 'Carbs', 1, 'cup cooked', 210, 4, 46, 1),
(NULL, 'Wild Rice', 'Carbs', 1, 'cup cooked', 166, 7, 35, 1),
(NULL, 'Couscous', 'Carbs', 1, 'cup cooked', 176, 6, 36, 0),
(NULL, 'Barley', 'Carbs', 1, 'cup cooked', 193, 4, 44, 1),
(NULL, 'Farro', 'Carbs', 1, 'cup cooked', 200, 7, 40, 2),
(NULL, 'English Muffin', 'Carbs', 1, 'muffin', 134, 5, 26, 1),
(NULL, 'Whole Wheat English Muffin', 'Carbs', 1, 'muffin', 120, 5, 23, 1),
(NULL, 'Pita Bread', 'Carbs', 1, 'pita', 165, 6, 33, 1),
(NULL, 'Whole Wheat Tortilla', 'Carbs', 1, 'medium tortilla', 130, 4, 22, 4),
(NULL, 'Corn Tortilla', 'Carbs', 2, 'tortillas', 104, 3, 22, 1),
(NULL, 'Hamburger Bun', 'Carbs', 1, 'bun', 140, 5, 26, 2),
(NULL, 'Hot Dog Bun', 'Carbs', 1, 'bun', 120, 4, 23, 2),
(NULL, 'Pancakes', 'Carbs', 2, 'medium pancakes', 175, 5, 28, 5),
(NULL, 'Waffle', 'Carbs', 1, 'waffle', 190, 5, 30, 6),
(NULL, 'Granola', 'Carbs', 0.5, 'cup', 225, 5, 40, 8),
(NULL, 'Corn Flakes', 'Carbs', 1, 'cup', 100, 2, 24, 0),
(NULL, 'Cheerios', 'Carbs', 1, 'cup', 140, 5, 29, 3),
(NULL, 'Rice Cereal', 'Carbs', 1, 'cup', 130, 2, 29, 0),
(NULL, 'Mashed Potatoes', 'Carbs', 1, 'cup', 210, 4, 35, 7),
(NULL, 'Roasted Potatoes', 'Carbs', 1, 'cup', 180, 4, 34, 5),

-- ========================================
-- FRUIT
-- ========================================

(NULL, 'Raspberries', 'Fruit', 1, 'cup', 64, 2, 15, 1),
(NULL, 'Blackberries', 'Fruit', 1, 'cup', 62, 2, 14, 1),
(NULL, 'Peach', 'Fruit', 1, 'medium', 59, 1, 14, 0),
(NULL, 'Pear', 'Fruit', 1, 'medium', 101, 1, 27, 0),
(NULL, 'Plum', 'Fruit', 1, 'medium', 30, 0, 8, 0),
(NULL, 'Cherries', 'Fruit', 1, 'cup', 97, 2, 25, 0),
(NULL, 'Cantaloupe', 'Fruit', 1, 'cup', 54, 1, 13, 0),
(NULL, 'Honeydew Melon', 'Fruit', 1, 'cup', 61, 1, 15, 0),
(NULL, 'Grapefruit', 'Fruit', 1, 'medium', 82, 2, 21, 0),
(NULL, 'Pomegranate Seeds', 'Fruit', 1, 'cup', 144, 3, 33, 2),
(NULL, 'Cranberries', 'Fruit', 1, 'cup', 46, 0, 12, 0),
(NULL, 'Applesauce', 'Fruit', 1, 'cup', 102, 0, 27, 0),
(NULL, 'Dried Cranberries', 'Fruit', 0.25, 'cup', 123, 0, 33, 0),
(NULL, 'Raisins', 'Fruit', 0.25, 'cup', 108, 1, 29, 0),

-- ========================================
-- VEGETABLES
-- ========================================

(NULL, 'Cauliflower', 'Vegetables', 1, 'cup', 27, 2, 5, 0),
(NULL, 'Brussels Sprouts', 'Vegetables', 1, 'cup', 56, 4, 11, 1),
(NULL, 'Zucchini', 'Vegetables', 1, 'cup', 21, 2, 4, 0),
(NULL, 'Cucumber', 'Vegetables', 1, 'cup', 16, 1, 4, 0),
(NULL, 'Tomato', 'Vegetables', 1, 'medium', 22, 1, 5, 0),
(NULL, 'Cherry Tomatoes', 'Vegetables', 1, 'cup', 27, 1, 6, 0),
(NULL, 'Mushrooms', 'Vegetables', 1, 'cup', 15, 2, 2, 0),
(NULL, 'Kale', 'Vegetables', 1, 'cup', 33, 2, 6, 1),
(NULL, 'Romaine Lettuce', 'Vegetables', 2, 'cups', 16, 1, 3, 0),
(NULL, 'Iceberg Lettuce', 'Vegetables', 2, 'cups', 20, 1, 4, 0),
(NULL, 'Cabbage', 'Vegetables', 1, 'cup', 22, 1, 5, 0),
(NULL, 'Red Onion', 'Vegetables', 1, 'medium', 44, 1, 10, 0),
(NULL, 'Yellow Onion', 'Vegetables', 1, 'medium', 44, 1, 10, 0),
(NULL, 'Celery', 'Vegetables', 2, 'stalks', 14, 1, 3, 0),
(NULL, 'Peas', 'Vegetables', 1, 'cup', 134, 9, 25, 0),
(NULL, 'Edamame', 'Vegetables', 1, 'cup', 188, 18, 14, 8),
(NULL, 'Butternut Squash', 'Vegetables', 1, 'cup', 82, 2, 22, 0),
(NULL, 'Spaghetti Squash', 'Vegetables', 1, 'cup', 42, 1, 10, 0),

-- ========================================
-- DAIRY
-- ========================================

(NULL, 'Low Fat Greek Yogurt', 'Dairy', 1, 'cup', 150, 20, 10, 4),
(NULL, 'Strawberry Greek Yogurt', 'Dairy', 1, 'cup', 160, 18, 19, 2),
(NULL, 'String Cheese', 'Dairy', 1, 'stick', 80, 7, 1, 6),
(NULL, 'Parmesan Cheese', 'Dairy', 1, 'oz', 111, 10, 1, 7),
(NULL, 'Feta Cheese', 'Dairy', 1, 'oz', 75, 4, 1, 6),
(NULL, 'Swiss Cheese', 'Dairy', 1, 'oz', 111, 8, 0, 9),
(NULL, 'Provolone Cheese', 'Dairy', 1, 'oz', 98, 7, 1, 7),
(NULL, 'Cream Cheese', 'Dairy', 2, 'tbsp', 100, 2, 2, 10),
(NULL, 'Ricotta Cheese', 'Dairy', 0.5, 'cup', 216, 14, 9, 14),
(NULL, 'Chocolate Milk', 'Dairy', 1, 'cup', 190, 8, 30, 5),
(NULL, 'Fairlife Style Protein Milk', 'Dairy', 1, 'cup', 120, 13, 6, 5),

-- ========================================
-- FATS
-- ========================================

(NULL, 'Walnuts', 'Fats', 1, 'oz', 185, 4, 4, 18),
(NULL, 'Pecans', 'Fats', 1, 'oz', 196, 3, 4, 20),
(NULL, 'Pistachios', 'Fats', 1, 'oz', 159, 6, 8, 13),
(NULL, 'Sunflower Seeds', 'Fats', 1, 'oz', 165, 6, 7, 14),
(NULL, 'Pumpkin Seeds', 'Fats', 1, 'oz', 160, 9, 4, 14),
(NULL, 'Chia Seeds', 'Fats', 2, 'tbsp', 138, 5, 12, 9),
(NULL, 'Flax Seeds', 'Fats', 2, 'tbsp', 110, 4, 6, 9),
(NULL, 'Tahini', 'Fats', 2, 'tbsp', 178, 5, 6, 16),
(NULL, 'Hummus', 'Fats', 2, 'tbsp', 70, 2, 4, 5),
(NULL, 'Mayonnaise', 'Fats', 1, 'tbsp', 94, 0, 0, 10),
(NULL, 'Light Mayonnaise', 'Fats', 1, 'tbsp', 35, 0, 1, 3),
(NULL, 'Ranch Dressing', 'Fats', 2, 'tbsp', 130, 1, 2, 13),
(NULL, 'Caesar Dressing', 'Fats', 2, 'tbsp', 140, 1, 2, 14),

-- ========================================
-- SNACKS
-- ========================================

(NULL, 'Beef Jerky', 'Snacks', 1, 'oz', 116, 9, 3, 7),
(NULL, 'Turkey Jerky', 'Snacks', 1, 'oz', 80, 11, 5, 2),
(NULL, 'Cheese Crackers', 'Snacks', 1, 'oz', 140, 3, 17, 7),
(NULL, 'Whole Grain Crackers', 'Snacks', 1, 'oz', 120, 3, 22, 3),
(NULL, 'Tortilla Chips', 'Snacks', 1, 'oz', 140, 2, 19, 7),
(NULL, 'Baked Potato Chips', 'Snacks', 1, 'oz', 120, 2, 23, 3),
(NULL, 'Potato Chips', 'Snacks', 1, 'oz', 152, 2, 15, 10),
(NULL, 'Pretzel Crisps', 'Snacks', 1, 'oz', 110, 3, 23, 1),
(NULL, 'Fruit Snacks', 'Snacks', 1, 'pack', 80, 0, 19, 0),
(NULL, 'Chocolate Pudding', 'Snacks', 1, 'cup', 150, 3, 27, 4),
(NULL, 'Vanilla Pudding', 'Snacks', 1, 'cup', 145, 3, 26, 4),
(NULL, 'Dark Chocolate', 'Snacks', 1, 'oz', 170, 2, 13, 12),
(NULL, 'Milk Chocolate', 'Snacks', 1, 'oz', 150, 2, 17, 9),
(NULL, 'Peanut Butter Crackers', 'Snacks', 1, 'pack', 200, 5, 24, 10),
(NULL, 'Greek Yogurt Bar', 'Snacks', 1, 'bar', 100, 5, 17, 2),

-- ========================================
-- DRINKS
-- ========================================

(NULL, 'Black Coffee', 'Drinks', 12, 'fl oz', 5, 0, 0, 0),
(NULL, 'Coffee With Cream', 'Drinks', 12, 'fl oz', 70, 1, 5, 5),
(NULL, 'Cafe Latte', 'Drinks', 12, 'fl oz', 150, 8, 14, 6),
(NULL, 'Iced Latte', 'Drinks', 16, 'fl oz', 180, 9, 18, 7),
(NULL, 'Cappuccino', 'Drinks', 12, 'fl oz', 120, 6, 10, 5),
(NULL, 'Fruit Smoothie', 'Drinks', 16, 'fl oz', 220, 5, 48, 2),
(NULL, 'Protein Smoothie', 'Drinks', 16, 'fl oz', 250, 30, 25, 5),
(NULL, 'Coconut Water', 'Drinks', 1, 'cup', 46, 2, 9, 0),
(NULL, 'Unsweetened Almond Milk', 'Drinks', 1, 'cup', 30, 1, 1, 3),
(NULL, 'Oat Milk', 'Drinks', 1, 'cup', 120, 3, 16, 5),
(NULL, 'Soy Milk', 'Drinks', 1, 'cup', 100, 7, 8, 4),
(NULL, 'Lemonade', 'Drinks', 12, 'fl oz', 150, 0, 39, 0),
(NULL, 'Sweet Tea', 'Drinks', 12, 'fl oz', 120, 0, 30, 0),
(NULL, 'Unsweetened Iced Tea', 'Drinks', 12, 'fl oz', 2, 0, 0, 0),
(NULL, 'Energy Drink', 'Drinks', 12, 'fl oz', 110, 0, 28, 0),
(NULL, 'Sugar Free Energy Drink', 'Drinks', 12, 'fl oz', 10, 0, 2, 0);