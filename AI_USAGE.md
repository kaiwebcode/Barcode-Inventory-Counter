# AI Usage Documentation

## Project

**Barcode Inventory Counter**

**Developer:** Kaif Qureshi

---

## 1. AI Tools Used
The following AI tool was used during development:

* **ChatGPT (OpenAI)** — used as a development assistant for technical guidance, debugging, implementation suggestions, UI/UX improvements, testing ideas, and documentation.

AI-generated suggestions were reviewed and tested by the developer before being included in the final application.

---

## 2. Purpose of AI Assistance
AI assistance was used during development for:

* Understanding technical concepts
* Debugging errors
* Reviewing implementation approaches
* Designing project structure
* Improving UI/UX
* Generating development suggestions
* Identifying edge cases
* Writing and refining documentation
* Helping structure reusable code
* Creating testing suggestions

The final implementation was reviewed, integrated, tested, and verified by the developer.

---

## 3. Five Important Prompts Used

### Prompt 1 — Barcode Scanning

> "Help me implement barcode scanning in my Expo React Native inventory application using Expo Camera. I need support for common barcode formats and I also need a manual barcode entry option."

**Purpose:** Used to design the barcode scanning and manual-entry workflow.

---

### Prompt 2 — SQLite Inventory Database

> "Create a scalable SQLite database structure for my Barcode Inventory Counter app. I need products and inventory counts, with barcode, product name, expected quantity, actual quantity, difference, expiry date, status, and timestamps."

**Purpose:** Used to design the local database structure and database helper functions.

---

### Prompt 3 — Inventory Validation

> "Help me implement inventory validation where difference is actual quantity minus expected quantity, quantities cannot be negative, and expiry dates cannot be in the past."

**Purpose:** Used to structure reusable inventory validation utilities and edge-case handling.

---

### Prompt 4 — CSV Export

> "Help me export inventory records to a CSV file in my Expo Android application and allow the user to share the generated file using the Android share sheet."

**Purpose:** Used to implement CSV generation and Android file sharing.

---

### Prompt 5 — UI and Dashboard

> "Improve the UI of my Barcode Inventory Counter app. I need a professional dashboard, floating bottom navigation, a polished splash screen, responsive layouts, loading states, empty states, and smooth animations."

**Purpose:** Used to improve the visual structure and user experience of the application.

---

## 4. Code Generated or Assisted by AI

AI assistance contributed to code and implementation ideas in several areas of the project.

### Database

AI helped generate and structure:

* SQLite table definitions
* Product database helpers
* Inventory database helpers
* Insert/update/upsert logic
* Database retrieval functions

### Inventory Logic

AI helped with:

* Quantity validation
* Difference calculation
* Expiry-date validation
* Expired-status detection
* Date parsing utilities

The core calculation is:

```text
Difference = Actual Quantity - Expected Quantity
```

### Barcode/Product Workflow

AI helped structure:

* Barcode scanner screen
* Manual barcode entry
* Product lookup flow
* Unknown-product handling
* Add-new-product flow

### Export

AI helped implement:

* CSV formatting
* CSV escaping
* File creation
* Android sharing

### UI

AI assisted with implementation ideas and code for:

* Dashboard cards
* Inventory list
* Floating tab navigation
* Splash screen
* Animations
* Loading/error/empty states
* Responsive layouts

All AI-assisted code was reviewed, modified where necessary, and tested by the developer.

---

## 5. AI Mistakes Found During Development

AI-generated code was not always correct. The following issues were identified during development and corrected.

### Mistake 1 — Invalid Ionicons Name

AI suggested an Ionicons icon name that was not accepted by the installed Expo/Ionicons TypeScript definitions.

This caused a TypeScript error because the icon name was not part of the supported icon-name type.

#### How it was corrected

The unsupported icon name was replaced with a valid Ionicons name supported by the installed package.

The project was then checked using:

```powershell
npx tsc --noEmit
```

The TypeScript error was resolved.

---

### Mistake 2 — React Native Text Rendering Error

During the splash/tab UI implementation, an invalid text fragment was accidentally rendered outside a React Native `<Text>` component.

Android produced the runtime error:

```text
Text strings must be rendered within a <Text> component
```

#### How it was corrected

The component tree was inspected and the stray text fragment was removed/restructured so that only valid text was rendered inside `<Text>` components.

The application was restarted and tested again on Android to verify that the runtime error was resolved.

---

## 6. Developer Verification

AI-generated suggestions were not treated as automatically correct.

Before being included in the final project, implementations were:

1. Reviewed by the developer
2. Integrated into the project
3. Run locally
4. Tested on Android where applicable
5. Debugged when errors occurred
6. Modified when AI-generated suggestions were incorrect
7. Verified against the actual application workflow

Automated validation was also performed for the inventory utility functions using Jest.

---

## 7. Testing

The project includes automated tests for inventory validation functionality.

The test suite was executed locally using:

```powershell
npm test
```

The TypeScript project was also checked using:

```powershell
npx tsc --noEmit
```

Android functionality was manually tested for:

* Barcode scanning
* Manual barcode entry
* Product lookup
* Adding products
* Inventory counting
* Quantity calculations
* Expiry validation
* Duplicate barcode handling
* Local persistence
* CSV export
* Android file sharing
* Navigation
* Splash screen

---

## 8. AI Limitations

AI assistance can produce incorrect, incomplete, or incompatible code.

Examples encountered in this project included an unsupported icon name and a React Native text-rendering issue.

Therefore, AI-generated code was not blindly copied into the application. Suggestions were reviewed, tested, and corrected when necessary.

---

## 9. Final Responsibility

AI was used as a development assistant and not as an automatic replacement for developer verification.

The final source code, application behavior, testing, integration, and submitted project were reviewed and verified by:

**Kaif Qureshi**

---

## Summary

AI assistance was used throughout the project for technical guidance, debugging, implementation ideas, UI/UX improvements, testing suggestions, and documentation.

The developer reviewed and tested the AI-assisted implementation and corrected issues discovered during development.

The final application was assembled, tested, and verified by **Kaif Qureshi**.
