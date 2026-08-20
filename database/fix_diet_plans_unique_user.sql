USE healthfusion;

-- Keep only the newest diet plan row for each user.
DELETE d1
FROM Diet_Plans d1
JOIN Diet_Plans d2
  ON d1.user_id = d2.user_id
 AND d1.diet_plan_id < d2.diet_plan_id;

-- Ensure each user can have only one active diet plan.
ALTER TABLE Diet_Plans
  ADD CONSTRAINT uq_diet_plans_user UNIQUE (user_id);

-- Verification queries.
SELECT * FROM Diet_Plans ORDER BY user_id;
SHOW INDEX FROM Diet_Plans;
