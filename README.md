# OfferUnlock

A high-conversion mobile onboarding flow built with React Native CLI, demonstrating a multi-step wizard with authentication, custom animations, and comprehensive form validation.

## Features

- **Multi-step Lead Wizard** (3 steps): Personal Info → Income Details → Preferences
- **Auth Last Pattern**: Collects wizard data first, then requires sign-up (higher conversion)
- **Custom Fluid Progress Bar**: Smooth animated progress indicator built with Reanimated 3
- **Draft Persistence**: Return to the same step if app is closed (MMKV storage)
- **Comprehensive Validation**: Zod schemas with real-time error feedback
- **Form State Management**: Zustand with persistence middleware

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
cd OfferUnlock
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
OfferUnlock/
├── src/
│   ├── app/                    # App entry point
│   ├── navigation/             # React Navigation configuration
│   │   ├── RootNavigator.tsx   # Main navigator (Wizard → Auth → Result)
│   │   ├── WizardStack.tsx     # Wizard steps navigation
│   │   └── AuthStack.tsx       # Auth screens navigation
│   ├── screens/
│   │   ├── wizard/             # Wizard step screens
│   │   │   ├── Step1PersonalInfo.tsx
│   │   │   ├── Step2IncomeDetails.tsx
│   │   │   ├── Step3Preferences.tsx
│   │   │   └── ResultScreen.tsx
│   │   └── auth/               # Authentication screens
│   │       ├── SignUpScreen.tsx
│   │       └── LoginScreen.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── SafeAreaWrapper.tsx
│   │   └── wizard/
│   │       └── FluidProgressBar.tsx  # Custom animated progress (UI TASK)
│   ├── store/
│   │   ├── useWizardStore.ts   # Wizard state + MMKV persistence
│   │   ├── useAuthStore.ts     # Auth state (mock API)
│   │   └── storage.ts          # MMKV configuration
│   ├── utils/
│   │   └── validation.ts       # Zod validation schemas
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
// Wizard state auto-persists to MMKV
const useWizardStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      data: { step1: {...}, step2: {...}, step3: {...} },
      // Actions...
    }),
    { name: 'wizard-storage', storage: createJSONStorage(() => zustandStorage) }
  )
);
```

**Key benefits:**
- Draft data persists across app restarts
- User returns to the same step they left
- Form data is preserved until submission

### Navigation Flow (Auth Last Pattern)

```
App Start
    ↓
[Check persisted state]
    ↓
┌─────────────────────────────────────────────┐
│  WIZARD                                      │
│  Step 1 → Step 2 → Step 3                   │
│  (Data saved after each step)               │
└─────────────────────────────────────────────┘
    ↓ (completeWizard)
┌─────────────────────────────────────────────┐
│  AUTH                                        │
│  Sign Up (or Login)                          │
│  Username, Email, Phone, Password           │
└─────────────────────────────────────────────┘
    ↓ (authenticated)
┌─────────────────────────────────────────────┐
│  RESULT                                      │
│  "Offer Unlocked!" with personalized offer  │
└─────────────────────────────────────────────┘
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
