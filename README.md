# RepTrack

RepTrack is a full-stack fitness tracking web app that helps users log workouts, track body weight, monitor progress, and follow fitness goals like fat loss, muscle gain, weight gain, maintenance, and strength improvement.

## Live App

Visit the live app here:

https://reptrack-eight.vercel.app/

---

## What is RepTrack?

RepTrack is a fitness progress tracker.

Many people go to the gym but do not properly track:

* how much weight they lifted
* how many reps they performed
* whether their strength is increasing
* whether their body weight is moving toward their goal
* whether they are consistent every week

RepTrack solves this by giving users a simple dashboard where they can log workouts, set fitness goals, track body metrics, and view progress graphs.

---

## Who Can Use This App?

RepTrack is useful for people who want to:

* lose fat
* gain muscle
* gain weight
* maintain weight
* improve strength
* track gym consistency
* monitor personal records

The app is beginner-friendly and does not require fitness knowledge to use.

---

## Features

### Authentication

* Email and password signup
* Email and password login
* Protected dashboard routes
* Logout functionality
* User-specific data using Supabase Auth

### Goal Tracking

Users can select a fitness goal:

* Gain Muscle
* Lose Fat
* Maintain Weight
* Gain Weight
* Improve Strength
* General Fitness

Users can also set:

* starting body weight
* target body weight
* target exercise
* target lift
* weekly workout target

### Workout Logging

Users can log workouts with:

* workout date
* optional notes
* exercise name
* number of sets
* reps per set
* weight lifted per set

Common exercises include:

* Bench Press
* Squat
* Deadlift
* Overhead Press
* Pull Up
* Row

### Dashboard

The dashboard gives a quick overview of the user's progress:

* current goal
* total workouts
* workouts completed this week
* weekly workout volume
* current body weight
* body goal progress
* smart insights
* progress graph
* body weight trend graph
* last 5 workouts

### Progress Page

The progress page helps users track exercise-specific performance.

Users can select an exercise and view:

* personal record
* max weight over time
* exercise volume over time

### Body Tracking

Users can log:

* body weight
* waist measurement
* notes

This helps users understand whether they are moving toward their fat loss, weight gain, or maintenance goal.

### Workout History

Users can view all previous workouts.

Each workout shows:

* date
* exercises performed
* total volume
* individual sets
* reps
* weight lifted

---

## Simple User Workflow

This section explains how a normal user can use the app.

### Step 1: Open the App

Go to:

https://reptrack-eight.vercel.app/

The user will see the login page.

---

### Step 2: Create an Account

If the user does not have an account, they should click:

`Sign up`

Then enter:

* email
* password

After signup, the user can log in and start using the app.

---

### Step 3: Set a Fitness Goal

After logging in, the user should go to the `Goals` page.

They can choose their goal, for example:

* Lose Fat
* Gain Muscle
* Maintain Weight
* Improve Strength

Example for a fat loss goal:

* Fitness Goal: Lose Fat
* Starting Body Weight: 65 kg
* Target Body Weight: 58 kg
* Target Exercise: Bench Press
* Target Lift: 90 kg
* Weekly Workout Target: 4 workouts

After saving the goal, the dashboard becomes personalized.

---

### Step 4: Add Body Weight

The user should go to the `Body` page.

They can enter:

* date
* body weight
* waist measurement
* notes

Example:

* Date: 2026-06-17
* Body Weight: 65 kg
* Waist: 82 cm

This allows RepTrack to calculate body goal progress.

---

### Step 5: Log a Workout

The user should go to the `Log Workout` page.

Example workout:

Exercise: Bench Press

| Set | Reps | Weight |
| --- | ---- | ------ |
| 1   | 10   | 40 kg  |
| 2   | 8    | 45 kg  |
| 3   | 6    | 50 kg  |

Exercise: Squat

| Set | Reps | Weight |
| --- | ---- | ------ |
| 1   | 8    | 80 kg  |
| 2   | 6    | 90 kg  |

After saving, the workout is stored in the user's account.

---

### Step 6: Check Dashboard

The dashboard shows:

* weekly progress
* total workouts
* weekly volume
* current weight
* body goal progress
* smart insights
* workout progress graph
* body weight graph

Example insight:

`You completed 1/4 workouts this week. Try to hit your weekly target.`

---

### Step 7: Check Progress

The user can go to the `Progress` page.

They can select an exercise like:

`Bench Press`

The app will show:

* personal record
* max weight over time
* exercise volume over time

This helps users understand if they are getting stronger.

---

### Step 8: Check History

The user can go to the `History` page.

They can see all previous workouts and expand each workout to view individual sets.

---

## Example Use Case

A user wants to lose fat.

They set:

* current weight: 65 kg
* target weight: 58 kg
* weekly workout target: 4 workouts

Then they log:

* body weight every few days
* workouts after each gym session

RepTrack shows whether:

* body weight is decreasing
* workout consistency is improving
* strength is being maintained
* weekly volume is increasing or decreasing

This helps the user stay consistent and understand real progress.

---

## Tech Stack

RepTrack is built using:

* Next.js
* TypeScript
* Tailwind CSS
* Supabase Auth
* Supabase Postgres Database
* Supabase Row Level Security
* Recharts
* Vercel
* GitHub Actions

---

## Pages

| Page         | Description                         |
| ------------ | ----------------------------------- |
| `/signup`    | Create a new account                |
| `/login`     | Login to an existing account        |
| `/dashboard` | View personalized fitness dashboard |
| `/goals`     | Set or update fitness goal          |
| `/body`      | Track body weight and waist         |
| `/log`       | Log a new workout                   |
| `/progress`  | View exercise progress graphs       |
| `/history`   | View past workouts                  |

---

## Database Tables

The app uses the following main tables:

### workouts

Stores workout sessions.

### exercise_sets

Stores individual exercise sets for each workout.

### user_goals

Stores the user's selected fitness goal.

### body_metrics

Stores body weight and waist measurements.

---

## Local Development Setup

Clone the repository:

```bash
git clone https://github.com/sarkarshrayan2-max/reptrack.git
cd reptrack
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Build Project

To check if the project builds successfully:

```bash
npm run build
```

---

## Deployment

The app is deployed using Vercel.

Live app:

https://reptrack-eight.vercel.app/

Whenever new code is pushed to GitHub, Vercel can automatically redeploy the latest version.

---

## Important Note

RepTrack is a fitness tracking tool. It helps users track progress and consistency, but it does not replace professional medical, nutrition, or fitness advice.

---

## Author

Built by Shrayan Sarkar.

GitHub:

https://github.com/sarkarshrayan2-max
