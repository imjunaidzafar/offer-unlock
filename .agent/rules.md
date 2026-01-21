# Code Generation Policies

## Objective
Build a production-quality React Native app demonstrating:
- Modular architecture
- Custom animation components
- Robust form handling
- Data persistence
- Test coverage

## Generation Rules

### Required Practices
1. TypeScript with explicit types
2. Adhere to directory structure in .cursorrules
3. Comprehensive error handling
4. Edge case coverage (empty, loading, error states)
5. Consistent with existing codebase patterns

### Forbidden Practices
1. Stub or placeholder code
2. Skipped validation
3. Deprecated APIs
4. Ignored safe area insets
5. Over-engineered solutions

## Component Specifications

### AnimatedStepIndicator
```
Requirements:
- Built with react-native-reanimated
- Spring/timing animations
- Props: currentStep, totalSteps
- Step circles with scale effect
- Smooth easing transitions
```

### Onboarding Forms
```
Requirements:
- react-hook-form + zodResolver
- Auto-persist valid data to store
- Disabled navigation until valid
- Inline validation feedback
```

### Session Management
```
Requirements:
- Validate: username, email, phone, password
- Handle: validation errors, network issues, duplicates
- User-friendly error messages
```

## Test Coverage

| Area | Requirements |
|------|--------------|
| Schemas | All rules, boundary cases |
| State | CRUD operations, persistence |
| Navigation | Screen transitions |

## Pre-Commit Checklist
- [ ] Explicit types defined
- [ ] Safe areas respected
- [ ] Validation implemented
- [ ] Errors handled gracefully
- [ ] Tests written
