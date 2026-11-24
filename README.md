# TravelTest – Travel & Booking Test Automation Platform
## with Razorpay Test Mode Payment Gateway Integration

[![Live Web App](https://img.shields.io/badge/Live_App-GitHub_Pages-22c55e?style=for-the-badge&logo=github&logoColor=white)](https://ajju1020.github.io/TravelTest/)
[![Fullstack API](https://img.shields.io/badge/Fullstack_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://traveltest-platform.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Ajju1020%2FTravelTest-3b82f6?style=for-the-badge&logo=github)](https://github.com/Ajju1020/TravelTest)

---

### 🌐 Live Public Application Links
- 🚀 **Interactive Web Application (GitHub Pages)**: [https://ajju1020.github.io/TravelTest/](https://ajju1020.github.io/TravelTest/)
- ☁️ **Full-Stack Cloud Service (Render)**: [https://traveltest-platform.onrender.com](https://traveltest-platform.onrender.com)
- 📦 **GitHub Source Repository**: [https://github.com/Ajju1020/TravelTest](https://github.com/Ajju1020/TravelTest)

**TravelTest** is a modern, responsive, full-stack SaaS-style web platform built to demonstrate automated software testing, end-to-end quality assurance, and realistic online payment gateway processing across four diverse booking domains.

---

## Key Highlights & Modules

### 1. Four Booking Workflows with Integrated Checkout
1. **Bus and Train Ticket Reservation**:
   - Mode switcher (Train / Bus fleet)
   - Source & Destination selection with past date rejection and equality guards
   - Multi-passenger validation (1 to 6 passengers)
   - Interactive coach seat selection
   - Order creation -> Razorpay checkout -> PNR e-ticket generation upon verified payment
2. **Movie Ticket Booking & Seat Selection**:
   - High-definition movie catalog with ratings, certificates, and synopses
   - Multiplex cinema & showtime slot selection
   - Interactive 3-tier curved cinema seat map (Silver ₹200, Gold ₹350, Platinum Recliner ₹500)
   - Real-time seat locking preventing double-booking of reserved seats
   - Mathematical price calculator (subtotal + 18% GST + convenience fee)
   - Order creation -> Razorpay checkout -> Movie Pass generation upon verified payment
3. **On-Demand Cab Booking**:
   - Pickup & Drop inputs with popular urban hubs quick-selection
   - Immediate ride ('Book Now') or scheduled pickup with future time validation
   - 4 Cab categories: Mini, Prime Sedan, Prime SUV (6-seater), Executive Luxury EV
   - Fare formula calculation: `BaseFare + (DistanceKm * RatePerKm)`
   - Driver matching with vehicle plates, driver ratings, and 4-digit ride start OTP
   - Order creation -> Razorpay checkout -> Confirmed ride receipt upon verified payment
4. **Event Registration and Ticketing**:
   - Featured Tech & Cultural summits with agendas, venues, and dates
   - Multi-tier passes: Student Pass, General Professional Pass, VIP Executive
   - Dynamic seat inventory boundary limits
   - Attendee registration with RFC email regex validation
   - Duplicate attendee registration prevention
   - Order creation -> Razorpay checkout -> Delegate badge generation upon verified payment

---

### 2. Realistic Online Payment Gateway (Razorpay Test Mode)
- **Supported Payment Methods**:
  - **UPI**: Google Pay, PhonePe, Paytm, QR code, and Virtual Payment Address (`success@razorpay` / `failure@razorpay`)
  - **Debit and Credit Cards**: Visa, Mastercard, RuPay (with pre-filled test cards `4111 1111 1111 1111`, CVV `123`)
  - **Net Banking**: HDFC, ICICI, State Bank of India, Axis, Kotak
- **Security & Integrity**:
  - Never stores raw card numbers or CVVs (PCI DSS compliant design)
  - Backend HMAC-SHA256 signature verification (`crypto.createHmac('sha256', secret)`)
  - Prevents duplicate payment processing (idempotent verification)
  - Webhook signature verification support
- **Dedicated Payment Result Screens**:
  - **Payment Successful**: Green check icon, Transaction ID, Booking ID, Amount, Method, Download Receipt (PDF)
  - **Payment Failed**: Red alert icon, failure reason, Retry Payment, Back to Booking
  - **Payment Pending**: Amber clock icon, transaction reference, Check Status
- **Payment Management Dashboard (in Admin)**:
  - Total Transactions, Volume (₹), Success Rate %, Method breakdown (UPI vs Card vs Net Banking)
  - Filterable transactions table (All, UPI, Card, Net Banking, Successful, Failed, Pending)
  - Printable / Downloadable PDF Tax Invoice Receipt with GSTIN

---

### 3. Test Automation Command Center (38 Playwright Scenarios)
- **38 Comprehensive Automated E2E Test Scenarios**:
  - 7 tests for Bus & Train (`TC-BT-01` to `TC-BT-07`)
  - 6 tests for Movie Booking (`TC-MV-01` to `TC-MV-06`)
  - 6 tests for Cab Booking (`TC-CB-01` to `TC-CB-06`)
  - 7 tests for Event Registration (`TC-EV-01` to `TC-EV-07`)
  - **12 tests for Payment Gateway** (`TC-PAY-01` to `TC-PAY-12`):
    - `TC-PAY-01`: Open payment page
    - `TC-PAY-02`: Verify booking amount
    - `TC-PAY-03`: Click Pay Now
    - `TC-PAY-04`: Select UPI
    - `TC-PAY-05`: Select card
    - `TC-PAY-06`: Successful test payment
    - `TC-PAY-07`: Failed test payment
    - `TC-PAY-08`: Invalid payment signature rejection
    - `TC-PAY-09`: Duplicate payment request prevention
    - `TC-PAY-10`: Refresh payment page
    - `TC-PAY-11`: Payment pending
    - `TC-PAY-12`: Verify payment receipt
- **Live Test Console Modal**:
  - Real-time Server-Sent Events (SSE) streaming logs
  - Color-coded log levels (`[INFO]`, `[STEP]`, `[SUCCESS]`, `[ERROR]`)
  - Progress bar and duration timers

---

### 4. Defect Injection Simulator (Live Demonstration Mode)
In **Settings & Admin**, toggle deliberate software defects:
- Toggle 1: Allow same source and destination in Bus/Train -> `TC-BT-01` fails and logs defect
- Toggle 2: Allow double-booking of booked movie seats -> `TC-MV-04` fails and logs defect
- Toggle 3: Cab fare calculation multiplier glitch (3x) -> `TC-CB-05` fails and logs defect
- Toggle 4: Bypass duplicate event attendee email check -> `TC-EV-07` fails and logs defect

---

## Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend**: Node.js v24, Express.js, Crypto (HMAC-SHA256)
- **Payment Gateway**: Razorpay Checkout SDK & Test Mode APIs
- **Testing Engine**: Playwright, Server-Sent Events (SSE)
- **Theme**: Blue, Purple, and Clean White SaaS aesthetic

---

## Local Setup & Installation

### 1. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
RAZORPAY_KEY_ID=rzp_test_traveltest2026
RAZORPAY_KEY_SECRET=traveltest_secret_key_8849
NODE_ENV=development
```
*(You can also insert your own Razorpay Dashboard test API keys here)*

### 2. Run the Application
1. **Start Backend Server** (Port 5000):
```bash
cd server
npm run dev
```

2. **Start Frontend Client** (Port 5173):
```bash
cd client
npm run dev
```

3. Open your browser and navigate to:
- **Live Public Cloud URL**: [https://ajju1020.github.io/TravelTest/](https://ajju1020.github.io/TravelTest/)
- **Local Development URL**: [http://localhost:5173](http://localhost:5173)

### 3. Run Playwright Automated Tests via CLI
To run all 38 automated test cases directly from terminal:
```bash
cd server
npm test
```

---

## Visual Studio Code Integration

The project includes full configuration for development in **Visual Studio Code**:

1. **Open Workspace**:
   ```bash
   code C:\Users\victus\.gemini\antigravity\scratch\traveltest-platform
   ```
   Or double-click `open-in-vscode.bat`.
2. **Recommended Extensions** (`.vscode/extensions.json`):
   - **Playwright Test for VSCode** (`ms-playwright.playwright`)
   - **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - **ESLint & Prettier**
3. **Run Application**:
   - Press **`Ctrl + Shift + B`** to launch full-stack (Backend on :5000 + Frontend on :5173).
4. **Playwright Test Explorer**:
   - View, execute, and debug all 38 test scenarios from the VS Code Testing sidebar (flask icon).
5. **Debug with Breakpoints**:
   - Press **`F5`** to debug backend routes (`routes/payment.js`, `routes/bookings.js`) and test scripts.
