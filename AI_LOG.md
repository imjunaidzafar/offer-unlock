# AI Usage Log - OfferUnlock

This document logs significant AI interactions used during development, demonstrating how AI was used as a "senior pair programmer" rather than blindly accepting output.

---

## Session 1: Project Architecture & Planning

* **Model:** Claude Opus 4.5
* **Intent:** Design overall architecture, tech stack decisions, and implementation plan
* **Prompt:** "Review these requirements and let me know what client wants... [full challenge requirements]"
* **Outcome:**
  - Analyzed requirements and identified critical success factors
  - Recommended Auth Last pattern based on web research for conversion optimization
  - Chose Fluid Progress Bar (Option A) for UI task as it's core to wizard experience
  - Created comprehensive implementation plan with file structure
* **Refinement:** User confirmed choices. Adjusted to React Native CLI (not Expo) per user preference.

---

## Session 2: Project Initialization & Setup

* **Model:** Claude Opus 4.5
* **Intent:** Initialize React Native CLI project with TypeScript and configure dependencies
* **Prompt:** "start plan what will be better and what will fulfill clients all requirements"
* **Outcome:**
  - Initialized RN CLI project with TypeScript template
  - Installed core dependencies: react-navigation, zustand, mmkv, react-hook-form, zod, reanimated
  - Created folder structure following planned architecture
  - Configured babel for Reanimated plugin
* **Refinement:** Had to use specific RN version (0.74.0) due to template compatibility issues with latest CLI (0.83.x)

---

## Session 3: AI Governance Setup

* **Model:** Claude Opus 4.5
* **Intent:** Create .cursorrules and .agent configuration for AI governance
* **Prompt:** Continuation of implementation flow
* **Outcome:**
  - Created `.cursorrules` with tech stack rules, architecture patterns, naming conventions
  - Created `.agent/rules.md` with component-specific guidelines
  - Established coding standards BEFORE generating implementation code
* **Key Decision:** Set up governance first to ensure consistent code generation

---

## Session 4: State Management & Persistence

* **Model:** Claude Opus 4.5
* **Intent:** Implement Zustand stores with MMKV persistence
* **Prompt:** Continuation - "Create MMKV storage and Zustand stores"
* **Outcome:**
  - Created `storage.ts` with MMKV instance and Zustand adapter
  - Created `useWizardStore.ts` with persist middleware for draft state
  - Created `useAuthStore.ts` with mock API for authentication
  - Implemented selector hooks for performance optimization
* **Technical Decision:** Used `createJSONStorage` wrapper for Zustand-MMKV integration

---

## Session 5: Fluid Progress Bar Component (UI TASK)

* **Model:** Claude Opus 4.5
* **Intent:** Build custom animated progress bar with Reanimated (NO pre-built libraries)
* **Prompt:** "Build custom Fluid Progress Bar component"
* **Outcome:**
  - Created `FluidProgressBar.tsx` using Reanimated 3 primitives
  - Implemented smooth spring animations with `withSpring` and `withTiming`
  - Added step indicators with scale animations on completion
  - Added glow effect using animated opacity
  - Used `interpolate` for percentage-based width calculation
* **Technical Choices:**
  - `damping: 15, stiffness: 80` for natural spring feel
  - `Easing.bezier(0.25, 0.1, 0.25, 1)` for custom easing curves
  - Separate animation for step indicators vs progress bar

---

## Session 6: Form Validation & Wizard Screens

* **Model:** Claude Opus 4.5
* **Intent:** Implement wizard steps with react-hook-form and zod validation
* **Prompt:** "Create Wizard Step screens with validation"
* **Outcome:**
  - Created `validation.ts` with comprehensive Zod schemas
  - Implemented Step1 (Personal Info), Step2 (Income), Step3 (Preferences)
  - Auto-save form data to Zustand store on change
  - Disabled "Next" button until form is valid
  - Added inline error messages
* **Validation Rules Implemented:**
  - Names: 2-50 chars, letters/hyphens/apostrophes only
  - Date of Birth: 18+ age check, not future date
  - Income: Positive number, formatted with commas
  - E.164 phone format validation

---

## Session 7: Authentication Screens

* **Model:** Claude Opus 4.5
* **Intent:** Build SignUp/Login with comprehensive validation and error handling
* **Prompt:** "Create SignUp and Login screens with validation"
* **Outcome:**
  - Created `SignUpScreen.tsx` with all required fields (username, email, phone, password)
  - Created `LoginScreen.tsx` with email/username + password
  - Implemented password visibility toggle
  - Added password strength hints
  - Handled error states from auth store
* **Password Validation:**
  - 8+ characters
  - At least one uppercase, lowercase, number, special character
* **Error Handling:**
  - Username already taken
  - Email already registered
  - Invalid credentials
  - Network errors (simulated)

---

## Session 8: Testing

* **Model:** Claude Opus 4.5
* **Intent:** Write unit and integration tests
* **Prompt:** "Write unit tests for validation and persistence"
* **Outcome:**
  - Created `validation.test.ts` - 40+ test cases for all schemas
  - Created `wizardStore.test.ts` - Store state, updates, persistence
  - Created `wizardFlow.test.tsx` - Integration tests for navigation
  - Configured Jest with proper mocks for MMKV, Reanimated, SafeAreaContext
* **Testing Strategy:**
  - Unit tests for all validation edge cases
  - Integration tests for wizard navigation
  - Mocked native modules properly

---

## Key AI Usage Patterns

### How I Used AI as a Senior Architect (Not a Junior Copy-Paste)

1. **Research-Based Decisions**: Asked AI to search web for best practices (auth-first vs auth-last) before making architectural choices
2. **Governance First**: Established `.cursorrules` BEFORE generating implementation code
3. **Validation of Suggestions**: Confirmed AI recommendations with user before proceeding
4. **Version Pinning**: When latest template failed, diagnosed issue and pinned to stable version
5. **Iterative Refinement**: Adjusted plans based on user feedback (Expo → RN CLI)

### Interventions Made

| AI Output | Issue | My Fix |
|-----------|-------|--------|
| RN CLI init with latest (0.83.x) | Template compatibility issues | Pinned to React Native 0.74.0 |
| Initial navigation structure | Missing GestureHandlerRootView | Added wrapper in App.tsx |
| Zod v4 API | Minor syntax differences | Adjusted schema definitions |
| DateTimePicker usage | Missing dependency | Added @react-native-community/datetimepicker |

### Code Quality Enforcement

The AI was instructed to follow these patterns (via `.cursorrules`):

- TypeScript strict mode
- Functional components only
- SafeAreaView for all screens
- Zod for validation (not inline checks)
- MMKV for persistence (not AsyncStorage)
- Reanimated for animations (not Animated API)
- No pre-built progress bar libraries

---

## Session 9: Auth First Refactor & Theme System

* **Model:** Claude Opus 4.5
* **Intent:** Refactor from Auth Last to Auth First pattern, add theme system
* **Prompt:** User requested navigation flow change to Auth First
* **Outcome:**
  - Created theme system with colors, shadows, borderRadius tokens
  - Refactored RootNavigator for Auth First flow
  - Added returning user detection (wizard completed → Home)
  - Modernized UI with gradient headers and card-based layouts
* **Key Decision:** Auth First improves UX for returning users

---

## Session 10: Home Dashboard & Quick Actions

* **Model:** Claude Opus 4.5
* **Intent:** Create Home screen with dashboard and functional quick actions
* **Prompt:** "Do you think quick actions must also work?" → User chose full screens
* **Outcome:**
  - Created HomeScreen with profile, offer summary, quick actions
  - Created CompareScreen for side-by-side offer comparison
  - Created SupportScreen with FAQ accordion (animated)
  - Created SettingsScreen with profile, notifications, account options
* **Technical Choices:**
  - Animated FAQ accordion with Reanimated
  - Touch-responsive quick action cards
  - Proper logout/delete account flows

---

## Session 11: Dynamic Offer Calculator

* **Model:** Claude Opus 4.5
* **Intent:** Replace hardcoded offers with formula-based calculations
* **Prompt:** "The loan and other things how we calculate them any formula or hardcoded?"
* **Outcome:**
  - Created `offerCalculator.ts` with calculation logic
  - Loan: 30% income × employment multiplier, APR by credit score
  - Credit Card: 15% income × multiplier, intro APR by credit
  - Insurance: 10x income × multiplier, premium by coverage
  - Updated all screens to use calculated offers
* **Technical Implementation:**
  - APR mapping by credit score range
  - Employment status multipliers
  - Minimum offer limits for better UX

---

## Session 12: Final Polish & Bug Fixes

* **Model:** Claude Opus 4.5
* **Intent:** Fix remaining issues and polish
* **Outcome:**
  - Fixed username capitalization (CamelCase display)
  - Centered back arrow icons across all screens
  - Updated build date and copyright year
  - Implemented actual account deletion (removes from DB)
  - Added Privacy Policy and Terms of Service links
  - Increased minimum offer limits for better demo appearance

---

## Summary

This project demonstrates responsible AI usage where:

1. **AI as Architect**: Used for research, planning, and best practice recommendations
2. **Human as Decision Maker**: All major decisions confirmed with user
3. **Governance Layer**: `.cursorrules` ensured consistent code generation
4. **Quality Assurance**: Comprehensive tests written alongside implementation
5. **Documentation**: This log provides full transparency into AI involvement
6. **Iterative Refinement**: Continued polish based on user feedback
