import './App.css'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          Health<span>Fusion</span>
        </div>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#meals">Meals</a>
          <a href="#goals">Goals</a>
          <a href="#profile">Profile</a>
        </nav>

        <button className="login-button">Log In</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="tagline">HEALTH. NUTRITION. SIMPLIFIED.</p>

            <h1>
              Take control of your
              <span> nutrition.</span>
            </h1>

            <p className="hero-description">
              Track your meals, monitor your nutrition, customize your food
              choices, and stay on top of your health goals with HealthFusion.
            </p>

            <div className="hero-buttons">
              <button className="primary-button">Get Started</button>
              <button className="secondary-button">Learn More</button>
            </div>
          </div>

          <div className="nutrition-card">
            <h3>Today's Nutrition</h3>

            <div className="calorie-display">
              <span className="calorie-number">1,450</span>
              <span className="calorie-goal"> / 2,200 kcal</span>
            </div>

            <div className="progress-bar">
              <div className="progress"></div>
            </div>

            <div className="macro-grid">
              <div>
                <strong>120g</strong>
                <span>Protein</span>
              </div>

              <div>
                <strong>145g</strong>
                <span>Carbs</span>
              </div>

              <div>
                <strong>52g</strong>
                <span>Fat</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <h3>Track Nutrition</h3>
            <p>
              Monitor calories, protein, carbohydrates, and fats throughout
              your day.
            </p>
          </div>

          <div className="feature-card">
            <h3>Build Meals</h3>
            <p>
              Create meals using foods and customize serving sizes to fit your
              needs.
            </p>
          </div>

          <div className="feature-card">
            <h3>Reach Your Goals</h3>
            <p>
              Set daily nutrition goals and monitor your progress from one
              dashboard.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App