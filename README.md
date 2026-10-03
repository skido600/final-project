# MediCare AI Health System

MediCare AI Health System helps medical facilities and patients connect through a unified platform. It takes patient symptoms, provides initial AI-driven health suggestions, and allows users to book appointments with doctors directly. Doctors can easily manage their schedules and patient records, while administrators oversee the entire staff registry. There is no complicated onboarding, just a straightforward medical portal that bridges the gap between healthcare providers and patients.

## System Architecture

```mermaid
flowchart LR
  WebClient["Web Client (React)"]
  APIServer["API Server (Node.js)"]
  Database[("PostgreSQL")]
  GroqAI("Groq AI")
  Resend("Resend Email")

  WebClient -- "HTTP Requests" --> APIServer
  APIServer -- "SQL Queries" --> Database
  APIServer -- "Generate Symptoms" --> GroqAI
  APIServer -- "Send OTP" --> Resend

  style WebClient fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
  style APIServer fill:#2e1065,stroke:#8b5cf6,stroke-width:2px,color:#fff
  style Database fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff
  style GroqAI fill:#022c22,stroke:#10b981,stroke-width:2px,color:#fff
  style Resend fill:#451a03,stroke:#f59e0b,stroke-width:2px,color:#fff
```

## Features

*   **Role-Based Access Control**: Secure dashboards tailored specifically for Patients, Doctors, and Administrators.
*   **AI Symptom Checker**: Users input their symptoms and receive instantaneous, AI-generated insights on possible conditions and recommendations.
*   **Appointment Management**: Patients can book sessions with available doctors, while doctors can accept, reject, or cancel appointments based on their schedule.
*   **Secure Authentication**: Features secure user registration, login, password hashing, and email-based OTP verification flows.
*   **Medical History Tracking**: Patients can view their past appointments, AI symptom check history, and doctor feedback in one place.

### Authentication and Verification Flow

```mermaid
sequenceDiagram
  actor NewUser
  participant Backend
  participant DB as Database
  participant EmailService

  NewUser->>Backend: POST /api/auth/signup
  Backend->>Backend: Hash password
  Backend->>DB: Save user record
  Backend->>Backend: Generate OTP
  Backend->>DB: Save OTP hash
  Backend->>EmailService: Send verification email
  EmailService->>NewUser: Deliver OTP
```

### Appointment Booking Workflow

```mermaid
sequenceDiagram
  actor Patient
  participant Backend
  participant DB as Database
  actor Doctor

  Patient->>Backend: POST /api/doctor/book-appointments
  Backend->>DB: Create pending appointment
  DB->>Backend: Return appointment record
  Backend->>Patient: Confirm booking
  Doctor->>Backend: GET /api/doctor/doctor-appointments
  Backend->>DB: Fetch pending requests
  DB->>Backend: Return list
  Backend->>Doctor: Display pending requests
  Doctor->>Backend: PATCH /api/doctor/appointments/:id/accept
  Backend->>DB: Update status to accepted
```

## Installation

Follow these steps to set up the project locally.

Clone the Repository:

```bash
git clone https://github.com/skido600/final-project.git
cd final-project
```

Set up the Frontend:

```bash
cd frontend
npm install
npm run dev
```

Set up the Backend:

```bash
cd ../server
bun install
```

Create a `.env` file in the `server` directory and add the following required environment variables:

```bash
DATABASE_URL=postgres://user:password@host:port/dbname
JWT_SECRET=your_super_secret_jwt_key
HMAC_VERIFICATION_CODE_SECRET=your_hmac_secret
RESEND_API_KEY=your_resend_api_key
GROQ_API_KEY=your_groq_api_key
PORT=4000
```

Run database migrations:

```bash
bunx drizzle-kit push
```

Start the Backend Server:

```bash
bun run dev
```

## Usage

Once the servers are running, access the web client in your browser at `http://localhost:5173`. 

To test the patient flow, click "Get Started" on the landing page to register a new account. The system will send a One-Time Password to the provided email address to verify the account. 

To use the symptom checker, log in as a patient, navigate to the Symptom Checker tab, and describe your current condition. The AI will analyze the input and return possible conditions alongside a standard medical disclaimer.

To manage doctors as an admin, log in with an administrator account to view the admin dashboard, where you can register new medical staff directly into the system.

## Technologies Used

*   **Frontend**: React, Vite, Tailwind CSS, React Query, React Router, React Hook Form
*   **Backend**: Node.js, Express, TypeScript, Bun
*   **Database & ORM**: PostgreSQL (Neon Serverless), Drizzle ORM
*   **External Services**: Groq AI (Symptom analysis), Resend (Transactional emails)

## API Documentation

The backend provides a RESTful API. All protected routes require a Bearer token in the Authorization header.

### Auth Endpoints

#### POST /api/auth/signup
**Description**: Registers a new patient account and triggers an OTP verification email.

**Request**:
```json
{
  "firstName": "John",
  "surname": "Doe",
  "age": "30",
  "sex": "Male",
  "phone": "1234567890",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 201,
  "message": "Account created. OTP sent."
}
```

**Errors**:
*   400: Validation failed
*   409: User already exists

#### POST /api/auth/login
**Description**: Authenticates a user and returns a JWT token.

**Request**:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1..."
  }
}
```

**Errors**:
*   400: Invalid credentials
*   403: Account not verified check your email and input the otp to verify
*   404: User not found

#### POST /api/auth/verifyemail
**Description**: Verifies a user account using an OTP code sent via email.

**Request**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "Email verified successfully"
}
```

**Errors**:
*   400: Invalid or expired OTP
*   404: User or OTP not found

#### POST /api/auth/forgetpassword
**Description**: Initiates a password reset flow by sending an OTP to the registered email.

**Request**:
```json
{
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "OTP sent to email"
}
```

**Errors**:
*   404: User not found

#### POST /api/auth/verifycode
**Description**: Verifies the password reset OTP and returns a temporary reset token.

**Request**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "OTP verified",
  "data": {
    "resetToken": "eyJhbGciOiJIUzI1..."
  }
}
```

**Errors**:
*   400: Invalid or expired OTP
*   404: User or OTP not found

#### PUT /api/auth/resetpassword
**Description**: Resets the user password using a valid reset token.

**Request**:
```json
{
  "resetToken": "eyJhbGciOiJIUzI1...",
  "newPassword": "newsecurepassword",
  "confirmPassword": "newsecurepassword"
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "Password reset successful"
}
```

**Errors**:
*   400: Passwords do not match or token is invalid

### Doctor & Appointment Endpoints

#### POST /api/doctor/createdoctor
**Description**: Creates a new doctor profile in the system. Requires Admin authentication.

**Request**:
```json
{
  "firstName": "Jane",
  "surname": "Smith",
  "sex": "Female",
  "email": "jane.smith@hospital.com"
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 201,
  "message": "Doctor created successfully"
}
```

**Errors**:
*   409: Email already exists

#### GET /api/doctor/doctors
**Description**: Fetches a list of all registered doctors. Requires Patient authentication.

**Response**:
```json
{
  "success": true,
  "doctors": [
    {
      "id": "uuid-string",
      "firstName": "Jane",
      "surname": "Smith"
    }
  ]
}
```

#### POST /api/doctor/book-appointments
**Description**: Books an appointment with a specific doctor. Requires Patient authentication.

**Request**:
```json
{
  "doctorId": "uuid-string",
  "date": "2024-12-01",
  "time": "14:30",
  "symptoms": "Severe headache and mild fever"
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 201,
  "message": "Appointment booked",
  "data": {
    "id": "uuid-string",
    "status": "pending"
  }
}
```

#### GET /api/doctor/doctor-appointments
**Description**: Fetches all pending and accepted appointments for the authenticated doctor. Supports searching by patient name. Requires Doctor authentication.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "date": "2024-12-01",
      "time": "14:30",
      "status": "pending",
      "patientFirstName": "John"
    }
  ]
}
```

#### PATCH /api/doctor/appointments/:appointmentId/accept
**Description**: Accepts a pending appointment request. Requires Doctor authentication.

**Response**:
```json
{
  "success": true,
  "message": "Appointment accepted"
}
```

#### PATCH /api/doctor/appointments/:appointmentId/reject
**Description**: Rejects a pending appointment request. Requires Doctor authentication.

**Response**:
```json
{
  "success": true,
  "message": "Appointment rejected"
}
```

#### PATCH /api/doctor/appointments/:appointmentId/cancel
**Description**: Cancels a previously accepted appointment. Requires Doctor authentication.

**Response**:
```json
{
  "success": true,
  "message": "Appointment cancelled by doctor"
}
```

#### GET /api/doctor/patient-stat
**Description**: Retrieves statistics for a patient dashboard, including total appointments and AI checks. Requires Patient authentication.

**Response**:
```json
{
  "success": true,
  "data": {
    "patientName": "John Doe",
    "totalAppointments": 5,
    "pendingAppointments": 1,
    "totalAiChecks": 3
  }
}
```

#### GET /api/doctor/patient-history
**Description**: Retrieves a full history of appointments for the authenticated patient. Requires Patient authentication.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "date": "2024-12-01",
      "status": "accepted",
      "doctorFirstName": "Jane",
      "doctorSurname": "Smith"
    }
  ]
}
```

#### GET /api/doctor/profile
**Description**: Retrieves the profile details of the authenticated user.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "firstName": "Jane",
    "surname": "Smith",
    "role": "doctor"
  }
}
```

### AI Symptom Checker Endpoints

#### POST /api/ai/symptom
**Description**: Analyzes submitted symptoms and generates possible condition suggestions. Requires Patient authentication.

**Request**:
```json
{
  "symptoms": "I have a sore throat, runny nose, and body aches."
}
```

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "Suggestion generated",
  "data": {
    "symptoms": "sore throat, runny nose, and body aches",
    "possibleConditions": ["Common Cold", "Influenza"],
    "recommendation": "Rest, stay hydrated, and consult a doctor if symptoms persist."
  }
}
```

**Errors**:
*   400: Invalid AI response

#### GET /api/ai/history
**Description**: Retrieves the history of previous AI symptom checks for the authenticated patient. Requires Patient authentication.

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "AI history fetched successfully",
  "data": [
    {
      "id": "uuid-string",
      "symptoms": "Headache",
      "possibleConditions": ["Migraine"],
      "recommendation": "Take pain relievers"
    }
  ]
}
```

#### DELETE /api/ai/history/:id
**Description**: Deletes a specific AI suggestion record from the history. Requires Patient authentication.

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "History deleted successfully"
}
```

#### DELETE /api/ai/history
**Description**: Clears the entire AI symptom check history for the authenticated patient. Requires Patient authentication.

**Response**:
```json
{
  "success": true,
  "statuscode": 200,
  "message": "All AI history cleared successfully"
}
```

## Contributing

Contributions are always welcome. To contribute, fork the repository, create a new branch for your feature or bug fix, and open a pull request against the main branch. Ensure all code conforms to the existing formatting and logic structures in the repository.

## Author

*   GitHub: [skido600](https://github.com/skido600)

***

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://dokugen.samueltuoyo.com)