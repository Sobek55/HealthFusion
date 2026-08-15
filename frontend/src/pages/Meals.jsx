import { useEffect, useMemo, useState } from 'react'

import {
  getFoods,
  searchFoods,
  createMeal
} from '../services/api'

function Meals() {
  const [mealName, setMealName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [foods, setFoods] = useState([])
  const [mealItems, setMealItems] = useState([])

  const [loadingFoods, setLoadingFoods] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadFoods()
  }, [])

  const loadFoods = async () => {
    try {
      setLoadingFoods(true)
      setError('')

      const data = await getFoods()

      setFoods(data.foods || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoadingFoods(false)
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
    setSuccess('')
    setError('')

    setMealItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.food.food_id === food.food_id
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.food.food_id === food.food_id
            ? {
                ...item,
                quantity: item.quantity + 1
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

    try {
      setSaving(true)

      await createMeal({
        mealName: mealName.trim(),
        items: mealItems.map((item) => ({
          foodId: item.food.food_id,
          quantity: Number(item.quantity)
        }))
      })

      setSuccess('Meal saved successfully.')
      setMealName('')
      setMealItems([])
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="meal-builder-page">
      <section className="meal-builder-header">
        <div>
          <p className="tagline">MEAL BUILDER</p>
          <h1>Create Your Meal</h1>
          <p>
            Search foods, adjust serving quantities, and build a
            meal that fits your nutrition goals.
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
              <h2>Your Meal</h2>
              <p>Review ingredients before saving.</p>
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
                  Add foods from the search panel to get started.
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
                        removeFood(item.food.food_id)
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
            {saving ? 'Saving Meal...' : 'Save Meal'}
          </button>
        </section>
      </div>
    </main>
  )
}

export default Meals