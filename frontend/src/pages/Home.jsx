import {
  Link
} from 'react-router-dom'

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="tagline">
            HEALTH. NUTRITION. SIMPLIFIED.
          </p>

          <h1>
            Take control of your
            <span> nutrition.</span>
          </h1>

          <p className="hero-description">
            HealthFusion helps you create a
            personalized nutrition plan, record
            meals, monitor calories and
            macronutrients, and track your
            progress toward your health goals.
          </p>

          <div className="hero-buttons">
            <Link
              to="/discover"
              className="primary-button home-button-link"
            >
              Get Started
            </Link>

            <a
              href="#healthfusion-features"
              className="secondary-button home-button-link"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="nutrition-card">
          <p className="tagline">
            DAILY PROGRESS
          </p>

          <h3>
            Today's Nutrition
          </h3>

          <div className="calorie-display">
            <span className="calorie-number">
              1,450
            </span>

            <span className="calorie-goal">
              {' '}
              / 2,200 kcal
            </span>
          </div>

          <div className="progress-bar">
            <div className="progress" />
          </div>

          <div className="macro-grid">
            <div>
              <strong>
                120g
              </strong>

              <span>
                Protein
              </span>
            </div>

            <div>
              <strong>
                145g
              </strong>

              <span>
                Carbs
              </span>
            </div>

            <div>
              <strong>
                52g
              </strong>

              <span>
                Fat
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="home-introduction"
        id="healthfusion-features"
      >
        <p className="tagline">
          ONE PLACE FOR YOUR NUTRITION
        </p>

        <h2>
          Everything you need to manage
          your nutrition
        </h2>

        <p>
          HealthFusion combines diet planning,
          meal tracking, nutrition targets, and
          progress monitoring into one
          application. Build a plan that fits
          your goals, record what you eat, and
          see how your choices affect your
          progress.
        </p>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>
            Personalized Diet Plans
          </h3>

          <p>
            Choose from preset diets or create
            a personalized plan based on your
            goal, activity level, weight, and
            dietary preferences.
          </p>
        </div>

        <div className="feature-card">
          <h3>
            Flexible Meal Tracking
          </h3>

          <p>
            Record meals with Quick Entry or
            build meals from foods while
            HealthFusion calculates calories
            and macronutrients.
          </p>
        </div>

        <div className="feature-card">
          <h3>
            Progress Tracking
          </h3>

          <p>
            Compare your calories and macros
            with your targets while tracking
            weight and reviewing progress by
            day, week, or month.
          </p>
        </div>
      </section>

      <section className="home-product-showcase">
        <div className="home-showcase-heading">
          <p className="tagline">
            EXPLORE HEALTHFUSION
          </p>

          <h2>
            See how HealthFusion works
          </h2>

          <p>
            From building your nutrition plan
            to recording meals and reviewing
            progress, HealthFusion keeps your
            health information organized in
            one place.
          </p>
        </div>

        <div className="home-showcase-grid">
          <article className="home-showcase-card">
            <div className="home-showcase-image">
              <img
                src="/images/discover.png"
                alt="HealthFusion Discover page showing diet plan options"
              />
            </div>

            <div className="home-showcase-content">
              <p className="tagline">
                DISCOVER
              </p>

              <h3>
                Find the right nutrition plan
              </h3>

              <p>
                Explore preset diets or create
                your own personalized plan with
                recommended calorie and
                macronutrient targets.
              </p>

              <Link
                to="/discover"
                className="home-feature-link"
              >
                Explore Diet Plans →
              </Link>
            </div>
          </article>

          <article className="home-showcase-card">
            <div className="home-showcase-image">
              <img
                src="/images/meal-entry.png"
                alt="HealthFusion Meal Entry page showing meal and nutrition fields"
              />
            </div>

            <div className="home-showcase-content">
              <p className="tagline">
                MEAL ENTRY
              </p>

              <h3>
                Record meals your way
              </h3>

              <p>
                Quickly enter nutrition values
                or use the Food Builder to
                create detailed meals and
                calculate nutrition totals.
              </p>

              <Link
                to="/meals"
                className="home-feature-link"
              >
                Track Meals →
              </Link>
            </div>
          </article>

          <article className="home-showcase-card">
            <div className="home-showcase-image">
              <img
                src="/images/user-progress.png"
                alt="HealthFusion User Progress dashboard showing nutrition and weight progress"
              />
            </div>

            <div className="home-showcase-content">
              <p className="tagline">
                USER PROGRESS
              </p>

              <h3>
                See your progress clearly
              </h3>

              <p>
                Review calories, macros,
                nutrition targets, recent
                meals, and weight changes from
                your progress dashboard.
              </p>

              <Link
                to="/dashboard"
                className="home-feature-link"
              >
                View Progress →
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="tagline">
            START YOUR PLAN
          </p>

          <h2>
            Build healthier habits with
            HealthFusion
          </h2>

          <p>
            Create an account, choose your
            nutrition goals, and begin tracking
            your progress.
          </p>
        </div>

        <div className="home-cta-buttons">
          <Link
            to="/register"
            className="primary-button home-button-link"
          >
            Create Account
          </Link>

          <Link
            to="/discover"
            className="secondary-button home-button-link"
          >
            Discover Plans
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home