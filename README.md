# Barcode Inventory Counter

A modern Android inventory management application built with **Expo, React Native, TypeScript, NativeWind, and SQLite**.

The app is designed to make physical inventory counting faster and more reliable by allowing users to scan product barcodes, maintain product information, record stock quantities, validate expiry dates, and export inventory records as CSV.

## ✨ Features

* 📷 Barcode scanning using the device camera
* ⌨️ Manual barcode entry
* 🔎 Product lookup
* 🆕 Add new products when a barcode is not found
* 💾 Local SQLite database for offline-first inventory management
* 📦 Expected quantity and actual quantity tracking
* ➕ Automatic quantity difference calculation
* 🔄 Duplicate barcode count merging
* 📅 Expiry date selection and validation
* ⚠️ Expired product detection
* 📋 Pending and submitted inventory status
* 🔁 Local retry flow for inventory submission
* 📊 Dashboard with inventory statistics
* 📄 CSV inventory export
* 📤 Android share sheet for exported CSV files
* 🎨 Responsive and modern mobile UI
* ✨ Animated splash screen
* 🧪 Unit tests for inventory validation utilities

## 🛠️ Tech Stack

| Technology      | Purpose                             |
| --------------- | ----------------------------------- |
| Expo            | React Native development platform   |
| React Native    | Mobile application framework        |
| Expo Router     | File-based navigation               |
| TypeScript      | Type-safe development               |
| NativeWind      | Utility-first styling               |
| SQLite          | Local inventory and product storage |
| Expo Camera     | Barcode scanning                    |
| Expo FileSystem | CSV file creation                   |
| Expo Sharing    | Sharing exported inventory files    |
| Jest            | Unit testing                        |
| Jest Expo       | Expo-compatible testing environment |

## 📱 Application Flow

```text
Splash Screen
     ↓
Dashboard
     ↓
Scan / Enter Barcode
     ↓
Product Lookup
     ↓
 ┌───────────────────────┐
 │ Product Found         │
 │         OR            │
 │ Product Not Found     │
 └───────────────────────┘
     ↓
Inventory Count
     ↓
Validate Quantity
     ↓
Validate Expiry Date
     ↓
Save to SQLite
     ↓
Pending / Submitted
     ↓
Export Inventory as CSV
```

## 📂 Project Structure

```text
Barcode-Inventory-Counter/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── modal.tsx
│   │
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       └── inventory.tsx
│
├── components/
│   └── ...
│
├── constants/
│   └── ...
│
├── database/
│   ├── inventory-db.ts
│   └── product-db.ts
│
├── services/
│   ├── inventory-export.ts
│   ├── inventory-service.ts
│   └── product-service.ts
│
├── tests/
│   └── inventory-validation.test.ts
│
├── types/
│   └── inventory.ts
│
├── utils/
│   └── inventory-validation.ts
│
├── assets/
│   └── ...
│
├── AI_USAGE.md
├── README.md
├── package.json
└── tsconfig.json
```

## 💾 Local Database

The application uses SQLite for local persistence.

### Products

The products table stores:

* Barcode
* Product name
* Expected quantity
* Creation timestamp

### Inventory Counts

The inventory counts table stores:

* Inventory ID
* Barcode
* Product name
* Expected quantity
* Actual quantity
* Difference
* Expiry date
* Status
* Creation timestamp

The database allows inventory data to remain available even when the device is offline.

## 🔢 Inventory Calculation

The application calculates the inventory difference using:

```text
Difference = Actual Quantity - Expected Quantity
```

For example:

```text
Expected Quantity = 20
Actual Quantity   = 17

Difference = 17 - 20
           = -3
```

A negative difference indicates that fewer items were counted than expected.

## 📅 Expiry Validation

The application prevents users from creating inventory records with an expiry date in the past.

Expiry dates are stored and displayed using a user-friendly date format.

The application also identifies existing expired inventory records so they can be clearly highlighted.

## 📷 Barcode Scanning

The camera scanner supports commonly used barcode formats including:

* EAN-13
* EAN-8
* UPC-A
* UPC-E
* Code 128
* Code 39
* Code 93
* ITF-14
* Codabar
* QR codes

Users can also enter a barcode manually when camera scanning is not suitable.

## 🌐 Product Lookup

Product lookup follows a local-first approach:

```text
Barcode
   ↓
Local SQLite Database
   ↓
Mock / Available Product Data
   ↓
Open Food Facts API
   ↓
Product Found?
   ├── Yes → Save Product Locally
   └── No  → Add New Product
```

Saving discovered products locally reduces the need to repeatedly request external product information.

## 📄 CSV Export

Inventory records can be exported as a CSV file.

The exported data includes inventory information such as:

* Barcode
* Product name
* Expected quantity
* Actual quantity
* Difference
* Expiry date
* Status
* Creation date

On Android, the generated CSV can be shared through the system share sheet.

## 🔄 Inventory Submission

The current project uses a simulated inventory submission service for the assessment.

The service validates the inventory data locally and simulates a submission request.

It is structured as a separate service so it can be replaced with a real backend API in the future without changing the inventory UI and database architecture.

## 🧪 Testing

Unit tests are included for inventory validation utilities.

Run:

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

The tests cover functionality including:

* Quantity validation
* Difference calculation
* Date parsing
* Expiry validation
* Expired inventory detection

## 🚀 Getting Started

### Requirements

Make sure you have:

* Node.js installed
* npm installed
* Android Studio / Android emulator, or
* A physical Android device

### Installation

Clone the repository:

```bash
git clone https://github.com/kaiwebcode/Barcode-Inventory-Counter.git
```

Move into the project:

```bash
cd Barcode-Inventory-Counter
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

For Android:

```bash
npx expo start --android
```

To clear the Expo cache:

```bash
npx expo start -c
```

## 🔍 Type Checking

Run TypeScript checking with:

```bash
npx tsc --noEmit
```

The project should complete without TypeScript errors.

## 📦 Building the Android APK

The Android application can be built using Expo's build tooling.

For a development build:

```bash
npx expo run:android
```

For an EAS Android build, configure EAS and run:

```bash
npx eas build -p android
```

The resulting APK/AAB can then be used for testing or submission according to the assessment requirements.

## 🔐 Privacy & Data

Inventory and product records are primarily stored locally using SQLite.

The application does not require a user account for the core local inventory functionality.

External product information may be requested when a barcode is not available locally.

## 🎯 Assessment Notes

This project was developed as part of a technical assessment.

The application focuses on:

* Practical mobile UX
* Barcode-based inventory workflows
* Offline/local data persistence
* Data validation
* Reusable service architecture
* Error handling
* Automated testing
* CSV data export
* Responsive UI design

## 👨‍💻 Author

**Kaif Qureshi**

Frontend / Full-Stack Developer

Built with React Native, Expo, TypeScript, SQLite, and NativeWind.

## 📄 License

This project was created for educational and technical assessment purposes.
