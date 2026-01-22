# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start Expo development server
npm run android        # Run on Android (expo run:android)
npm run ios            # Run on iOS (expo run:ios)
npm run web            # Run in web browser
npm run lint           # ESLint check
npx expo prebuild --clean  # Regenerate native projects (required after plugin changes)
```

## Architecture

**React Native + Expo workout tracker** with daily reset functionality. Uses Expo Router for file-based navigation and AsyncStorage for persistence.

### Key Files

- `app/index.tsx` - Main workout list screen
- `app/add-workout.tsx` - Add workout modal
- `hooks/useWorkouts.ts` - Central state management hook (workouts, completions, activity history)
- `hooks/useTheme.ts` - Light/dark theme colors
- `types/workout.ts` - TypeScript interfaces (Workout, DailyCompletion, ActivityDay)
- `components/ActivityTracker.tsx` - 6-month GitHub-style activity calendar

### State Management

All workout state flows through `useWorkouts()` hook. Three AsyncStorage keys:
- `@workouts` - Array of Workout objects
- `@daily_completion` - Today's completed workout IDs + date string (YYYY-MM-DD)
- `@activity_history` - Last 90 days of workout counts

### Daily Reset Logic

App detects new day by comparing stored date (YYYY-MM-DD format) with current date. On day change: completion list clears, previous day's count archives to history.

## Conventions

- TypeScript with strict mode
- Path alias: `@/*` maps to project root
- Date format: YYYY-MM-DD throughout codebase (`getTodayDate()` helper)
- Image URIs: Either `"icon:iconName"` for built-in icons or file path URIs
