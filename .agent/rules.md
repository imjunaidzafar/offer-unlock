# AI Agent Governance Rules

## Project Context
This is a React Native CLI app for a coding challenge. The goal is to demonstrate:
1. Clean architecture and code organization
2. Custom UI component development (animated progress bar)
3. Proper form handling with validation
4. State persistence across app restarts
5. Comprehensive testing

## When Generating Code

### Always
- Use TypeScript with strict types
- Follow the file structure defined in .cursorrules
- Add proper error handling
- Consider edge cases (empty states, loading, errors)
- Use existing patterns from the codebase

### Never
- Generate placeholder implementations
- Skip validation logic
- Use deprecated APIs
- Ignore safe area constraints
- Create overly complex solutions

## Specific Component Guidelines

### FluidProgressBar (UI Task)
- Must use react-native-reanimated directly
- Animate with withSpring or withTiming
- Support currentStep and totalSteps props
- Include step indicators with scale animations
- Implement easing for smooth transitions

### Wizard Forms
- Use react-hook-form with zodResolver
- Auto-save to Zustand store on valid changes
- Disable "Next" until form is valid
- Show inline validation errors

### Authentication
- Validate: username, email, phone (E.164), password
- Handle: invalid input, network errors, duplicate accounts
- Show appropriate error messages for each case

## Testing Requirements
- Validation schemas: test all rules and edge cases
- Store persistence: test save, load, and clear operations
- Navigation: test wizard step transitions

## Review Checklist
Before finalizing any code, verify:
- [ ] Types are properly defined
- [ ] Safe areas are handled
- [ ] Forms have validation
- [ ] Errors are caught and displayed
- [ ] Tests cover the functionality
