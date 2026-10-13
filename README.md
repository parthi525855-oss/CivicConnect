# CivicConnect – Smart Civic Issue Reporting & Resolution System
> **College Major Project & Final Submission Technical Report**
> A full-stack civic-technology web application empowering citizens to report local civic hazards, track grievance resolution timelines, and assist municipal authorities with transparent, data-driven triage.

---

## 1. Project Overview & Problem Statement

### Problem Statement
In traditional municipal grievance redressal systems, citizens encounter major bottlenecks:
* **Opaque Tracking:** Citizens lack visibility into grievance stages once a complaint is filed.
* **Communication Void:** Absence of direct feedback, progress timelines, or official administrator remarks.
* **Redundant Reports:** Neighbors repeatedly submit identical complaints for the same road, water, or garbage hazard.
* **Triage Delays:** Critical public safety risks (e.g. open manholes, live wires, water main bursts) are lost in manual paper/telephonic queues.

### The Solution: CivicConnect
**CivicConnect** bridges the gap between citizens and municipal corporations:
1. **Effortless Intake:** Citizens capture and report local civic hazards with photo evidence, categories, descriptions, landmarks, and automatic sequential complaint IDs (`CIV-YYYY-XXXX`).
2. **Transparent 6-Stage Lifecycle:** Visual status tracker (*Reported → Under Review → Assigned → In Progress → Resolved → Closed*).
3. **Community Endorsement (Upvoting):** Neighbors upvote existing reports instead of filing duplicates, signaling real-world urgency.
4. **Deterministic Rule-Based Priority Engine:** Transparently calculates priority (*NORMAL, MEDIUM, HIGH*) using category weights, safety hazard keywords, and citizen endorsement count.
5. **Interactive Community Map:** Leaflet + OpenStreetMap geographic visualization of neighborhood issues.
6. **Municipal Admin Command Console:** Status advancement, official remarks logging, automated citizen notifications, and analytics powered by Recharts.

---

## 2. Key Features

### For Citizens
* 🔐 **Secure Authentication:** JWT authentication with salted bcrypt password hashing and strictly enforced citizen role assignment.
* 📝 **Grievance Reporting:** Category selector, description, locality, landmark, photo upload (up to 5 MB with type validation), and coordinates.
* 📊 **Citizen Dashboard:** KPI cards (*Total Reports, Pending Review, In Progress, Resolved*), real-time search, category & status filtering.
* 📈 **Visual Progress Timeline:** Step-by-step audit tracker with timestamps, status progression, and official municipal remarks.
* 👍 **Community Support / Upvoting:** Single-click endorsement preventing duplicate tickets; dynamically updates issue priority.
* 🔔 **Near-Real-Time Notification Polling:** Automated in-app notifications dispatched when municipal officers update complaint status or remarks (polled at 20-second intervals).
* 👤 **Citizen Profile:** View personal civic statistics, contact details, and submission history.
* 💡 **Civic Awareness Guide:** Waste segregation guidelines, water conservation, and road etiquette.
* 🌓 **Dark / Light Theme:** Modern toggleable UI theme.

### For Municipal Administrators
* 🛡️ **Role-Guarded Admin Console:** Protected dashboard accessible exclusively by authenticated municipal officers.
* 📋 **Issue Management Table:** Complete audit register with search, status filters, priority flags, and report management.
* ⚙️ **Triage Control Room:** Advance workflow stages, override priority ratings, and append official public remarks.
* 📊 **Interactive Analytics (Recharts):**
  * Incident volume by Category (Bar Chart)
  * Status distribution pipeline (Donut Chart)
  * Monthly reporting velocity vs resolution rates (Area Chart)
* 🗺️ **Geographic Issue Pinning:** Leaflet map displays category-coded pins with interactive details.

---

## 3. Technology Stack

| Layer | Technologies Used | Description |
|---|---|---|
| **Frontend Framework** | **React 19 + Vite** | Fast modern single-page application with modular component architecture |
| **Routing** | **React Router DOM v7** | Client-side routing with role-based protected route wrappers |
| **Icons & UI** | **Lucide React** | Modern SVG iconography |
| **Data Visualization** | **Recharts** | Interactive charts for administrative metrics |
| **Mapping Engine** | **Leaflet + OpenStreetMap** | Open-source interactive map without proprietary API keys |
| **HTTP Client** | **Axios** | Interceptor-driven client with automatic JWT token attachment |
| **Backend Framework** | **Node.js + Express.js** | Modular RESTful API server with route separation |
| **Database** | **MongoDB + Mongoose** | Primary document database with schemas, validation, and indexes |
| **Offline Resilience** | **Dual-Mode JSON Engine** | Built-in data fallback (`server/data/store.js`) ensuring demo reliability if MongoDB is absent |
| **Authentication & Security** | **JWT + bcryptjs** | Stateless bearer token authentication, bcrypt password hashing, and role verification |
| **File Handling** | **Multer** | Local filesystem uploads with 5 MB cap, image MIME-type filter, and static streaming from `/uploads` |

> [!NOTE]
> **Media Storage Notice:** For this college project demonstration, uploaded images are safely stored on the local filesystem (`server/uploads/`). In cloud/serverless deployments, object storage (such as AWS S3 or Cloudflare R2) should be connected for persistent multi-instance file storage.

---

## 4. Security Architecture & Hardening

* **Public Registration Enforcement:** Public registration (`POST /api/auth/register`) strictly assigns `role: 'citizen'`. Any user-supplied role from the client is ignored by the backend, completely preventing privilege escalation.
* **Safe Admin Account Setup:** Public creation of admin accounts is disabled. Admins are initialized securely via an environment-driven seed script (`npm run create-admin`).
* **Environment-Driven Secrets:** All JWT signing utilizes `process.env.JWT_SECRET`. Production mode terminates if `JWT_SECRET` is omitted.
* **Origin-Checked CORS:** Cross-Origin Resource Sharing validates against `CLIENT_URL` and development origins rather than insecure wildcard origins with credentials.
* **Upload Validation:** Strict 5 MB maximum file limit and MIME-type verification (JPEG, PNG, WEBP, GIF), returning HTTP 400 on violations.
* **Safe Search Queries:** Search input is sanitized with regex escaping to prevent RegExp injection or runtime server errors.
* **Role-Based Authorization:** Backend endpoints strictly enforce `protect` and `requireAdmin` middleware guards regardless of frontend state.

---

## 5. System Architecture & Workflow

```text
Browser (Citizen / Admin)
        │
        ▼ (Port 5173 / Production URL)
React 19 Frontend (Vite)
  ├── AuthContext (JWT & Role State)
  ├── Issue Management, Leaflet Map & Recharts
  └── 20s Notification Polling
        │
        ▼ (Axios REST Requests / Bearer Token)
Node.js Express Server (Port 5000)
  ├── CORS & Rate-Safety Middleware
  ├── JWT Auth Middleware & Role Guard
  ├── Multer File Upload (5 MB cap, image-only)
  ├── Sequential Complaint ID Generator (CIV-YYYY-XXXX)
  ├── Rule-Based Smart Priority Engine
  └── Dual-Mode Data Service
        │
        ├── Primary: MongoDB + Mongoose (when configured)
        └── Resilient Fallback: Persistent Local Store (server/data/db.json)
```

### Status Lifecycle Workflow
Complaints progress through a controlled 6-stage lifecycle:
```text
Reported ──▶ Under Review ──▶ Assigned ──▶ In Progress ──▶ Resolved ──▶ Closed
                                ▲                                         │
                                └──────────── (Reopen if needed) ─────────┘
```

### Priority Engine Rules
The system evaluates report priority transparently using predefined deterministic logic:
1. **Critical Safety Alert (HIGH):** High-impact category (`Water`, `Drainage`, `Roads`) combined with risk keywords (`hazard`, `danger`, `overflow`, `accident`, `burst`, `leakage`, `exposed wire`, `sinkhole`).
2. **Community Concern Threshold (HIGH / MEDIUM):**
   * **16+ endorsements:** Elevates ticket to **HIGH**.
   * **6–15 endorsements:** Elevates ticket to **MEDIUM**.
3. **Expedited Municipal Category (MEDIUM):** Reports filed under essential infrastructure categories.
4. **Baseline Criteria (NORMAL):** Standard civic grievances.
5. **Administrative Override:** Municipal officers retain the ability to manually override ticket priority with an official justification.

---

## 6. Installation & Setup Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* *(Optional)* Local MongoDB or MongoDB Atlas cluster (the persistent JSON data engine automatically runs if MongoDB is not present).

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```
*Or install individually:*
```bash
npm install --prefix server
npm install --prefix client
```

### Step 2: Configure Environment Variables
Copy the template files:
```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

**`server/.env` template:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/civicconnect
JWT_SECRET=replace_with_your_secure_random_jwt_secret_key_minimum_32_chars
CLIENT_URL=http://localhost:5173

# Admin Initial Seed Credentials
ADMIN_NAME=Municipal Administrator
ADMIN_EMAIL=admin@civicconnect.gov
ADMIN_PASSWORD=admin123
```

**`client/.env` template:**
```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Initialize Safe Admin Account
Create the initial administrator account from environment variables:
```bash
npm run create-admin
```
*(Prevents duplicate accounts if already initialized).*

### Step 4: (Optional) Re-Seed Initial Demo Data
To reset or re-seed sample users, complaints, and notifications:
```bash
npm run seed
```

---

## 7. Running the Application

### Development Mode (Two Terminals)

**Terminal 1 — Backend API:**
```bash
npm run server
# Runs at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 — Frontend Client:**
```bash
npm run client
# Runs at http://localhost:5173
```

---

## 8. Production Build

To compile the frontend application for production deployment:
```bash
npm run build
```
The optimized production bundle is generated into `client/dist/`.

To start the backend in production mode:
```bash
npm run start
```

---

## 9. Automated Testing Suite

The repository includes a comprehensive, automated test suite covering API routes, authentication flows, authorization boundaries, file upload constraints, and negative security scenarios:

```bash
npm test
```

### Test Coverage Highlights:
* ✓ Server health verification (`GET /api/health`)
* ✓ **Security Negative Test 1:** Register with `role="admin"` → strictly forced to `role="citizen"`
* ✓ **Security Negative Test 2:** Citizen calling admin dashboard → HTTP 403 Forbidden
* ✓ **Security Negative Test 3:** Unauthenticated call to protected endpoint → HTTP 401 Unauthorized
* ✓ **Security Negative Test 4:** Citizen attempting to modify another user's issue → HTTP 403 Forbidden
* ✓ **Security Negative Test 5:** Tampered/invalid JWT signature → HTTP 401 Unauthorized
* ✓ **Security Negative Test 6:** Non-image file upload (`text/plain`) → HTTP 400 Bad Request
* ✓ **Security Negative Test 7:** Oversized file upload (> 5 MB) → HTTP 400 Bad Request
* ✓ **Search Input Safety:** Special regex characters (`(`, `*`, `+`) handled safely without crashing
* ✓ Upvote endorsement & toggle mechanism
* ✓ Status workflow validation & duplicate status rejection
* ✓ Sequential complaint ID generation (`CIV-YYYY-XXXX`)
* ✓ Backward-compatible optional pagination (`?page=1&limit=10`)

---

## 10. Demo Credentials for Viva / Evaluation

Pre-seeded accounts available on the login page:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Municipal Administrator** | `admin@civicconnect.gov` | `admin123` | Full admin console, status triage, charts, remarks |
| **Citizen (Rajesh)** | `rajesh.kumar@example.com` | `citizen123` | Issue reporting, profile, community upvoting |
| **Citizen (Priya)** | `priya.sharma@example.com` | `citizen123` | Issue reporting, notifications, community feed |
| **Citizen (Anand)** | `anand.v@example.com` | `citizen123` | Active citizen reports & personal tracker |

---

## 11. Viva Explanation Summary

> *"CivicConnect is a full-stack civic technology platform built using React 19, Vite, Node.js, Express, and MongoDB. The system adheres to strict RESTful principles with stateless JWT authentication and role-based access control. Public registrations are strictly restricted to the citizen role to eliminate privilege escalation.
>
> The platform features a deterministic rule-based priority engine that evaluates risk keywords, category criticality, and community upvotes. In addition, an interactive Leaflet/OpenStreetMap interface provides spatial context for grievances, while in-app notification polling keeps citizens informed of administrative updates. To ensure uninterrupted resilience during demonstrations, the server employs a Repository pattern that connects to MongoDB when present and transparently falls back to a persistent local store if a database service is unavailable."*
