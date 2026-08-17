import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  getFoods,
  searchFoods,
  createFood,
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
  logMeal,
  getTodayMealLogs,
  deleteMealLog
} from '../services/api'

const MEAL_TYPES = [
  'Breakfast',
  'Brunch',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
  'Pre-Workout',
  'Post-Workout',
  'Shake/Drink'
]

const FOOD_CATEGORIES = [
  'All',
  'Protein',
  'Carbs',
  'Fruit',
  'Vegetables',
  'Dairy',
  'Fats',
  'Snacks',
  'Drinks'
]

const CUSTOM_FOOD_CATEGORIES =
  FOOD_CATEGORIES.filter(
    (category) =>
      category !== 'All'
  )

const getTodayDate = () => {
  const now = new Date()

  const year =
    now.getFullYear()

  const month = String(
    now.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    now.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const toDateInputValue = (
  value
) => {
  if (!value) {
    return ''
  }

  if (
    typeof value ===
      'string' &&
    /^\d{4}-\d{2}-\d{2}/.test(
      value
    )
  ) {
    return value.slice(
      0,
      10
    )
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return ''
  }

  const year =
    date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const displayMealDate = (
  value
) => {
  const dateValue =
    toDateInputValue(value)

  if (!dateValue) {
    return 'No date'
  }

  const [
    year,
    month,
    day
  ] = dateValue.split('-')

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString()
}

function Meals() {
  const [
    mealName,
    setMealName
  ] = useState('')

  const [
    entryMode,
    setEntryMode
  ] = useState('manual')

  const [
    mealType,
    setMealType
  ] = useState('')

  const [
    mealDate,
    setMealDate
  ] = useState(
    getTodayDate()
  )

  const [
    manualMeal,
    setManualMeal
  ] = useState({
    servingSize: '',
    servingUnit:
      'serving',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  })

  const [
    filterDate,
    setFilterDate
  ] = useState('')

  const [
    filterMealType,
    setFilterMealType
  ] = useState('All')

  const [
    searchTerm,
    setSearchTerm
  ] = useState('')

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState('All')

  const [
    showCustomFood,
    setShowCustomFood
  ] = useState(false)

  const [
    customFood,
    setCustomFood
  ] = useState({
    name: '',
    category:
      'Protein',
    servingSize: '',
    servingUnit:
      'serving',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  })

  const [
    savingCustomFood,
    setSavingCustomFood
  ] = useState(false)

  const [
    foods,
    setFoods
  ] = useState([])

  const [
    mealItems,
    setMealItems
  ] = useState([])

  const [
    savedMeals,
    setSavedMeals
  ] = useState([])

  const [
    todayLogs,
    setTodayLogs
  ] = useState([])

  const [
    editingMealId,
    setEditingMealId
  ] = useState(null)

  const [
    loadingFoods,
    setLoadingFoods
  ] = useState(true)

  const [
    loadingMeals,
    setLoadingMeals
  ] = useState(true)

  const [
    loadingLogs,
    setLoadingLogs
  ] = useState(true)

  const [
    saving,
    setSaving
  ] = useState(false)

  const [
    loggingMealId,
    setLoggingMealId
  ] = useState(null)

  const [
    error,
    setError
  ] = useState('')

  const [
    success,
    setSuccess
  ] = useState('')

  useEffect(() => {
    loadFoods()
    loadMeals()
    loadTodayLogs()
  }, [])

  const loadFoods =
    async (
      category =
        selectedCategory,
      term =
        searchTerm.trim()
    ) => {
      try {
        setLoadingFoods(true)

        let data

        if (term) {
          data =
            await searchFoods(
              term,
              category
            )
        } else {
          data =
            await getFoods(
              category
            )
        }

        setFoods(
          data.foods || []
        )
      } catch (error) {
        setError(
          error.message
        )
      } finally {
        setLoadingFoods(false)
      }
    }

  const loadMeals =
    async () => {
      try {
        setLoadingMeals(true)

        const data =
          await getMeals()

        setSavedMeals(
          data.meals || []
        )
      } catch (error) {
        setError(
          error.message
        )
      } finally {
        setLoadingMeals(false)
      }
    }

  const loadTodayLogs =
    async () => {
      try {
        setLoadingLogs(true)

        const data =
          await getTodayMealLogs()

        setTodayLogs(
          data.logs || []
        )
      } catch (error) {
        setError(
          error.message
        )
      } finally {
        setLoadingLogs(false)
      }
    }

  const handleSearch =
    async (event) => {
      event.preventDefault()

      setError('')
      setSuccess('')

      await loadFoods(
        selectedCategory,
        searchTerm.trim()
      )
    }

  const handleCategoryChange =
    async (category) => {
      setSelectedCategory(
        category
      )

      setError('')
      setSuccess('')

      await loadFoods(
        category,
        searchTerm.trim()
      )
    }

  const handleCustomFoodChange =
    (event) => {
      const {
        name,
        value
      } = event.target

      setCustomFood(
        (current) => ({
          ...current,
          [name]: value
        })
      )
    }

  const resetCustomFood = () => {
    setCustomFood({
      name: '',
      category:
        'Protein',
      servingSize: '',
      servingUnit:
        'serving',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    })
  }

  const handleCreateCustomFood =
    async (event) => {
      event.preventDefault()

      setError('')
      setSuccess('')

      if (
        !customFood.name.trim()
      ) {
        setError(
          'Custom food name is required.'
        )

        return
      }

      if (
        !customFood.category
      ) {
        setError(
          'Please select a food category.'
        )

        return
      }

      if (
        !Number.isFinite(
          Number(
            customFood.servingSize
          )
        ) ||
        Number(
          customFood.servingSize
        ) <= 0
      ) {
        setError(
          'Serving size must be greater than zero.'
        )

        return
      }

      if (
        !customFood
          .servingUnit
          .trim()
      ) {
        setError(
          'Serving unit is required.'
        )

        return
      }

      const fields = [
        [
          'Calories',
          customFood.calories
        ],
        [
          'Protein',
          customFood.protein
        ],
        [
          'Carbohydrates',
          customFood.carbs
        ],
        [
          'Fat',
          customFood.fat
        ]
      ]

      for (
        const [
          label,
          value
        ] of fields
      ) {
        if (
          value === '' ||
          !Number.isFinite(
            Number(value)
          ) ||
          Number(value) < 0
        ) {
          setError(
            `${label} must be zero or greater.`
          )

          return
        }
      }

      try {
        setSavingCustomFood(
          true
        )

        const data =
          await createFood({
            name:
              customFood
                .name
                .trim(),

            category:
              customFood
                .category,

            servingSize:
              Number(
                customFood
                  .servingSize
              ),

            servingUnit:
              customFood
                .servingUnit
                .trim(),

            calories:
              Number(
                customFood
                  .calories
              ),

            protein:
              Number(
                customFood
                  .protein
              ),

            carbs:
              Number(
                customFood
                  .carbs
              ),

            fat:
              Number(
                customFood
                  .fat
              )
          })

        setSuccess(
          data.message ||
            'Custom food created successfully.'
        )

        const category =
          customFood.category

        resetCustomFood()

        setShowCustomFood(
          false
        )

        setSelectedCategory(
          category
        )

        setSearchTerm('')

        await loadFoods(
          category,
          ''
        )
      } catch (error) {
        setError(
          error.message
        )
      } finally {
        setSavingCustomFood(
          false
        )
      }
    }

  const addFood = (
    food
  ) => {
    setError('')
    setSuccess('')

    setMealItems(
      (currentItems) => {
        const existing =
          currentItems.find(
            (item) =>
              item.food
                .food_id ===
              food.food_id
          )

        if (existing) {
          return currentItems.map(
            (item) =>
              item.food
                .food_id ===
              food.food_id
                ? {
                    ...item,

                    quantity:
                      Number(
                        item.quantity
                      ) + 1
                  }
                : item
          )
        }

        return [
          ...currentItems,
          {
            food,
            quantity: 1
          }
        ]
      }
    )
  }

  const updateQuantity = (
    foodId,
    value
  ) => {
    const quantity =
      Number(value)

    if (
      !Number.isFinite(
        quantity
      ) ||
      quantity <= 0
    ) {
      return
    }

    setMealItems(
      (items) =>
        items.map(
          (item) =>
            item.food
              .food_id ===
            foodId
              ? {
                  ...item,
                  quantity
                }
              : item
        )
    )
  }

  const removeFood = (
    foodId
  ) => {
    setMealItems(
      (items) =>
        items.filter(
          (item) =>
            item.food
              .food_id !==
            foodId
        )
    )
  }

  const totals =
    useMemo(() => {
      return mealItems.reduce(
        (total, item) => {
          const quantity =
            Number(
              item.quantity
            )

          total.calories +=
            Number(
              item.food.calories
            ) * quantity

          total.protein +=
            Number(
              item.food.protein
            ) * quantity

          total.carbs +=
            Number(
              item.food.carbs
            ) * quantity

          total.fat +=
            Number(
              item.food.fat
            ) * quantity

          return total
        },
        {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      )
    }, [mealItems])

  const todayTotals =
    useMemo(() => {
      return todayLogs.reduce(
        (total, log) => {
          total.calories +=
            Number(
              log.calories
            )

          total.protein +=
            Number(
              log.protein
            )

          total.carbs +=
            Number(
              log.carbs
            )

          total.fat +=
            Number(
              log.fat
            )

          return total
        },
        {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      )
    }, [todayLogs])

  const filteredMeals =
    useMemo(() => {
      return savedMeals.filter(
        (meal) => {
          const typeMatches =
            filterMealType ===
              'All' ||
            meal.meal_type ===
              filterMealType

          const dateMatches =
            !filterDate ||
            toDateInputValue(
              meal.meal_date
            ) === filterDate

          return (
            typeMatches &&
            dateMatches
          )
        }
      )
    }, [
      savedMeals,
      filterMealType,
      filterDate
    ])

  const resetBuilder = () => {
    setMealName('')
    setMealType('')
    setMealDate(
      getTodayDate()
    )

    setMealItems([])

    setEditingMealId(
      null
    )

    setEntryMode(
      'manual'
    )

    setManualMeal({
      servingSize: '',
      servingUnit:
        'serving',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    })
  }

  const handleManualChange =
    (event) => {
      const {
        name,
        value
      } = event.target

      setManualMeal(
        (current) => ({
          ...current,
          [name]: value
        })
      )
    }

  const handleSaveMeal =
    async () => {
      setError('')
      setSuccess('')

      if (
        !mealName.trim()
      ) {
        setError(
          'Please enter a meal name.'
        )

        return
      }

      if (!mealType) {
        setError(
          'Please select a meal type.'
        )

        return
      }

      if (!mealDate) {
        setError(
          'Please select a meal date.'
        )

        return
      }

      let mealData

      if (
        entryMode ===
        'builder'
      ) {
        if (
          mealItems.length ===
          0
        ) {
          setError(
            'Add at least one food to your meal.'
          )

          return
        }

        mealData = {
          entryMode:
            'builder',

          mealName:
            mealName.trim(),

          mealType,
          mealDate,

          items:
            mealItems.map(
              (item) => ({
                foodId:
                  item.food
                    .food_id,

                quantity:
                  Number(
                    item.quantity
                  )
              })
            )
        }
      } else {
        const {
          servingSize,
          servingUnit,
          calories,
          protein,
          carbs,
          fat
        } = manualMeal

        if (
          servingSize === '' ||
          !Number.isFinite(
            Number(
              servingSize
            )
          ) ||
          Number(
            servingSize
          ) <= 0
        ) {
          setError(
            'Serving size must be greater than zero.'
          )

          return
        }

        const nutrition =
          [
            [
              'Calories',
              calories
            ],
            [
              'Protein',
              protein
            ],
            [
              'Carbohydrates',
              carbs
            ],
            [
              'Fat',
              fat
            ]
          ]

        for (
          const [
            label,
            value
          ] of nutrition
        ) {
          if (
            value === '' ||
            !Number.isFinite(
              Number(value)
            ) ||
            Number(value) < 0
          ) {
            setError(
              `${label} must be zero or greater.`
            )

            return
          }
        }

        mealData = {
          entryMode:
            'manual',

          mealName:
            mealName.trim(),

          mealType,
          mealDate,

          servingSize:
            Number(
              servingSize
            ),

          servingUnit:
            servingUnit.trim() ||
            'serving',

          calories:
            Number(calories),

          protein:
            Number(protein),

          carbs:
            Number(carbs),

          fat:
            Number(fat)
        }
      }

      try {
        setSaving(true)

        if (
          editingMealId
        ) {
          await updateMeal(
            editingMealId,
            mealData
          )

          setSuccess(
            'Meal updated successfully.'
          )
        } else {
          await createMeal(
            mealData
          )

          setSuccess(
            'Meal saved successfully.'
          )
        }

        resetBuilder()

        await loadMeals()
        await loadTodayLogs()
      } catch (error) {
        setError(
          error.message
        )
      } finally {
        setSaving(false)
      }
    }

  const handleEditMeal =
    async (mealId) => {
      try {
        setError('')
        setSuccess('')

        const data =
          await getMeal(
            mealId
          )

        const meal =
          data.meal

        setEditingMealId(
          meal.meal_id
        )

        setMealName(
          meal.meal_name ||
            ''
        )

        setMealType(
          meal.meal_type ||
            ''
        )

        setMealDate(
          toDateInputValue(
            meal.meal_date
          ) ||
            getTodayDate()
        )

        const isManual =
          meal.calories !==
            null &&
          meal.calories !==
            undefined

        if (isManual) {
          setEntryMode(
            'manual'
          )

          setMealItems([])

          setManualMeal({
            servingSize:
              meal.serving_size ??
              '',

            servingUnit:
              meal.serving_unit ||
              'serving',

            calories:
              meal.calories ??
              '',

            protein:
              meal.protein ??
              '',

            carbs:
              meal.carbs ??
              '',

            fat:
              meal.fat ??
              ''
          })
        } else {
          setEntryMode(
            'builder'
          )

          setMealItems(
            (
              meal.items ||
              []
            ).map(
              (item) => ({
                food: {
                  food_id:
                    item.food_id,

                  name:
                    item.name,

                  category:
                    item.category,

                  serving_size:
                    item.serving_size,

                  serving_unit:
                    item.serving_unit,

                  calories:
                    item.calories,

                  protein:
                    item.protein,

                  carbs:
                    item.carbs,

                  fat:
                    item.fat
                },

                quantity:
                  Number(
                    item.quantity
                  )
              })
            )
          )
        }

        window.scrollTo({
          top: 0,
          behavior:
            'smooth'
        })
      } catch (error) {
        setError(
          error.message
        )
      }
    }

  const handleDeleteMeal =
    async (mealId) => {
      if (
        !window.confirm(
          'Are you sure you want to delete this meal?'
        )
      ) {
        return
      }

      try {
        await deleteMeal(
          mealId
        )

        if (
          editingMealId ===
          mealId
        ) {
          resetBuilder()
        }

        setSuccess(
          'Meal deleted successfully.'
        )

        await loadMeals()
        await loadTodayLogs()
      } catch (error) {
        setError(
          error.message
        )
      }
    }

  const handleLogMeal =
    async (mealId) => {
      try {
        setLoggingMealId(
          mealId
        )

        await logMeal(
          mealId
        )

        setSuccess(
          'Meal logged for today.'
        )

        await loadTodayLogs()
      } catch (error) {
        setError(
          error.message
        )
      } finally {
        setLoggingMealId(
          null
        )
      }
    }

  const handleDeleteMealLog =
    async (logId) => {
      if (
        !window.confirm(
          "Remove this meal from today's log?"
        )
      ) {
        return
      }

      try {
        await deleteMealLog(
          logId
        )

        setSuccess(
          "Meal removed from today's log."
        )

        await loadTodayLogs()
      } catch (error) {
        setError(
          error.message
        )
      }
    }

  return (
    <main className="meal-builder-page">
      <section className="meal-builder-header">
        <div>
          <p className="tagline">
            MEAL ENTRY
          </p>

          <h1>
            {editingMealId
              ? 'Edit Your Meal'
              : 'Create Your Meal'}
          </h1>

          <p>
            Build meals from your
            food library or quickly
            enter nutrition
            information manually.
          </p>
        </div>
      </section>

      {error && (
        <div className="auth-error meal-message">
          {error}
        </div>
      )}

      {success && (
        <div className="profile-success meal-message">
          {success}
        </div>
      )}

      <div className="meal-builder-layout">
        {entryMode ===
          'builder' && (
          <section className="food-search-panel">
            <div className="meal-panel-header">
              <div>
                <p className="tagline">
                  FOOD LIBRARY
                </p>

                <h2>
                  Find Foods
                </h2>

                <p>
                  Search or browse
                  by category.
                </p>
              </div>

              <button
                type="button"
                className="add-custom-food-button"
                onClick={() =>
                  setShowCustomFood(
                    (current) =>
                      !current
                  )
                }
              >
                {showCustomFood
                  ? 'Close'
                  : '+ Add Custom Food'}
              </button>
            </div>

            {showCustomFood && (
              <form
                className="custom-food-form"
                onSubmit={
                  handleCreateCustomFood
                }
              >
                <div className="custom-food-heading">
                  <div>
                    <p className="tagline">
                      CUSTOM FOOD
                    </p>

                    <h3>
                      Add to Your Library
                    </h3>
                  </div>
                </div>

                <div className="custom-food-grid">
                  <div className="form-group custom-food-wide">
                    <label htmlFor="customFoodName">
                      Food Name
                    </label>

                    <input
                      id="customFoodName"
                      name="name"
                      type="text"
                      value={
                        customFood.name
                      }
                      onChange={
                        handleCustomFoodChange
                      }
                      placeholder="Example: My Protein Bar"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customFoodCategory">
                      Category
                    </label>

                    <select
                      id="customFoodCategory"
                      name="category"
                      value={
                        customFood.category
                      }
                      onChange={
                        handleCustomFoodChange
                      }
                    >
                      {CUSTOM_FOOD_CATEGORIES.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category
                            }
                            value={
                              category
                            }
                          >
                            {
                              category
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="customServingSize">
                      Serving Size
                    </label>

                    <input
                      id="customServingSize"
                      name="servingSize"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={
                        customFood.servingSize
                      }
                      onChange={
                        handleCustomFoodChange
                      }
                      placeholder="1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customServingUnit">
                      Serving Unit
                    </label>

                    <input
                      id="customServingUnit"
                      name="servingUnit"
                      type="text"
                      value={
                        customFood.servingUnit
                      }
                      onChange={
                        handleCustomFoodChange
                      }
                      placeholder="bar, cup, oz..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customCalories">
                      Calories
                    </label>

                    <input
                      id="customCalories"
                      name="calories"
                      type="number"
                      min="0"
                      step="0.1"
                      value={
                        customFood.calories
                      }
                      onChange={
                        handleCustomFoodChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customProtein">
                      Protein (g)
                    </label>

                    <input
                      id="customProtein"
                      name="protein"
                      type="number"
                      min="0"
                      step="0.1"
                      value={
                        customFood.protein
                      }
                      onChange={
                        handleCustomFoodChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customCarbs">
                      Carbs (g)
                    </label>

                    <input
                      id="customCarbs"
                      name="carbs"
                      type="number"
                      min="0"
                      step="0.1"
                      value={
                        customFood.carbs
                      }
                      onChange={
                        handleCustomFoodChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customFat">
                      Fat (g)
                    </label>

                    <input
                      id="customFat"
                      name="fat"
                      type="number"
                      min="0"
                      step="0.1"
                      value={
                        customFood.fat
                      }
                      onChange={
                        handleCustomFoodChange
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={
                    savingCustomFood
                  }
                >
                  {savingCustomFood
                    ? 'Saving...'
                    : 'Save Custom Food'}
                </button>
              </form>
            )}

            <div className="food-category-tabs">
              {FOOD_CATEGORIES.map(
                (category) => (
                  <button
                    type="button"
                    key={
                      category
                    }
                    className={
                      selectedCategory ===
                      category
                        ? 'food-category-button active'
                        : 'food-category-button'
                    }
                    onClick={() =>
                      handleCategoryChange(
                        category
                      )
                    }
                  >
                    {category}
                  </button>
                )
              )}
            </div>

            <form
              className="food-search-form"
              onSubmit={
                handleSearch
              }
            >
              <input
                type="text"
                placeholder={`Search ${
                  selectedCategory ===
                  'All'
                    ? 'all foods'
                    : selectedCategory.toLowerCase()
                }...`}
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

              <button
                type="submit"
                className="primary-button"
              >
                Search
              </button>

              {searchTerm && (
                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={async () => {
                    setSearchTerm('')

                    await loadFoods(
                      selectedCategory,
                      ''
                    )
                  }}
                >
                  Clear
                </button>
              )}
            </form>

            <div className="food-results">
              {loadingFoods ? (
                <p className="empty-message">
                  Loading foods...
                </p>
              ) : foods.length ===
                0 ? (
                <div className="empty-meal">
                  <h3>
                    No foods found
                  </h3>

                  <p>
                    Try another
                    category, search,
                    or add a custom
                    food.
                  </p>
                </div>
              ) : (
                foods.map(
                  (food) => (
                    <div
                      className="food-result-card"
                      key={
                        food.food_id
                      }
                    >
                      <div className="food-result-info">
                        <div className="food-card-heading">
                          <h3>
                            {
                              food.name
                            }
                          </h3>

                          <div className="food-card-badges">
                            <span className="food-category-badge">
                              {
                                food.category
                              }
                            </span>

                            {Boolean(
                              food.is_custom
                            ) && (
                              <span className="custom-food-badge">
                                Custom
                              </span>
                            )}
                          </div>
                        </div>

                        <p>
                          {
                            food.serving_size
                          }{' '}
                          {
                            food.serving_unit
                          }
                        </p>

                        <div className="food-macros">
                          <span>
                            {Number(
                              food.calories
                            ).toFixed(
                              0
                            )}{' '}
                            cal
                          </span>

                          <span>
                            {Number(
                              food.protein
                            ).toFixed(
                              1
                            )}
                            g P
                          </span>

                          <span>
                            {Number(
                              food.carbs
                            ).toFixed(
                              1
                            )}
                            g C
                          </span>

                          <span>
                            {Number(
                              food.fat
                            ).toFixed(
                              1
                            )}
                            g F
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="add-food-button"
                        onClick={() =>
                          addFood(
                            food
                          )
                        }
                      >
                        Add
                      </button>
                    </div>
                  )
                )
              )}
            </div>
          </section>
        )}

        <section className="current-meal-panel">
          <div className="meal-panel-header">
            <div>
              <h2>
                {editingMealId
                  ? 'Editing Meal'
                  : 'Your Meal'}
              </h2>

              <p>
                Enter the meal
                details before
                saving.
              </p>
            </div>
          </div>

          <div className="meal-entry-mode">
            <button
              type="button"
              className={
                entryMode ===
                'builder'
                  ? 'meal-mode-button active'
                  : 'meal-mode-button'
              }
              onClick={() =>
                setEntryMode(
                  'builder'
                )
              }
            >
              Food Builder
            </button>

            <button
              type="button"
              className={
                entryMode ===
                'manual'
                  ? 'meal-mode-button active'
                  : 'meal-mode-button'
              }
              onClick={() =>
                setEntryMode(
                  'manual'
                )
              }
            >
              Quick Entry
            </button>
          </div>

          <div className="form-group meal-name-group">
            <label htmlFor="mealName">
              Meal Name
            </label>

            <input
              id="mealName"
              type="text"
              value={
                mealName
              }
              onChange={(
                event
              ) =>
                setMealName(
                  event.target.value
                )
              }
              placeholder="Example: Chicken Rice Bowl"
            />
          </div>

          <div className="meal-details-grid">
            <div className="form-group">
              <label htmlFor="mealType">
                Meal Type
              </label>

              <select
                id="mealType"
                value={
                  mealType
                }
                onChange={(
                  event
                ) =>
                  setMealType(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select meal type
                </option>

                {MEAL_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type ===
                      'Shake/Drink'
                        ? 'Shake / Drink'
                        : type}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mealDate">
                Date
              </label>

              <input
                id="mealDate"
                type="date"
                value={
                  mealDate
                }
                onChange={(
                  event
                ) =>
                  setMealDate(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          {entryMode ===
            'manual' && (
            <div className="manual-meal-fields">
              {[
                [
                  'servingSize',
                  'Serving Size'
                ],
                [
                  'servingUnit',
                  'Serving Unit'
                ],
                [
                  'calories',
                  'Calories'
                ],
                [
                  'protein',
                  'Protein (g)'
                ],
                [
                  'carbs',
                  'Carbohydrates (g)'
                ],
                [
                  'fat',
                  'Fat (g)'
                ]
              ].map(
                ([
                  name,
                  label
                ]) => (
                  <div
                    className="form-group"
                    key={name}
                  >
                    <label
                      htmlFor={
                        name
                      }
                    >
                      {label}
                    </label>

                    <input
                      id={name}
                      name={name}
                      type={
                        name ===
                        'servingUnit'
                          ? 'text'
                          : 'number'
                      }
                      min={
                        name ===
                        'servingUnit'
                          ? undefined
                          : name ===
                              'servingSize'
                            ? '0.01'
                            : '0'
                      }
                      step={
                        name ===
                        'servingUnit'
                          ? undefined
                          : '0.1'
                      }
                      value={
                        manualMeal[
                          name
                        ]
                      }
                      onChange={
                        handleManualChange
                      }
                    />
                  </div>
                )
              )}
            </div>
          )}

          {entryMode ===
            'builder' && (
            <>
              <div className="selected-foods">
                {mealItems.length ===
                0 ? (
                  <div className="empty-meal">
                    <h3>
                      Your meal is
                      empty
                    </h3>

                    <p>
                      Add foods from
                      the library to
                      begin building
                      your meal.
                    </p>
                  </div>
                ) : (
                  mealItems.map(
                    (item) => (
                      <div
                        className="selected-food-card"
                        key={
                          item.food
                            .food_id
                        }
                      >
                        <div>
                          <h3>
                            {
                              item.food
                                .name
                            }
                          </h3>

                          <p>
                            {
                              item.food
                                .category
                            }{' '}
                            •{' '}
                            {
                              item.food
                                .serving_size
                            }{' '}
                            {
                              item.food
                                .serving_unit
                            }
                          </p>
                        </div>

                        <div className="selected-food-controls">
                          <label>
                            Servings

                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={
                                item.quantity
                              }
                              onChange={(
                                event
                              ) =>
                                updateQuantity(
                                  item.food
                                    .food_id,
                                  event.target
                                    .value
                                )
                              }
                            />
                          </label>

                          <button
                            type="button"
                            className="remove-food-button"
                            onClick={() =>
                              removeFood(
                                item.food
                                  .food_id
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              <div className="meal-totals">
                <h3>
                  Nutrition Total
                </h3>

                <div className="meal-total-grid">
                  <div>
                    <strong>
                      {totals.calories.toFixed(
                        0
                      )}
                    </strong>

                    <span>
                      Calories
                    </span>
                  </div>

                  <div>
                    <strong>
                      {totals.protein.toFixed(
                        1
                      )}
                      g
                    </strong>

                    <span>
                      Protein
                    </span>
                  </div>

                  <div>
                    <strong>
                      {totals.carbs.toFixed(
                        1
                      )}
                      g
                    </strong>

                    <span>
                      Carbs
                    </span>
                  </div>

                  <div>
                    <strong>
                      {totals.fat.toFixed(
                        1
                      )}
                      g
                    </strong>

                    <span>
                      Fat
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            className="auth-button save-meal-button"
            onClick={
              handleSaveMeal
            }
            disabled={
              saving
            }
          >
            {saving
              ? 'Saving...'
              : editingMealId
                ? 'Update Meal'
                : 'Save Meal'}
          </button>

          {editingMealId && (
            <button
              type="button"
              className="cancel-edit-button"
              onClick={
                resetBuilder
              }
            >
              Cancel Editing
            </button>
          )}
        </section>
      </div>

      <section className="saved-meals-section">
        <div className="saved-meals-header">
          <div>
            <p className="tagline">
              SAVED MEALS
            </p>

            <h2>
              Your Meals
            </h2>
          </div>
        </div>

        <div className="meal-filters">
          <div className="form-group">
            <label htmlFor="filterDate">
              Filter by Date
            </label>

            <input
              id="filterDate"
              type="date"
              value={
                filterDate
              }
              onChange={(
                event
              ) =>
                setFilterDate(
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="filterMealType">
              Filter by Meal Type
            </label>

            <select
              id="filterMealType"
              value={
                filterMealType
              }
              onChange={(
                event
              ) =>
                setFilterMealType(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Meals
              </option>

              {MEAL_TYPES.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            type="button"
            className="cancel-edit-button"
            onClick={() => {
              setFilterDate('')
              setFilterMealType(
                'All'
              )
            }}
          >
            Clear Filters
          </button>
        </div>

        {loadingMeals ? (
          <p className="empty-message">
            Loading meals...
          </p>
        ) : filteredMeals.length ===
          0 ? (
          <div className="empty-meal">
            <h3>
              No meals found
            </h3>
          </div>
        ) : (
          <div className="saved-meals-grid">
            {filteredMeals.map(
              (meal) => (
                <article
                  className="saved-meal-card"
                  key={
                    meal.meal_id
                  }
                >
                  <div className="saved-meal-title">
                    <div>
                      <h3>
                        {
                          meal.meal_name
                        }
                      </h3>

                      <div className="saved-meal-meta">
                        <span>
                          {
                            meal.meal_type
                          }
                        </span>

                        <span>
                          {displayMealDate(
                            meal.meal_date
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="saved-meal-macros">
                    {[
                      [
                        meal.calories,
                        'Calories'
                      ],
                      [
                        `${Number(
                          meal.protein
                        ).toFixed(
                          1
                        )}g`,
                        'Protein'
                      ],
                      [
                        `${Number(
                          meal.carbs
                        ).toFixed(
                          1
                        )}g`,
                        'Carbs'
                      ],
                      [
                        `${Number(
                          meal.fat
                        ).toFixed(
                          1
                        )}g`,
                        'Fat'
                      ]
                    ].map(
                      ([
                        value,
                        label
                      ]) => (
                        <div
                          key={
                            label
                          }
                        >
                          <strong>
                            {
                              value
                            }
                          </strong>

                          <span>
                            {
                              label
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="saved-meal-actions">
                    <button
                      type="button"
                      className="log-meal-button"
                      onClick={() =>
                        handleLogMeal(
                          meal.meal_id
                        )
                      }
                      disabled={
                        loggingMealId ===
                        meal.meal_id
                      }
                    >
                      {loggingMealId ===
                      meal.meal_id
                        ? 'Logging...'
                        : 'Log Meal'}
                    </button>

                    <button
                      type="button"
                      className="edit-meal-button"
                      onClick={() =>
                        handleEditMeal(
                          meal.meal_id
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-meal-button"
                      onClick={() =>
                        handleDeleteMeal(
                          meal.meal_id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      <section className="today-meals-section">
        <div className="today-meals-header">
          <div>
            <p className="tagline">
              TODAY
            </p>

            <h2>
              Today's Logged Meals
            </h2>
          </div>
        </div>

        {!loadingLogs &&
          todayLogs.length > 0 && (
            <div className="today-summary">
              {[
                [
                  todayTotals.calories.toFixed(
                    0
                  ),
                  'Calories'
                ],
                [
                  `${todayTotals.protein.toFixed(
                    1
                  )}g`,
                  'Protein'
                ],
                [
                  `${todayTotals.carbs.toFixed(
                    1
                  )}g`,
                  'Carbs'
                ],
                [
                  `${todayTotals.fat.toFixed(
                    1
                  )}g`,
                  'Fat'
                ]
              ].map(
                ([
                  value,
                  label
                ]) => (
                  <div
                    key={label}
                  >
                    <strong>
                      {value}
                    </strong>

                    <span>
                      {label}
                    </span>
                  </div>
                )
              )}
            </div>
          )}

        {loadingLogs ? (
          <p className="empty-message">
            Loading today's meals...
          </p>
        ) : todayLogs.length ===
          0 ? (
          <div className="empty-meal">
            <h3>
              No meals logged today
            </h3>
          </div>
        ) : (
          <div className="today-meals-grid">
            {todayLogs.map(
              (log) => (
                <article
                  className="today-meal-card"
                  key={
                    log.log_id
                  }
                >
                  <div className="today-meal-title">
                    <div>
                      <h3>
                        {
                          log.meal_name
                        }
                      </h3>

                      <p>
                        {
                          log.meal_type
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      className="remove-log-button"
                      onClick={() =>
                        handleDeleteMealLog(
                          log.log_id
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default Meals