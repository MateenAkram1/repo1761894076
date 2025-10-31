# Heart Doctor Clinic Management System

## Overview

A comprehensive web application for heart doctor clinic management, built on Next.js with TypeScript. This system provides a multi-faceted platform encompassing patient portal, educational resources, clinic marketing site, and internal management system.

## Features Implemented

### 1. Public Marketing Website
- **About Us Page** (`/about`) - Clinic mission, values, and history
- **Services Page** (`/services`) - Comprehensive listing of 8 cardiac services
- **Doctors Page** (`/doctors`) - Filterable doctor profiles with specialties
- **Contact Page** (`/contact`) - Contact form and clinic information
- **Education Portal** (`/education`) - Searchable health education articles

### 2. Patient Portal
- **Patient Dashboard** (`/patient/dashboard`) - Overview of appointments and health tips
- **Profile Management** - Manage personal and medical information
- **Appointment Booking** - Schedule in-person and telehealth consultations
- **Medical Records Access** - Secure access to personal health records
- **Educational Resources** - Access to heart health articles and videos

### 3. Doctor Interface
- **Appointment Management** - View and manage daily schedules
- **Patient Records** - Access and update patient medical records
- **Content Creation** - Publish educational articles
- **Profile Management** - Update professional information and availability

### 4. Admin Dashboard
- **Full System Control** - Manage all users, appointments, and records
- **Doctor Management** - Create and manage doctor profiles
- **Content Moderation** - Approve and manage educational content
- **System Analytics** - View audit logs and system activity

## Technology Stack

- **Framework**: Next.js 15.3 with TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Database**: PostgreSQL via Prisma ORM (Supabase compatible)
- **Authentication**: NextAuth.js + SAML Jackson
- **Email**: Resend integration for notifications
- **Payments**: Stripe integration
- **Webhooks**: Svix orchestration
- **Audit Logs**: Retraced
- **Testing**: Playwright for E2E tests

## Database Models

### Core Models
- **User** - Base user model with UserRole (PATIENT, DOCTOR, ADMIN)
- **PatientProfile** - Medical history, allergies, medications, emergency contacts
- **DoctorProfile** - Specialty, qualifications, availability, ratings
- **Appointment** - Booking details with support for in-person and telehealth
- **MedicalRecord** - Visit notes, diagnoses, prescriptions, lab results
- **EducationalContent** - Articles with categories, tags, and view tracking
- **Payment** - Transaction records linked to appointments
- **ClinicSettings** - Global clinic configuration

### Enums
- **UserRole**: PATIENT, DOCTOR, ADMIN
- **AppointmentType**: IN_PERSON, TELEHEALTH
- **AppointmentStatus**: BOOKED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
- **PaymentStatus**: PENDING, COMPLETED, FAILED, REFUNDED
- **ContentStatus**: DRAFT, PUBLISHED, ARCHIVED

## API Routes

### Appointments
- `GET /api/appointments` - List appointments (filtered by user role)
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/[id]` - Get appointment details
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Cancel appointment

### Medical Records
- `GET /api/medical-records` - List medical records
- `POST /api/medical-records` - Create medical record (doctors/admins only)
- `GET /api/medical-records/[id]` - Get record details
- `PUT /api/medical-records/[id]` - Update record
- `DELETE /api/medical-records/[id]` - Delete record (admins only)

### Educational Content
- `GET /api/educational-content` - List articles (with filters)
- `POST /api/educational-content` - Create article (doctors/admins only)
- `GET /api/educational-content/[id]` - Get article with view tracking
- `PUT /api/educational-content/[id]` - Update article
- `DELETE /api/educational-content/[id]` - Delete article (admins only)

### Doctor Profiles
- `GET /api/doctors` - List all doctors (with filters)
- `POST /api/doctors` - Create doctor profile (admins only)
- `GET /api/doctors/[id]` - Get doctor profile
- `PUT /api/doctors/[id]` - Update doctor profile

### Patient Profiles
- `GET /api/patients/[id]` - Get patient profile
- `PUT /api/patients/[id]` - Update patient profile

## Role-Based Access Control

### Patient Role
- View own appointments and medical records
- Book, reschedule, and cancel own appointments
- Access educational content
- Manage own profile
- Participate in telehealth consultations

### Doctor Role
- Manage own appointment schedule
- Access and update patient records for assigned patients
- Create and publish educational content
- Conduct telehealth consultations
- Update own professional profile

### Admin Role
- Full access to all system features
- Manage all users, appointments, and records
- Create and manage doctor profiles
- Moderate educational content
- Access audit logs and system analytics

## Email Notifications

Automated emails are sent for:
- Appointment confirmations (to patient and doctor)
- Appointment reminders (24 hours before)
- Appointment cancellations
- Account verification
- Password resets

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/clinic_db
DATABASE_PROVIDER=postgres

# NextAuth
NEXTAUTH_URL=http://localhost:4002
NEXTAUTH_SECRET=your-secret-key

# Email Provider (choose one)
EMAIL_PROVIDER=resend
RESEND_API_KEY=your-resend-api-key

# Optional: Stripe for payments
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Optional: Svix for webhooks
SVIX_URL=https://api.eu.svix.com
SVIX_API_KEY=your-svix-key

# Optional: Retraced for audit logs
RETRACED_URL=your-retraced-url
RETRACED_API_KEY=your-api-key
RETRACED_PROJECT_ID=your-project-id

# Auth Providers (comma separated)
AUTH_PROVIDERS=credentials,email
```

### 3. Set Up Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed with sample data
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:4002`

### 5. Build for Production
```bash
npm run build
npm start
```

## Key Pages

### Public Pages (No Authentication Required)
- `/` - Home page
- `/about` - About the clinic
- `/services` - Services offered
- `/doctors` - Meet our doctors
- `/education` - Health education
- `/contact` - Contact us
- `/auth/join` - Patient registration
- `/auth/login` - User login

### Patient Pages (Authentication Required)
- `/patient/dashboard` - Patient dashboard
- `/patient/appointments` - Manage appointments
- `/patient/records` - View medical records

### Doctor Pages (Authentication Required)
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/schedule` - Manage schedule
- `/doctor/patients` - Patient list

### Admin Pages (Authentication Required)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/appointments` - All appointments
- `/admin/content` - Content management

## Security Features

- **Authentication**: Secure session management with NextAuth.js
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: HIPAA-compliant data handling
- **Password Security**: Bcrypt hashing
- **Account Locking**: Protection against brute force attacks
- **Audit Logging**: Complete activity tracking via Retraced
- **HTTPS**: Secure connections in production
- **CSRF Protection**: Built-in Next.js protection
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## Testing

### Run Unit Tests
```bash
npm test
```

### Run E2E Tests
```bash
# Install Playwright browsers
npm run playwright:update

# Run E2E tests
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Deployment

### Using Docker
```bash
# Build image
docker build -t clinic-app .

# Run container
docker run -p 4002:4002 clinic-app
```

### Using Vercel/Netlify
1. Connect your repository
2. Configure environment variables
3. Deploy with one click

## Future Enhancements

### Phase 2 (Potential)
- [ ] Video consultation integration (Twilio/Zoom)
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Patient messaging system
- [ ] Prescription management
- [ ] Lab results integration
- [ ] Insurance verification
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Telemedicine platform integration

## Support

For issues, questions, or contributions, please contact the development team.

## License

Proprietary - All rights reserved
