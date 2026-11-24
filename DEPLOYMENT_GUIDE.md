# 🌐 How to Deploy TravelTest to GitHub with a Public Accessible Link

This guide provides step-by-step instructions to:
1. **Push your code to GitHub** (repository: `Ajju1020/TravelTest`)
2. **Deploy it with a 100% free, publicly accessible HTTPS link** (anyone on the internet can view, interact with, and test the platform).

---

## 📌 Deployment Overview

Since **TravelTest** is a full-stack platform (React Frontend + Node.js Express Backend with Razorpay Payment Verification & Playwright Automation APIs), the recommended deployment strategy is:

| Platform | Type | Cost | Public Link Example | Setup Time |
| :--- | :--- | :--- | :--- | :--- |
| **Render.com** (Recommended) | **Full-Stack (Frontend + Backend on 1 URL)** | Free | `https://traveltest-platform.onrender.com` | 2 minutes |
| **Railway.app** | Full-Stack Container | Free trial | `https://traveltest.up.railway.app` | 2 minutes |
| **Vercel** | Frontend (SPA) | Free | `https://traveltest.vercel.app` | 1 minute |

> [!TIP]
> **Why Render.com is recommended:** The platform backend (`server/server.js`) has been pre-configured to build and serve the React client (`client/dist`). Deploying to Render gives you a **single public HTTPS link** where all 4 booking modules, Razorpay test checkout, and automated testing APIs work seamlessly without CORS or configuration hassles.

---

## 🚀 Part 1: Push Project to GitHub

Open a terminal (PowerShell, Command Prompt, or VS Code integrated terminal) in `C:\Users\victus\.gemini\antigravity\scratch\traveltest-platform`:

```powershell
# 1. Navigate to the project directory
cd "C:\Users\victus\.gemini\antigravity\scratch\traveltest-platform"

# 2. Stage all files (configurations, VS Code setups, scripts, and deployment files)
git add .

# 3. Commit the changes
git commit -m "Add VS Code configurations, automated scripts, and cloud deployment setup"

# 4. Push to your GitHub repository
git push -u origin main
```

> **Note on Authentication:** If GitHub prompts for credentials:
> - Username: your GitHub username (`Ajju1020`)
> - Password: Use a **GitHub Personal Access Token (PAT)** (created at GitHub -> Settings -> Developer Settings -> Personal Access Tokens -> Tokens (classic) with `repo` scope).

Your code is now published to:  
👉 **`https://github.com/Ajju1020/TravelTest`**

---

## 🌍 Part 2: Deploy to Render.com (Recommended - 1-Click Free Public Link)

Render automatically detects the included `render.yaml` blueprint.

### Step 1: Create a Free Account
1. Visit **[https://render.com](https://render.com)**.
2. Sign up / log in with your **GitHub** account.

### Step 2: Create New Web Service
1. On your Render Dashboard, click the **New +** button at the top right.
2. Select **Web Service**.
3. Under **Connect a repository**, select **`Ajju1020/TravelTest`** (or paste `https://github.com/Ajju1020/TravelTest`).
4. Click **Connect**.

### Step 3: Configure Settings
Fill in the simple form (most will be auto-detected):
- **Name**: `traveltest-platform` (or any name you prefer)
- **Region**: Choose the closest region (e.g., Singapore, Frankfurt, Oregon)
- **Branch**: `main`
- **Root Directory**: *(leave blank)*
- **Runtime**: `Node`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Instance Type**: **Free** ($0/month)

### Step 4: Environment Variables
Scroll to **Environment Variables** and add:
| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `RAZORPAY_KEY_ID` | `rzp_test_traveltest2026` |
| `RAZORPAY_KEY_SECRET` | `traveltest_secret_key_8849` |

*(Render automatically injects `PORT`)*

### Step 5: Click "Deploy Web Service"
1. Click **Create Web Service** at the bottom.
2. Render will install dependencies, build the React frontend, start the Express backend, and display the live deployment log.
3. Once completed (usually 1–2 minutes), your **live public URL** is displayed at the top:
   ```
   https://traveltest-platform.onrender.com
   ```
4. **Anyone can now access this link from any device or browser worldwide!** 🎉

---

## ⚡ Part 3: Deploy to Vercel (Alternative - Frontend Only)

If you prefer to deploy on **Vercel**:

1. Go to **[https://vercel.com](https://vercel.com)** and log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Import your **`Ajju1020/TravelTest`** repository.
4. The included `vercel.json` will automatically configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build --prefix client`
   - **Output Directory**: `client/dist`
5. Click **Deploy**.
6. Within 30 seconds, Vercel gives you a public link:  
   `https://traveltest-xxxx.vercel.app`.

---

## 🧪 Verifying Your Live Public Deployment

Once deployed, visit your public URL to verify all features:
1. **Bus & Train Reservation**: Search routes (e.g., Delhi to Mumbai) and test booking.
2. **Movie Ticket Booking**: Pick a showtime and select seats on the interactive map.
3. **Cab Booking**: Select cab category (Sedan / SUV) and calculate dynamic fares.
4. **Event Registration**: Reserve passes for tech summits.
5. **Razorpay Payment Gateway**:
   - Complete checkout with test UPI (`success@razorpay`) or test card (`4111 1111 1111 1111`).
   - Verify transaction receipt and download tax invoice.
6. **Live Test Automation Console**: Run tests and review execution telemetry.
