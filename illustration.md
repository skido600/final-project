                    ┌──────────────────────┐
                    │      USERS           │
                    │----------------------│
                    │ - Patient           │
                    │ - Doctor            │
                    │ - Admin    │
                    └─────────┬────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │           AUTH SYSTEM               │
        │-------------------------------------│
        │ - Register                        │
        │ - Login                           │
        │ - Role-based access               │
        │   (patient / doctor / admin)      │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │           FRONTEND (React)         │
        │-------------------------------------│
        │ Pages:                            │
        │ - Login / Register               │
        │ - Patient Dashboard             │
        │ - Doctor Dashboard              │
        │ - Admin Dashboard (simple)       │
        │ - Symptom Checker Page          │
        │ - Appointment Page              │
        │ - Medical Records Page          │
        └─────────────┬───────────────────────┘
                      │ API Requests
                      ▼
        ┌─────────────────────────────────────┐
        │          BACKEND (Node.js)         │
        │-------------------------------------│
        │ Handles:                          │
        │ - Authentication (JWT)           │
        │ - Users management               │
        │ - Appointments logic            │
        │ - Medical records logic         │
        │ - AI symptom checker            │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │         DATABASE (PostgreSQL)      │
        │-------------------------------------│
        │ Tables:                          │
        │ - Users                        │
        │ - Patients                     │
        │ - Doctors                      │
        │ - Appointments                 │
        │ - MedicalRecords              │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │        AI MODULE (RULE BASED)      │
        │-------------------------------------│
        │ Input: Symptoms                  │
        │ Output: Possible diseases        │
        │ Example:                         │
        │ - fever + headache → malaria     │
        │ - cough + fever → infection      │
        └─────────────────────────────────────┘
