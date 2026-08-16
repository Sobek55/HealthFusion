const API_BASE_URL = '/api'

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  const text = await response.text()

  let data = {}

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status})`
      )
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    )
  }

  return data
}

/*
  Authentication
*/

export function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export function getCurrentUser() {
  return apiRequest('/auth/me')
}

export function logoutUser() {
  return apiRequest('/auth/logout', {
    method: 'POST'
  })
}

/*
  User Profile
*/

export function getProfile() {
  return apiRequest('/profile')
}

export function saveProfile(profileData) {
  return apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  })
}

/*
  Nutrition Goals
*/

export function getNutritionGoals() {
  return apiRequest('/goals')
}

export function saveNutritionGoals(goalData) {
  return apiRequest('/goals', {
    method: 'PUT',
    body: JSON.stringify(goalData)
  })
}

/*
  Foods
*/

export function getFoods() {
  return apiRequest('/foods')
}

export function searchFoods(searchTerm) {
  return apiRequest(
    `/foods?search=${encodeURIComponent(searchTerm)}`
  )
}

/*
  Meals
*/

export function getMeals() {
  return apiRequest('/meals')
}

export function getMeal(mealId) {
  return apiRequest(`/meals/${mealId}`)
}

export function createMeal(mealData) {
  return apiRequest('/meals', {
    method: 'POST',
    body: JSON.stringify(mealData)
  })
}

export function updateMeal(mealId, mealData) {
  return apiRequest(`/meals/${mealId}`, {
    method: 'PUT',
    body: JSON.stringify(mealData)
  })
}

export function deleteMeal(mealId) {
  return apiRequest(`/meals/${mealId}`, {
    method: 'DELETE'
  })
}

/*
  Meal Logs
*/

export function logMeal(mealId) {
  return apiRequest(`/meal-logs/${mealId}`, {
    method: 'POST'
  })
}

export function getMealLogs() {
  return apiRequest('/meal-logs')
}

export function getTodayMealLogs() {
  return apiRequest('/meal-logs/today')
}

export function deleteMealLog(logId) {
  return apiRequest(`/meal-logs/${logId}`, {
    method: 'DELETE'
  })
}

/*
  Diet Plans
*/

export function getPresetDiets() {
  return apiRequest('/diets/presets')
}

export function getActiveDiet() {
  return apiRequest('/diets/active')
}

export function applyPresetDiet(presetKey) {
  return apiRequest('/diets', {
    method: 'POST',
    body: JSON.stringify({
      presetKey
    })
  })
}