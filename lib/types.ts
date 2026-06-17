export type Workout = {
  id: string;
  user_id: string;
  date: string;
  notes: string | null;
  created_at: string;
};

export type ExerciseSet = {
  id: string;
  workout_id: string;
  exercise_name: string;
  set_number: number;
  reps: number;
  weight_kg: number;
  created_at: string;
};

export type WorkoutWithSets = Workout & {
  exercise_sets: ExerciseSet[];
};

export type ExerciseSetWithWorkout = ExerciseSet & {
  workouts: {
    date: string;
  } | null;
};

export type UserGoal = {
  id: string;
  user_id: string;
  goal_type: string;
  start_weight_kg: number | null;
  target_weight_kg: number | null;
  target_exercise: string | null;
  target_lift_kg: number | null;
  weekly_workout_target: number;
  created_at: string;
  updated_at: string;
};

export type BodyMetric = {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  waist_cm: number | null;
  notes: string | null;
  created_at: string;
};