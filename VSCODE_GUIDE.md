# 💻 Developing TravelTest in Visual Studio Code (VS Code)

This guide walks you through opening, running, debugging, and testing **TravelTest – Travel & Booking Automation Platform** directly in **Visual Studio Code**.

---

## 🚀 Quick Start (1-Click Open)

### Method 1: Using the Terminal / CLI
Open a PowerShell or Command Prompt terminal and run:
```powershell
code "C:\Users\victus\.gemini\antigravity\scratch\traveltest-platform"
```

### Method 2: From VS Code UI
1. Launch **Visual Studio Code**.
2. Click **File** > **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
3. Browse to `C:\Users\victus\.gemini\antigravity\scratch\traveltest-platform` and click **Select Folder**.

### Method 3: Using the Windows Batch Launcher
Double-click `open-in-vscode.bat` inside the project folder.

---

## 🧩 Recommended VS Code Extensions

When you open this folder, VS Code will prompt you with a notification:  
*"This workspace has recommended extensions. Do you want to install them?"*  
Click **Install All**.

The configured `.vscode/extensions.json` includes:
- **Playwright Test for VSCode** (`ms-playwright.playwright`) — Run and debug Playwright tests directly from editor gutters and the Test Explorer.
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — Autocomplete, syntax highlighting, and linting for Tailwind CSS classes.
- **Prettier - Code Formatter** (`esbenp.prettier-vscode`) — Auto-formats JavaScript, JSX, and JSON on save.
- **ESLint** (`dbaeumer.vscode-eslint`) — Real-time JavaScript code quality checks.
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`) — Keeps HTML/JSX tags synchronized.

---

## ⚡ Starting the Application

### Option A: VS Code Build Shortcut (Fastest)
Press **`Ctrl + Shift + B`** (or go to **Terminal** > **Run Build Task...**).
- This launches the configured compound task: **`Start Fullstack Platform (Client + Server)`**.
- VS Code opens two split terminal panes:
  1. `Backend Server (Port 5000)`: Node.js Express server.
  2. `Frontend Vite (Port 5173)`: Vite development server.
- Open your browser at **http://localhost:5173**.

### Option B: Built-in Terminal
Press **`` Ctrl + ` ``** to open the integrated terminal:
```powershell
# In terminal 1 (Backend):
cd server
npm run dev

# In terminal 2 (Frontend - click the '+' or split icon in terminal):
cd client
npm run dev
```

### Option C: Standalone Batch Script
Double-click `start-all.bat` in the project root. It starts both servers in separate windows and automatically launches your browser.

---

## 🧪 Running & Debugging Automated Tests in VS Code

### 1. Using the Playwright Test Explorer GUI (Recommended)
1. Click the **Testing** icon (the beaker/flask 🧪) in the left Activity Bar (or press `Ctrl + Shift + T`).
2. You will see all **38 automated test cases** categorized by module:
   - 🚆 **Module 1**: Bus and Train Reservation (`TC-BT-01` to `TC-BT-07`)
   - 🎬 **Module 2**: Movie Ticket Booking (`TC-MV-01` to `TC-MV-06`)
   - 🚖 **Module 3**: Cab Booking (`TC-CB-01` to `TC-CB-06`)
   - 🎫 **Module 4**: Event Registration (`TC-EV-01` to `TC-EV-07`)
   - 💳 **Module 5**: Payment Gateway (`TC-PAY-01` to `TC-PAY-12`)
3. Click the **green Play button** ▶️ next to any test to run it instantly.
4. Click the **Debug Test** button to step through execution, inspect variables, and watch live DOM locators.
5. In any `.spec.js` file, click the green arrow in the line-number gutter to run that exact scenario.

### 2. Using Playwright UI Inspector (Visual Time-Travel Runner)
- From VS Code: Press `Ctrl + Shift + P` > **Tasks: Run Task** > **`Open Playwright Test UI Inspector`**.
- Or run in terminal:
  ```powershell
  cd server
  npx playwright test --ui
  ```
- Or double-click `run-playwright-ui.bat`.

### 3. Headless CLI Run
```powershell
cd server
npm test
```
Or run `run-playwright-tests.bat`.

---

## 🐞 Debugging with Breakpoints

The project includes pre-configured debug profiles in `.vscode/launch.json`:

1. Open the **Run and Debug** view (`Ctrl + Shift + D`).
2. Select your target configuration from the dropdown:
   - **`Debug Backend Server (Node.js)`**: Sets breakpoints inside Express routes (`server/routes/payment.js`, `server/routes/bookings.js`, `server/services/testRunner.js`).
   - **`Launch Frontend in Chrome`**: Attaches Chrome DevTools debugger to React components.
   - **`Full Stack (Debug Backend + Open Chrome)`**: Launches backend and browser together.
   - **`Debug Playwright Tests (Interactive)`**: Runs test runner with `--debug` flag and step-by-step inspector.
3. Press **`F5`** to start debugging.

---

## 📁 Workspace Directory Structure

```
traveltest-platform/
├── .vscode/                       # VS Code workspace configurations
│   ├── extensions.json            # Recommended extensions
│   ├── launch.json                # F5 Debugger configurations
│   ├── settings.json              # Playwright & editor settings
│   └── tasks.json                 # Pre-configured Ctrl+Shift+B tasks
├── client/                        # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/            # UI components (Payment modal, SeatGrid, etc.)
│   │   ├── pages/                 # 12 SaaS application pages
│   │   ├── context/               # Booking & Auth state context
│   │   └── App.jsx                # Router & layout
│   └── package.json
├── server/                        # Node.js + Express Backend
│   ├── routes/                    # API endpoints (payment, bookings, tests)
│   ├── services/                  # Test runner & data store services
│   ├── tests/                     # 38 Playwright automated test specs
│   ├── data/store.json            # Persistent JSON database
│   ├── playwright.config.js       # Playwright configuration
│   └── server.js                  # Main server entrypoint
├── playwright.config.js           # Root Playwright configuration
├── package.json                   # Root workspace scripts
├── start-all.bat                  # One-click Windows launcher
├── run-playwright-tests.bat       # Headless test runner script
├── run-playwright-ui.bat          # Playwright UI mode script
├── open-in-vscode.bat             # Open in VS Code launcher
└── README.md                      # Platform documentation
```
