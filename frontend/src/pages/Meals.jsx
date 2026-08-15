import { useEffect, useMemo, useState } from 'react'

import {
  getFoods,
  searchFoods,
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal
} from '../services/api'

function Meals() {
  const [mealName, setMealName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [foods, setFoods] = useState([])
  const [mealItems, setMealItems] = useState([])
  const [savedMeals, setSavedMeals] = useState([])

  const [editingMealId, setEditingMealId] = useState(null)

  const [loadingFoods, setLoadingFoods] = useState(true)
  const [loadingMeals, setLoadingMeals] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadFoods()
    loadMeals()
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

  const handleSearch = async (event) => {
    event.preventDefault()

    try {
      setLoadingFoods(true)
      setError('')

      if (!searchTerm.trim()) {
        await loadFoods()
        return
      }

      const data = await searchFoods(searchTerm.trim())

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

    setMealItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.food.food_id === food.food_id
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.food.food_id === food.food_id
            ? {
                ...item,
                quantity: Number(item.quantity) + 1
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
    })
  }

  const updateQuantity = (foodId, value) => {
    const quantity = Number(value)

    if (Number.isNaN(quantity) || quantity <= 0) {
      return
    }

    setMealItems((currentItems) =>
      currentItems.map((item) =>
        item.food.food_id === foodId
          ? {
              ...item,
              quantity
            }
          : item
      )
    )
  }

  const removeFood = (foodId) => {
    setMealItems((currentItems) =>
      currentItems.filter(
        (item) => item.food.food_id !== foodId
      )
    )
  }

  const totals = useMemo(() => {
    return mealItems.reduce(
      (total, item) => {
        const quantity = Number(item.quantity)

        total.calories +=
          Number(item.food.calories) * quantity

        total.protein +=
          Number(item.food.protein) * quantity

        total.carbs +=
          Number(item.food.carbs) * quantity

        total.fat +=
          Number(item.food.fat) * quantity

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

  const resetBuilder = () => {
    setMealName('')
    setMealItems([])
    setEditingMealId(null)
  }

  const handleSaveMeal = async () => {
    setError('')
    setSuccess('')

    if (!mealName.trim()) {
      setError('Please enter a meal name.')
      return
    }

    if (mealItems.length === 0) {
      setError('Add at least one food to your meal.')
      return
    }

    const mealData = {
      mealName: mealName.trim(),

      items: mealItems.map((item) => ({
        foodId: item.food.food_id,
        quantity: Number(item.quantity)
      }))
    }

    try {
      setSaving(true)

      if (editingMealId) {
        await updateMeal(
          editingMealId,
          mealData
        )

        setSuccess('Meal updated successfully.')
      } else {
        await createMeal(mealData)

        setSuccess('Meal saved successfully.')
      }

      resetBuilder()

      await loadMeals()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditMeal = async (mealId) => {
    try {
      setError('')
      setSuccess('')

      const data = await getMeal(mealId)

      const meal = data.meal

      setEditingMealId(meal.meal_id)
      setMealName(meal.meal_name)

      setMealItems(
        meal.items.map((item) => ({
          food: {
            food_id: item.food_id,
            name: item.name,
            serving_size: item.serving_size,
            serving_unit: item.serving_unit,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat
          },

          quantity: Number(item.quantity)
        }))
      )

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDeleteMeal = async (mealId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this meal?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await deleteMeal(mealId)

      if (editingMealId === mealId) {
        resetBuilder()
      }

      setSuccess('Meal deleted successfully.')

      await loadMeals()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <main className="meal-builder-page">
      <section className="meal-builder-header">
        <div>
          <p className="tagline">
            MEAL BUILDER
          </p>

          <h1>
            {editingMealId
              ? 'Edit Your Meal'
              : 'Create Your Meal'}
          </h1>

          <p>
            Search foods, adjust serving quantities,
            and build meals that fit your nutrition goals.
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
        <section className="food-search-panel">
          <div className="meal-panel-header">
            <div>
              <h2>Find Foods</h2>
              <p>Add ingredients to your meal.</p>
            </div>
          </div>

          <form
            className="food-search-form"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
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
            ) : foods.length === 0 ? (
              <p className="empty-message">
                No foods found.
              </p>
            ) : (
              foods.map((food) => (
                <div
                  className="food-result-card"
                  key={food.food_id}
                >
                  <div className="food-result-info">
                    <h3>{food.name}</h3>

                    <p>
                      {food.serving_size}{' '}
                      {food.serving_unit}
                    </p>

                    <div className="food-macros">
                      <span>
                        {Number(food.calories).toFixed(0)} cal
                      </span>

                      <span>
                        {Number(food.protein).toFixed(1)}g P
                      </span>

                      <span>
                        {Number(food.carbs).toFixed(1)}g C
                      </span>

                      <span>
                        {Number(food.fat).toFixed(1)}g F
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="add-food-button"
                    onClick={() => addFood(food)}
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="current-meal-panel">
          <div className="meal-panel-header">
            <div>
              <h2>
                {editingMealId
                  ? 'Editing Meal'
                  : 'Your Meal'}
              </h2>

              <p>
                Review ingredients before saving.
              </p>
            </div>
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
              onChange={(event) =>
                setMealName(event.target.value)
              }
            />
          </div>

          <div className="selected-foods">
            {mealItems.length === 0 ? (
              <div className="empty-meal">
                <h3>Your meal is empty</h3>

                <p>
                  Add foods from the search panel
                  to get started.
                </p>
              </div>
            ) : (
              mealItems.map((item) => (
                <div
                  className="selected-food-card"
                  key={item.food.food_id}
                >
                  <div>
                    <h3>{item.food.name}</h3>

                    <p>
                      1 serving ={' '}
                      {item.food.serving_size}{' '}
                      {item.food.serving_unit}
                    </p>
                  </div>

                  <div className="selected-food-controls">
                    <label>
                      Servings

                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(
                            item.food.food_id,
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="remove-food-button"
                      onClick={() =>
                        removeFood(
                          item.food.food_id
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="meal-totals">
            <h3>Nutrition Total</h3>

            <div className="meal-total-grid">
              <div>
                <strong>
                  {totals.calories.toFixed(0)}
                </strong>
                <span>Calories</span>
              </div>

              <div>
                <strong>
                  {totals.protein.toFixed(1)}g
                </strong>
                <span>Protein</span>
              </div>

              <div>
                <strong>
                  {totals.carbs.toFixed(1)}g
                </strong>
                <span>Carbs</span>
              </div>

              <div>
                <strong>
                  {totals.fat.toFixed(1)}g
                </strong>
                <span>Fat</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="auth-button save-meal-button"
            onClick={handleSaveMeal}
            disabled={
              saving ||
              mealItems.length === 0
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
              onClick={resetBuilder}
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

        {loadingMeals ? (
          <p className="empty-message">
            Loading meals...
          </p>
        ) : savedMeals.length === 0 ? (
          <div className="empty-meal">
            <h3>No saved meals yet</h3>

            <p>
              Create your first meal using the builder above.
            </p>
          </div>
        ) : (
          <div className="saved-meals-grid">
            {savedMeals.map((meal) => (
              <article
                className="saved-meal-card"
                key={meal.meal_id}
              >
                <div className="saved-meal-title">
                  <h3>{meal.meal_name}</h3>

                  <span>
                    #{meal.meal_id}
                  </span>
                </div>

                <div className="saved-meal-macros">
                  <div>
                    <strong>
                      {Number(meal.calories).toFixed(0)}
                    </strong>

                    <span>Calories</span>
                  </div>

                  <div>
                    <strong>
                      {Number(meal.protein).toFixed(1)}g
                    </strong>

                    <span>Protein</span>
                  </div>

                  <div>
                    <strong>
                      {Number(meal.carbs).toFixed(1)}g
                    </strong>

                    <span>Carbs</span>
                  </div>

                  <div>
                    <strong>
                      {Number(meal.fat).toFixed(1)}g
                    </strong>

                    <span>Fat</span>
                  </div>
                </div>

                <div className="saved-meal-actions">
                  <button
                    type="button"
                    className="edit-meal-button"
                    onClick={() =>
                      handleEditMeal(meal.meal_id)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-meal-button"
                    onClick={() =>
                      handleDeleteMeal(meal.meal_id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Meals