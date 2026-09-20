# AI Usage Documentation

## Project

**Barcode Inventory Counter**

**Developer:** Kaif Qureshi

## Purpose of AI Assistance

AI tools were used during development as a development assistant for tasks such as:

* Understanding technical concepts
* Debugging errors
* Reviewing implementation approaches
* Improving UI/UX ideas
* Generating development suggestions
* Writing and refining documentation
* Identifying potential edge cases
* Helping structure reusable code

The final implementation was reviewed, tested, integrated, and verified by the developer.

## Areas Where AI Assistance Was Used

### 1. Project Structure

AI assistance was used to discuss a scalable Expo Router project structure and separation between:

* Screens
* Components
* Database logic
* Services
* Utilities
* Types
* Tests

The developer implemented and integrated the resulting structure into the project.

### 2. Barcode Scanning

AI assistance helped with understanding and implementing barcode scanning using Expo Camera.

The implementation was tested on Android to verify that barcode scanning worked with the application workflow.

### 3. SQLite Database

AI assistance was used to help design the local SQLite data structure for:

* Products
* Inventory counts

The database implementation was then integrated into the application and tested through the inventory workflow.

### 4. Inventory Calculations

AI assistance helped with the logic for:

```text
Difference = Actual Quantity - Expected Quantity
```

The implementation also includes validation to prevent invalid quantities.

### 5. Expiry Date Validation

AI assistance was used to help structure expiry-date validation.

The application validates new expiry dates and identifies expired inventory records.

### 6. Product Lookup

AI assistance helped design a local-first product lookup workflow.

The application checks locally stored products before using available product data sources.

### 7. CSV Export

AI assistance was used to help implement CSV generation and Android file sharing.

The developer tested the export functionality on Android and verified that the Android share sheet opens successfully.

### 8. UI/UX

AI assistance was used for ideas related to:

* Dashboard layout
* Inventory screen organization
* Bottom navigation
* Splash screen
* Animations
* Responsive layouts
* Visual hierarchy
* Empty states
* Loading states
* Error states

The UI was reviewed and adjusted during development based on actual Android testing.

### 9. Debugging

AI assistance was used to help investigate development errors involving:

* TypeScript
* React Native
* Expo Router
* NativeWind
* Expo Camera
* SQLite
* File export
* Android behavior

Errors were tested locally after changes were made.

### 10. Testing

AI assistance helped identify utility functions that should be covered by automated tests.

Jest tests were added for inventory validation functionality.

The test suite was executed locally and verified to pass.

## Developer Verification

AI-generated suggestions were not treated as automatically correct.

Before being included in the final project, implementations were:

1. Reviewed by the developer
2. Integrated into the project
3. Run locally
4. Tested on Android where applicable
5. Adjusted when issues were discovered

The developer remains responsible for the final source code and project behavior.

## AI Limitations

AI assistance can produce incorrect or incomplete suggestions.

For this reason, generated code was not blindly copied into the application. The developer verified functionality through local testing and debugging.

## Summary

AI was used as a development assistant throughout the project, primarily for technical guidance, debugging, implementation ideas, UI/UX suggestions, and documentation.

The final application was assembled, tested, and verified by **Kaif Qureshi**.
