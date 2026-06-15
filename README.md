# 🚔 SafeCity PK 🇵🇰
### Crime Hotspot Analyzer & Risk Intelligence System

SafeCity PK is a full-stack crime intelligence platform that helps citizens report incidents, enables admins to verify reports, and allows security teams to analyze crime patterns through dashboards, filters, analytics, and a real DB-powered crime map.

---

## 🔗 Live Demo

| Service | URL |
|---------|-----|
| Service | Status |
|---------|--------|
| Frontend | Local only |
| Backend | Local only |
| Health Check | `GET /` → `SafeCity PK API running` |

---

## ✨ Key Features

### 👤 Citizen Side
- Submit public crime reports
- Track submitted reports *(My Reports)*
- View safety information
- Explore crime activity on an interactive map

### 🛡️ Security / Analyst Side
- View and filter crime records by city, severity, status, and date
- Analyze hotspot areas and dangerous crime hours
- Monitor DB-powered crime map

### 🛠️ Admin Side
- JWT-based login with role-based access control (RBAC)
- Verify or reject public reports
- Manage and deactivate users
- View admin statistics and audit logs

### 🌍 Crime Map *(Core Highlight)*
- Real-time DB-powered map using Leaflet
- Crimes plotted using actual coordinates
- Filter-based visualization with radar-style animated markers

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, CSS, React Leaflet |
| **Backend** | FastAPI (Python), Pydantic |
| **Database** | PostgreSQL |
| **Security** | JWT Authentication, RBAC |
| **Dev Tools** | Git & GitHub, Linux (Ubuntu) |

---

## 🔌 API Overview

### Public / Default
```http
GET  /
GET  /crimes
GET  /crimes/map
GET  /analytics/hotspots
GET  /analytics/dangerous-hours
POST /reports/public
```

### Public Reports
```http
GET   /reports/public
GET   /reports/public/pending
PATCH /reports/public/{report_id}/status
```

### Admin *(Protected)*
```http
GET   /admin/users
PATCH /admin/users/{user_id}/deactivate
GET   /admin/stats
GET   /admin/logs
```

### Auth
```http
POST /auth/login
```

> **Protected routes require:**
> ```
> Authorization: Bearer <token>
> ```

---

## 🗃️ Core Data Model

### Incident
| Field | Description |
|-------|-------------|
| `incident_id` | Primary key |
| `area_id` | Reference to area |
| `incident_type_id` | Crime category |
| `severity` | Severity level |
| `occurred_at` | Timestamp |
| `latitude` | GPS coordinate |
| `longitude` | GPS coordinate |

### Public Reports
| Field | Description |
|-------|-------------|
| `report_id` | Primary key |
| `reporter_name` | Submitter name |
| `reporter_contact` | Contact info |
| `city` | City of incident |
| `area` | Area / locality |
| `crime_type` | Type of crime |
| `severity` | Severity level |
| `description` | Detailed description |
| `incident_date` | Date of incident |
| `incident_time` | Time of incident |
| `status` | `pending` / `verified` / `rejected` |

### Users
| Field | Description |
|-------|-------------|
| `user_id` | Primary key |
| `name` | Full name |
| `email` | Email address |
| `role` | `admin` / `analyst` / `operator` |
| `is_active` | Account status |

### Audit Logs
| Field | Description |
|-------|-------------|
| `log_id` | Primary key |
| `actor_user_id` | Who performed the action |
| `action` | Action type |
| `notes` | Optional notes |
| `old_values` | Before state (JSON) |
| `new_values` | After state (JSON) |
| `created_at` | Timestamp |

---

## 🧩 Project Structure

```
SafeCity-PK/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── schemas.py
│   │   ├── db.py
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
└── README.md
```

---

## 🚀 System Flow

```
Citizen submits report
        ↓
Stored as PENDING in database
        ↓
Admin reviews report
        ↓
Admin verifies or rejects
        ↓
Verified reports become incidents
        ↓
Dashboards + Analytics + Map update from DB
```

---

## ⚠️ Key Challenges Faced

| Challenge | Description |
|-----------|-------------|
| PostgreSQL Auth | Peer authentication errors during initial setup |
| Wrong Table Usage | Confusion between `crimes` vs `incident` table |
| Constraint Violations | Severity enum mismatches and time format issues |
| Backend 500 Errors | SQL mistakes causing internal server errors |
| Frontend State Bugs | Data not rendering due to stale state |
| Infinite API Calls | React `useEffect` dependency array misconfiguration |
| Auth Issues | 401/403 errors due to incorrect token handling |
| Mock vs Real Data | Confusion between seeded mock data and live DB data |

---

## 🧠 What This Project Demonstrates

- Strong **PostgreSQL database design** with normalized schema
- **SQL analytics** — aggregation, filtering, time-based analysis
- **FastAPI backend architecture** — routes, services, dependency injection
- **Full-stack integration** — React frontend + REST API
- **JWT authentication** implementation end-to-end
- **Role-based access control (RBAC)** — admin, analyst, operator
- **Admin workflows** — report verification, user management
- **Audit logging system** — full action history with before/after values
- **Map-based crime visualization** — real coordinates via Leaflet
- **Real-world debugging** and system integration experience

---

## 📊 Project Status

> 🚀 **Production-Grade Prototype**

| Feature | Status |
|---------|--------|
| Fully DB-driven system | ✅ Complete |
| Real-time dashboards | ✅ Complete |
| Secure authentication | ✅ Complete |
| Admin workflows | ✅ Complete |
| Interactive crime map | ✅ Complete |
| End-to-end data flow | ✅ Working |

---

## 🔮 Future Improvements

- [ ] Deployment (Docker + Cloud)
- [ ] Real-time updates (WebSockets)
- [ ] Advanced ML-based crime prediction
- [ ] Stable map clustering
- [ ] Mobile responsiveness

---

## 👨‍💻 Authors

| Name | Contributions |
|------|--------------|
| **Abdullah Mangrio** | Backend Architecture, PostgreSQL Database Design, SQL Analytics, API Development (FastAPI), Authentication (JWT), RBAC, Audit Logging, Debugging, System Integration, Core System Design |
| **Musif** | Frontend UI Development, Component Design, Dashboard Layouts, Basic API Integration |

---

## 📜 License

*(Add your license here if required)*

---

## 🏁 Final Note

SafeCity PK started as a **DBMS course project** and evolved into a **full-stack crime intelligence system prototype** with real-world workflows, analytics, security, and map-based visualization.

---

## 🔐 Security & Privacy Note

This project is a portfolio-grade academic prototype. Demo credentials and seeded data are for local testing only. It should not be used with real citizen reports or sensitive public-safety data without proper legal, privacy, infrastructure, and security review.

---

## 🔐 Security & Privacy Note

This project is a portfolio-grade academic prototype. Demo credentials and seeded data are for local testing only. It should not be used with real citizen reports or sensitive public-safety data without proper legal, privacy, infrastructure, and security review.
