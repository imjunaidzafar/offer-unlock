# Offerly

A high-conversion mobile onboarding flow built with React Native CLI, demonstrating a multi-step wizard with authentication, custom animations, and comprehensive form validation.

## Features

- **Multi-step Lead Wizard** (3 steps): Personal Info → Income Details → Preferences
- **Auth First Pattern**: Sign Up/Login first, then wizard, then personalized offers
- **Home Dashboard**: User dashboard with profile, offer summary, and quick actions
- **Custom Fluid Progress Bar**: Smooth animated progress indicator built with Reanimated 3
- **Draft Persistence**: Return to the same step if app is closed (MMKV storage)
- **Comprehensive Validation**: Zod schemas with real-time error feedback
- **Form State Management**: Zustand with persistence middleware
- **Dynamic Offer Calculator**: Personalized offers based on income, credit score, employment

---

## Prerequisites

Ensure you have the following installed:

| Dependency | Required Version | Check Command |
|------------|-----------------|---------------|
| **Node.js** | >= 18.x | `node --version` |
| **npm** | >= 9.x or **Yarn** >= 3.x | `npm --version` or `yarn --version` |
| **Ruby** | >= 2.7.x | `ruby --version` |
| **CocoaPods** | >= 1.14.x | `pod --version` |
| **Xcode** | >= 15.0 | `xcodebuild -version` |
| **Android Studio** | Latest | Check via Android Studio |
| **JDK** | 17 | `java --version` |
| **Watchman** | Latest (macOS) | `watchman --version` |

### Platform-Specific Requirements

#### iOS (macOS only)
- macOS Ventura or later
- Xcode Command Line Tools: `xcode-select --install`
- iOS Simulator (via Xcode)

#### Android
- Android SDK 34 (API Level 34)
- Android Emulator or physical device
- ANDROID_HOME environment variable set

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Offerly
```

### 2. Install Dependencies

```bash
# Using Yarn (recommended - project uses Yarn 3)
yarn install

# Or using npm
npm install
```

### 3. iOS Setup (macOS only)

```bash
# Install iOS dependencies
cd ios && pod install && cd ..
```

### 4. Start Metro Bundler

```bash
# Start the Metro bundler
yarn start
# Or
npx react-native start
```

---

## Running the App

### iOS Simulator

```bash
# In a new terminal (keep Metro running)
yarn ios
# Or
npx react-native run-ios

# To specify a simulator:
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Android Emulator

```bash
# Ensure an emulator is running or device is connected
# List available devices:
adb devices

# Run the app
yarn android
# Or
npx react-native run-android
```

### Troubleshooting Build Issues

```bash
# Clean iOS build
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..

# Reset Metro cache
npx react-native start --reset-cache
```

---

## Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test --coverage

# Run specific test file
yarn test __tests__/unit/validation.test.ts

# Run tests in watch mode
yarn test --watch
```

### Test Coverage

The project includes:
- **Unit Tests**: Validation schemas, store persistence
- **Integration Tests**: Wizard flow, navigation

---

## Project Architecture

### Folder Structure

```
Offerly/
├── src/
│   ├── app/                    # App entry point
│   ├── navigation/             # React Navigation configuration
│   │   ├── RootNavigator.tsx   # Main navigator (Auth → Wizard → Result → Home)
│   │   ├── WizardStack.tsx     # Onboarding steps navigation
│   │   └── AuthStack.tsx       # Auth screens navigation
│   ├── features/               # Feature screens
│   │   ├── onboarding/         # Onboarding wizard screens
│   │   │   ├── PersonalDetailsScreen.tsx
│   │   │   ├── FinancialInfoScreen.tsx
│   │   │   ├── PreferencesScreen.tsx
│   │   │   └── OfferRevealScreen.tsx
│   │   ├── authentication/     # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   ├── DashboardScreen.tsx # User dashboard
│   │   ├── CompareScreen.tsx   # Compare all offer types
│   │   ├── SupportScreen.tsx   # FAQ and contact options
│   │   └── SettingsScreen.tsx  # User settings and account
│   ├── shared/                 # Shared components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── SafeAreaWrapper.tsx
│   │   ├── onboarding/
│   │   │   └── AnimatedStepIndicator.tsx  # Custom animated progress (UI TASK)
│   │   └── SplashScreen.tsx    # Animated splash screen
│   ├── state/                  # State management
│   │   ├── useOnboardingStore.ts  # Onboarding state + MMKV persistence
│   │   ├── useSessionStore.ts     # Session state (mock API + user database)
│   │   └── storage.ts             # MMKV configuration
│   ├── lib/                    # Utilities
│   │   ├── schemas.ts          # Zod validation schemas
│   │   └── quoteEngine.ts      # Dynamic offer calculations
│   ├── design/                 # Design tokens
│   │   ├── colors.ts           # Color palette and gradients
│   │   └── index.ts            # Design exports
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── __tests__/
│   ├── unit/                   # Unit tests
│   └── integration/            # Integration tests
├── .agent/                     # AI governance config
├── .cursorrules                # AI coding standards
├── AI_LOG.md                   # AI usage documentation
└── README.md
```

### State Management

**Zustand** with persist middleware using **MMKV** for storage.

```typescript
// Onboarding state auto-persists to MMKV
const useOnboardingStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      data: { step1: {...}, step2: {...}, step3: {...} },
      // Actions...
    }),
    { name: 'onboarding-storage', storage: createJSONStorage(() => zustandStorage) }
  )
);
```

**Key benefits:**
- Draft data persists across app restarts
- User returns to the same step they left
- Form data is preserved until submission

### Navigation Flow (Auth First Pattern)

```
App Start
    ↓
[Check persisted state]
    ↓
┌─────────────────────────────────────────────┐
│  AUTH (Login / Sign Up)                      │
│  Username, Email, Phone, Password           │
└─────────────────────────────────────────────┘
    ↓ (authenticated)
    ↓
┌── Returning User? ──────────────────────────┐
│  YES (wizard completed) → Go to HOME        │
│  NO (new user) → Go to WIZARD               │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│  WIZARD                                      │
│  Step 1 → Step 2 → Step 3                   │
│  (Data saved after each step)               │
└─────────────────────────────────────────────┘
    ↓ (completeWizard)
┌─────────────────────────────────────────────┐
│  RESULT                                      │
│  "Offer Unlocked!" with personalized offer  │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│  HOME (Dashboard)                            │
│  Profile, Offer Summary, Quick Actions      │
│  Compare | Support | Settings               │
└─────────────────────────────────────────────┘
    ↓ (logout)
    → Back to AUTH
```

### Custom UI Component: Fluid Progress Bar

Built from scratch using **react-native-reanimated v3**:

- Smooth spring animations between steps (no jumping)
- Step indicators with scale animations on completion
- Glow effect on progress fill
- Uses `withSpring` and `withTiming` for natural easing

```typescript
// Uses Reanimated's shared values for 60fps animations
progress.value = withSpring((currentStep - 1) / (totalSteps - 1), {
  damping: 15,
  stiffness: 80,
});
```

---

## Validation

All forms use **Zod** schemas with **react-hook-form**:

| Field | Validation Rules |
|-------|-----------------|
| First/Last Name | 2-50 chars, letters/spaces/hyphens/apostrophes only |
| Date of Birth | Must be 18+ years old, not future date |
| Username | 3-20 chars, alphanumeric + underscore only |
| Email | Valid email format |
| Phone | E.164 format (e.g., +1234567890) |
| Password | 8+ chars, uppercase, lowercase, number, special char |

---

## Trade-offs & Time Constraints

| Decision | Trade-off |
|----------|-----------|
| **Mock API** | Using in-memory mock instead of real backend |
| **E2E Tests** | Skipped Detox setup; focused on unit + integration |
| **Social Login** | Not implemented (Google/Apple SSO adds native complexity) |
| **Biometrics** | Not implemented (Face ID/Touch ID) |
| **Offline Sync** | Local-only persistence, no cloud sync |
| **Animations** | Basic glow effect; could add more complex liquid effects |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native CLI 0.74.x |
| Language | TypeScript |
| Navigation | React Navigation v7 |
| State | Zustand + MMKV |
| Forms | react-hook-form + zod |
| Animations | react-native-reanimated v3 |
| Testing | Jest + React Native Testing Library |

---

## License

Private repository - Do not distribute.

---

## Author

Built as a coding challenge submission demonstrating:
- Clean architecture
- Custom UI development
- Form handling best practices
- AI-assisted development (see AI_LOG.md)
