USE healthfusion;

-- ========================================
-- HEALTHFUSION DEFAULT FOOD LIBRARY
--
-- created_by_user_id is NULL because these
-- foods are available to every account.
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

(
    NULL,
    'Chicken Breast',
    'Protein',
    4,
    'oz',
    187,
    35,
    0,
    4
),

(
    NULL,
    'Chicken Thigh',
    'Protein',
    4,
    'oz',
    232,
    28,
    0,
    13
),

(
    NULL,
    'Ground Turkey',
    'Protein',
    4,
    'oz',
    170,
    22,
    0,
    8
),

(
    NULL,
    'Turkey Breast',
    'Protein',
    4,
    'oz',
    135,
    26,
    0,
    2
),

(
    NULL,
    'Lean Ground Beef',
    'Protein',
    4,
    'oz',
    200,
    23,
    0,
    11
),

(
    NULL,
    'Sirloin Steak',
    'Protein',
    4,
    'oz',
    230,
    30,
    0,
    12
),

(
    NULL,
    'Salmon',
    'Protein',
    4,
    'oz',
    233,
    25,
    0,
    14
),

(
    NULL,
    'Tuna',
    'Protein',
    4,
    'oz',
    130,
    29,
    0,
    1
),

(
    NULL,
    'Shrimp',
    'Protein',
    4,
    'oz',
    120,
    23,
    1,
    2
),

(
    NULL,
    'Egg',
    'Protein',
    1,
    'large egg',
    72,
    6,
    0,
    5
),

(
    NULL,
    'Egg Whites',
    'Protein',
    3,
    'egg whites',
    51,
    11,
    1,
    0
),

(
    NULL,
    'Tofu',
    'Protein',
    4,
    'oz',
    95,
    10,
    2,
    6
),

-- ========================================
-- CARBS
-- ========================================

(
    NULL,
    'White Rice',
    'Carbs',
    1,
    'cup cooked',
    205,
    4,
    45,
    0
),

(
    NULL,
    'Brown Rice',
    'Carbs',
    1,
    'cup cooked',
    216,
    5,
    45,
    2
),

(
    NULL,
    'Jasmine Rice',
    'Carbs',
    1,
    'cup cooked',
    205,
    4,
    45,
    0
),

(
    NULL,
    'Quinoa',
    'Carbs',
    1,
    'cup cooked',
    222,
    8,
    39,
    4
),

(
    NULL,
    'Pasta',
    'Carbs',
    1,
    'cup cooked',
    220,
    8,
    43,
    1
),

(
    NULL,
    'Whole Wheat Pasta',
    'Carbs',
    1,
    'cup cooked',
    174,
    7,
    37,
    1
),

(
    NULL,
    'Oatmeal',
    'Carbs',
    1,
    'cup cooked',
    154,
    6,
    27,
    3
),

(
    NULL,
    'Sweet Potato',
    'Carbs',
    1,
    'medium',
    112,
    2,
    26,
    0
),

(
    NULL,
    'Russet Potato',
    'Carbs',
    1,
    'medium',
    168,
    5,
    37,
    0
),

(
    NULL,
    'Whole Wheat Bread',
    'Carbs',
    1,
    'slice',
    81,
    4,
    14,
    1
),

(
    NULL,
    'White Bread',
    'Carbs',
    1,
    'slice',
    79,
    3,
    15,
    1
),

(
    NULL,
    'Flour Tortilla',
    'Carbs',
    1,
    'medium tortilla',
    140,
    4,
    24,
    4
),

(
    NULL,
    'Bagel',
    'Carbs',
    1,
    'medium bagel',
    277,
    11,
    55,
    2
),

-- ========================================
-- FRUIT
-- ========================================

(
    NULL,
    'Banana',
    'Fruit',
    1,
    'medium',
    105,
    1,
    27,
    0
),

(
    NULL,
    'Apple',
    'Fruit',
    1,
    'medium',
    95,
    1,
    25,
    0
),

(
    NULL,
    'Orange',
    'Fruit',
    1,
    'medium',
    62,
    1,
    15,
    0
),

(
    NULL,
    'Blueberries',
    'Fruit',
    1,
    'cup',
    84,
    1,
    21,
    0
),

(
    NULL,
    'Strawberries',
    'Fruit',
    1,
    'cup',
    49,
    1,
    12,
    0
),

(
    NULL,
    'Grapes',
    'Fruit',
    1,
    'cup',
    104,
    1,
    27,
    0
),

(
    NULL,
    'Pineapple',
    'Fruit',
    1,
    'cup',
    82,
    1,
    22,
    0
),

(
    NULL,
    'Mango',
    'Fruit',
    1,
    'cup',
    99,
    1,
    25,
    1
),

(
    NULL,
    'Kiwi',
    'Fruit',
    1,
    'medium',
    42,
    1,
    10,
    0
),

(
    NULL,
    'Watermelon',
    'Fruit',
    1,
    'cup',
    46,
    1,
    12,
    0
),

-- ========================================
-- VEGETABLES
-- ========================================

(
    NULL,
    'Broccoli',
    'Vegetables',
    1,
    'cup',
    55,
    4,
    11,
    1
),

(
    NULL,
    'Spinach',
    'Vegetables',
    1,
    'cup',
    7,
    1,
    1,
    0
),

(
    NULL,
    'Green Beans',
    'Vegetables',
    1,
    'cup',
    44,
    2,
    10,
    0
),

(
    NULL,
    'Carrots',
    'Vegetables',
    1,
    'cup',
    52,
    1,
    12,
    0
),

(
    NULL,
    'Bell Pepper',
    'Vegetables',
    1,
    'medium',
    31,
    1,
    7,
    0
),

(
    NULL,
    'Asparagus',
    'Vegetables',
    1,
    'cup',
    27,
    3,
    5,
    0
),

(
    NULL,
    'Mixed Vegetables',
    'Vegetables',
    1,
    'cup',
    80,
    4,
    16,
    1
),

(
    NULL,
    'Corn',
    'Vegetables',
    1,
    'cup',
    143,
    5,
    31,
    2
),

-- ========================================
-- DAIRY
-- ========================================

(
    NULL,
    'Greek Yogurt',
    'Dairy',
    1,
    'cup',
    130,
    23,
    9,
    0
),

(
    NULL,
    'Vanilla Greek Yogurt',
    'Dairy',
    1,
    'cup',
    170,
    20,
    18,
    2
),

(
    NULL,
    'Cottage Cheese',
    'Dairy',
    1,
    'cup',
    206,
    28,
    8,
    9
),

(
    NULL,
    'Whole Milk',
    'Dairy',
    1,
    'cup',
    149,
    8,
    12,
    8
),

(
    NULL,
    '2% Milk',
    'Dairy',
    1,
    'cup',
    122,
    8,
    12,
    5
),

(
    NULL,
    'Skim Milk',
    'Dairy',
    1,
    'cup',
    83,
    8,
    12,
    0
),

(
    NULL,
    'Cheddar Cheese',
    'Dairy',
    1,
    'oz',
    114,
    7,
    0,
    9
),

(
    NULL,
    'Mozzarella Cheese',
    'Dairy',
    1,
    'oz',
    85,
    6,
    1,
    6
),

-- ========================================
-- FATS
-- ========================================

(
    NULL,
    'Avocado',
    'Fats',
    0.5,
    'avocado',
    120,
    2,
    6,
    11
),

(
    NULL,
    'Peanut Butter',
    'Fats',
    2,
    'tbsp',
    190,
    8,
    7,
    16
),

(
    NULL,
    'Almond Butter',
    'Fats',
    2,
    'tbsp',
    196,
    7,
    7,
    18
),

(
    NULL,
    'Almonds',
    'Fats',
    1,
    'oz',
    164,
    6,
    6,
    14
),

(
    NULL,
    'Cashews',
    'Fats',
    1,
    'oz',
    157,
    5,
    9,
    12
),

(
    NULL,
    'Olive Oil',
    'Fats',
    1,
    'tbsp',
    119,
    0,
    0,
    14
),

-- ========================================
-- SNACKS
-- ========================================

(
    NULL,
    'Protein Bar',
    'Snacks',
    1,
    'bar',
    200,
    20,
    22,
    7
),

(
    NULL,
    'Granola Bar',
    'Snacks',
    1,
    'bar',
    150,
    3,
    27,
    4
),

(
    NULL,
    'Rice Cake',
    'Snacks',
    1,
    'cake',
    35,
    1,
    7,
    0
),

(
    NULL,
    'Popcorn',
    'Snacks',
    3,
    'cups',
    93,
    3,
    19,
    1
),

(
    NULL,
    'Pretzels',
    'Snacks',
    1,
    'oz',
    108,
    3,
    23,
    1
),

(
    NULL,
    'Trail Mix',
    'Snacks',
    0.25,
    'cup',
    170,
    5,
    15,
    11
),

-- ========================================
-- DRINKS
-- ========================================

(
    NULL,
    'Whey Protein Shake',
    'Drinks',
    1,
    'shake',
    130,
    25,
    4,
    2
),

(
    NULL,
    'Chocolate Protein Shake',
    'Drinks',
    1,
    'shake',
    160,
    30,
    7,
    3
),

(
    NULL,
    'Sports Drink',
    'Drinks',
    20,
    'fl oz',
    130,
    0,
    34,
    0
),

(
    NULL,
    'Orange Juice',
    'Drinks',
    1,
    'cup',
    112,
    2,
    26,
    0
),

(
    NULL,
    'Apple Juice',
    'Drinks',
    1,
    'cup',
    114,
    0,
    28,
    0
);