import { useEffect, useMemo, useState } from 'react'

import {
  getFoods,
  searchFoods,
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
  logMeal,
  getTodayMealLogs,
  deleteMealLog
} from '../services/api'

const getTodayDate = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(
    now.getMonth() + 1
  ).padStart(2, '0')
  const day = String(
    now.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const toDateInputValue = (value) => {
  if (!value) {
    return ''
  }

  if (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}/.test(value)
  ) {
    return value.slice(0, 10)
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')
  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const displayMealDate = (value) => {
  const dateValue = toDateInputValue(value)

  if (!dateValue) {
    return 'No date'
  }

  const [year, month, day] =
    dateValue.split('-')

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString()
}

function Meals() {
  const [mealName, setMealName] =
    useState('')

  const [entryMode, setEntryMode] =
    useState('builder')

  const [mealType, setMealType] =
    useState('')

  const [mealDate, setMealDate] =
    useState(getTodayDate())

  const [manualMeal, setManualMeal] =
    useState({
      servingSize: '',
      servingUnit: 'serving',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    })

  const [filterDate, setFilterDate] =
    useState('')

  const [
    filterMealType,
    setFilterMealType
  ] = useState('All')

  const [searchTerm, setSearchTerm] =
    useState('')

  const [foods, setFoods] =
    useState([])

  const [mealItems, setMealItems] =
    useState([])

  const [savedMeals, setSavedMeals] =
    useState([])

  const [todayLogs, setTodayLogs] =
    useState([])

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

  const [saving, setSaving] =
    useState(false)

  const [
    loggingMealId,
    setLoggingMealId
  ] = useState(null)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  useEffect(() => {
    loadFoods()
    loadMeals()
    loadTodayLogs()
  }, [])

  const loadFoods = async () => {
    try {
      setLoadingFoods(true)

      const data = await getFoods()

      setFoods(data.foods || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoadingFoods(false)
    }
  }

  const loadMeals = async () => {
    try {
      setLoadingMeals(true)

      const data = await getMeals()

      setSavedMeals(data.meals || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoadingMeals(false)
    }
  }

  const loadTodayLogs = async () => {
    try {
      setLoadingLogs(true)

      const data =
        await getTodayMealLogs()

      setTodayLogs(data.logs || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoadingLogs(false)
    }
  }

  const handleSearch = async (
    event
  ) => {
    event.preventDefault()

    try {
      setLoadingFoods(true)
      setError('')
      setSuccess('')

      if (!searchTerm.trim()) {
        await loadFoods()
        return
      }

      const data =
        await searchFoods(
          searchTerm.trim()
        )

      setFoods(data.foods || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoadingFoods(false)
    }
  }

  const addFood = (food) => {
    setError('')
    setSuccess('')

    setMealItems(
      (currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              item.food.food_id ===
              food.food_id
          )

        if (existingItem) {
          return currentItems.map(
            (item) =>
              item.food.food_id ===
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
    const quantity = Number(value)

    if (
      Number.isNaN(quantity) ||
      quantity <= 0
    ) {
      return
    }

    setMealItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.food.food_id ===
            foodId
              ? {
                  ...item,
                  quantity
                }
              : item
        )
    )
  }

  const removeFood = (foodId) => {
    setMealItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.food.food_id !==
            foodId
        )
    )
  }

  const totals = useMemo(() => {
    return mealItems.reduce(
      (total, item) => {
        const quantity =
          Number(item.quantity)

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
          const matchesType =
            filterMealType ===
              'All' ||
            meal.meal_type ===
              filterMealType

          const mealDateValue =
            toDateInputValue(
              meal.meal_date
            )

          const matchesDate =
            !filterDate ||
            mealDateValue ===
              filterDate

          return (
            matchesType &&
            matchesDate
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
    setMealDate(getTodayDate())
    setMealItems([])
    setEditingMealId(null)
    setEntryMode('builder')

    setManualMeal({
      servingSize: '',
      servingUnit: 'serving',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    })
  }

  const handleManualChange = (
    event
  ) => {
    const { name, value } =
      event.target

    setManualMeal(
      (current) => ({
        ...current,
        [name]: value
      })
    )

    setError('')
    setSuccess('')
  }

  const handleSaveMeal = async () => {
    setError('')
    setSuccess('')

    if (!mealName.trim()) {
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

    if (entryMode === 'builder') {
      if (mealItems.length === 0) {
        setError(
          'Add at least one food to your meal.'
        )
        return
      }

      mealData = {
        entryMode: 'builder',
        mealName:
          mealName.trim(),
        mealType,
        mealDate,

        items: mealItems.map(
          (item) => ({
            foodId:
              item.food.food_id,

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
          Number(servingSize)
        ) ||
        Number(servingSize) <= 0
      ) {
        setError(
          'Serving size must be greater than zero.'
        )
        return
      }

      const nutritionValues = [
        {
          name: 'Calories',
          value: calories
        },
        {
          name: 'Protein',
          value: protein
        },
        {
          name: 'Carbohydrates',
          value: carbs
        },
        {
          name: 'Fat',
          value: fat
        }
      ]

      for (
        const field
        of nutritionValues
      ) {
        if (
          field.value === '' ||
          !Number.isFinite(
            Number(field.value)
          ) ||
          Number(field.value) < 0
        ) {
          setError(
            `${field.name} must be zero or greater.`
          )
          return
        }
      }

      mealData = {
        entryMode: 'manual',

        mealName:
          mealName.trim(),

        mealType,
        mealDate,

        servingSize:
          Number(servingSize),

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

      if (editingMealId) {
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
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditMeal = async (
    mealId
  ) => {
    try {
      setError('')
      setSuccess('')

      const data =
        await getMeal(mealId)

      const meal = data.meal

      setEditingMealId(
        meal.meal_id
      )

      setMealName(
        meal.meal_name || ''
      )

      setMealType(
        meal.meal_type || ''
      )

      setMealDate(
        toDateInputValue(
          meal.meal_date
        ) || getTodayDate()
      )

      const isManual =
        meal.calories !== null &&
        meal.calories !==
          undefined

      if (isManual) {
        setEntryMode('manual')
        setMealItems([])

        setManualMeal({
          servingSize:
            meal.serving_size ??
            '',

          servingUnit:
            meal.serving_unit ||
            'serving',

          calories:
            meal.calories ?? '',

          protein:
            meal.protein ?? '',

          carbs:
            meal.carbs ?? '',

          fat:
            meal.fat ?? ''
        })
      } else {
        setEntryMode('builder')

        setManualMeal({
          servingSize: '',
          servingUnit: 'serving',
          calories: '',
          protein: '',
          carbs: '',
          fat: ''
        })

        setMealItems(
          (meal.items || []).map(
            (item) => ({
              food: {
                food_id:
                  item.food_id,

                name:
                  item.name,

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
        behavior: 'smooth'
      })
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDeleteMeal = async (
    mealId
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this meal?'
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await deleteMeal(mealId)

      if (
        editingMealId === mealId
      ) {
        resetBuilder()
      }

      setSuccess(
        'Meal deleted successfully.'
      )

      await loadMeals()
      await loadTodayLogs()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleLogMeal = async (
    mealId
  ) => {
    try {
      setError('')
      setSuccess('')
      setLoggingMealId(
        mealId
      )

      await logMeal(mealId)

      setSuccess(
        'Meal logged for today.'
      )

      await loadTodayLogs()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoggingMealId(null)
    }
  }

  const handleDeleteMealLog =
    async (logId) => {
      const confirmed =
        window.confirm(
          "Remove this meal from today's log?"
        )

      if (!confirmed) {
        return
      }

      try {
        setError('')
        setSuccess('')

        await deleteMealLog(
          logId
        )

        setSuccess(
          "Meal removed from today's log."
        )

        await loadTodayLogs()
      } catch (error) {
        setError(error.message)
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
            Build a meal using foods or
            quickly enter nutrition
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
                <h2>Find Foods</h2>

                <p>
                  Add ingredients to
                  your meal.
                </p>
              </div>
            </div>

            <form
              className="food-search-form"
              onSubmit={
                handleSearch
              }
            >
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target
                      .value
                  )
                }
              />

              <button
                type="submit"
                className="primary-button"
              >
                Search
              </button>
            </form>

            <div className="food-results">
              {loadingFoods ? (
                <p className="empty-message">
                  Loading foods...
                </p>
              ) : foods.length ===
                0 ? (
                <p className="empty-message">
                  No foods found.
                </p>
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
                        <h3>
                          {
                            food.name
                          }
                        </h3>

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
                Enter the meal details
                before saving.
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
              placeholder="Example: Chicken Rice Bowl"
              value={mealName}
              onChange={(
                event
              ) =>
                setMealName(
                  event.target.value
                )
              }
            />
          </div>

          <div className="meal-details-grid">
            <div className="form-group">
              <label htmlFor="mealType">
                Meal Type
              </label>

              <select
                id="mealType"
                value={mealType}
                onChange={(
                  event
                ) =>
                  setMealType(
                    event.target
                      .value
                  )
                }
              >
                <option value="">
                  Select meal type
                </option>

                <option value="Breakfast">
                  Breakfast
                </option>

                <option value="Lunch">
                  Lunch
                </option>

                <option value="Dinner">
                  Dinner
                </option>

                <option value="Snack">
                  Snack
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mealDate">
                Date
              </label>

              <input
                id="mealDate"
                type="date"
                value={mealDate}
                onChange={(
                  event
                ) =>
                  setMealDate(
                    event.target
                      .value
                  )
                }
              />
            </div>
          </div>

          {entryMode ===
            'manual' && (
            <div className="manual-meal-fields">
              <div className="form-group">
                <label htmlFor="servingSize">
                  Serving Size
                </label>

                <input
                  id="servingSize"
                  name="servingSize"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    manualMeal.servingSize
                  }
                  onChange={
                    handleManualChange
                  }
                  placeholder="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="servingUnit">
                  Serving Unit
                </label>

                <input
                  id="servingUnit"
                  name="servingUnit"
                  type="text"
                  value={
                    manualMeal.servingUnit
                  }
                  onChange={
                    handleManualChange
                  }
                  placeholder="serving"
                />
              </div>

              <div className="form-group">
                <label htmlFor="calories">
                  Calories
                </label>

                <input
                  id="calories"
                  name="calories"
                  type="number"
                  min="0"
                  step="0.1"
                  value={
                    manualMeal.calories
                  }
                  onChange={
                    handleManualChange
                  }
                  placeholder="Calories"
                />
              </div>

              <div className="form-group">
                <label htmlFor="protein">
                  Protein (g)
                </label>

                <input
                  id="protein"
                  name="protein"
                  type="number"
                  min="0"
                  step="0.1"
                  value={
                    manualMeal.protein
                  }
                  onChange={
                    handleManualChange
                  }
                  placeholder="Protein"
                />
              </div>

              <div className="form-group">
                <label htmlFor="carbs">
                  Carbohydrates (g)
                </label>

                <input
                  id="carbs"
                  name="carbs"
                  type="number"
                  min="0"
                  step="0.1"
                  value={
                    manualMeal.carbs
                  }
                  onChange={
                    handleManualChange
                  }
                  placeholder="Carbohydrates"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fat">
                  Fat (g)
                </label>

                <input
                  id="fat"
                  name="fat"
                  type="number"
                  min="0"
                  step="0.1"
                  value={
                    manualMeal.fat
                  }
                  onChange={
                    handleManualChange
                  }
                  placeholder="Fat"
                />
              </div>
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
                      the search panel
                      to get started.
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
                              item
                                .food
                                .name
                            }
                          </h3>

                          <p>
                            1 serving
                            ={' '}
                            {
                              item
                                .food
                                .serving_size
                            }{' '}
                            {
                              item
                                .food
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
                                  item
                                    .food
                                    .food_id,
                                  event
                                    .target
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
                                item
                                  .food
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
            disabled={saving}
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

            <h2>Your Meals</h2>
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
              value={filterDate}
              onChange={(
                event
              ) =>
                setFilterDate(
                  event.target
                    .value
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
                  event.target
                    .value
                )
              }
            >
              <option value="All">
                All Meals
              </option>

              <option value="Breakfast">
                Breakfast
              </option>

              <option value="Lunch">
                Lunch
              </option>

              <option value="Dinner">
                Dinner
              </option>

              <option value="Snack">
                Snack
              </option>
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

            <p>
              Create a meal or change
              your current filters.
            </p>
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
                          {meal.meal_type ||
                            'Uncategorized'}
                        </span>

                        <span>
                          {displayMealDate(
                            meal.meal_date
                          )}
                        </span>

                        {meal.serving_size && (
                          <span>
                            {
                              meal.serving_size
                            }{' '}
                            {meal.serving_unit ||
                              'serving'}
                          </span>
                        )}
                      </div>
                    </div>

                    <span>
                      #
                      {
                        meal.meal_id
                      }
                    </span>
                  </div>

                  <div className="saved-meal-macros">
                    <div>
                      <strong>
                        {Number(
                          meal.calories
                        ).toFixed(
                          0
                        )}
                      </strong>

                      <span>
                        Calories
                      </span>
                    </div>

                    <div>
                      <strong>
                        {Number(
                          meal.protein
                        ).toFixed(
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
                        {Number(
                          meal.carbs
                        ).toFixed(
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
                        {Number(
                          meal.fat
                        ).toFixed(
                          1
                        )}
                        g
                      </strong>

                      <span>
                        Fat
                      </span>
                    </div>
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
              Today's Meals
            </h2>

            <p>
              Meals you've logged
              today.
            </p>
          </div>
        </div>

        {!loadingLogs &&
          todayLogs.length > 0 && (
            <div className="today-summary">
              <div>
                <strong>
                  {todayTotals.calories.toFixed(
                    0
                  )}
                </strong>

                <span>
                  Calories
                </span>
              </div>

              <div>
                <strong>
                  {todayTotals.protein.toFixed(
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
                  {todayTotals.carbs.toFixed(
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
                  {todayTotals.fat.toFixed(
                    1
                  )}
                  g
                </strong>

                <span>
                  Fat
                </span>
              </div>
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

            <p>
              Use the Log Meal button
              on one of your saved
              meals.
            </p>
          </div>
        ) : (
          <div className="today-meals-grid">
            {todayLogs.map(
              (log) => (
                <article
                  className="today-meal-card"
                  key={log.log_id}
                >
                  <div className="today-meal-title">
                    <div>
                      <h3>
                        {
                          log.meal_name
                        }
                      </h3>

                      {log.meal_type && (
                        <p>
                          {
                            log.meal_type
                          }
                        </p>
                      )}

                      <p>
                        {new Date(
                          log.logged_at
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              'numeric',
                            minute:
                              '2-digit'
                          }
                        )}
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

                  <div className="saved-meal-macros">
                    <div>
                      <strong>
                        {Number(
                          log.calories
                        ).toFixed(
                          0
                        )}
                      </strong>

                      <span>
                        Calories
                      </span>
                    </div>

                    <div>
                      <strong>
                        {Number(
                          log.protein
                        ).toFixed(
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
                        {Number(
                          log.carbs
                        ).toFixed(
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
                        {Number(
                          log.fat
                        ).toFixed(
                          1
                        )}
                        g
                      </strong>

                      <span>
                        Fat
                      </span>
                    </div>
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