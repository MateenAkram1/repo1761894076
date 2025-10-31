# Heart Clinic Management & Patient Portal

A comprehensive web application for managing a heart doctor clinic, featuring patient portals, appointment scheduling, medical records management, telehealth consultations, and educational resources.

## Features

### Public-Facing Features
- **Home Page**: Modern landing page with clinic information
- **About Us**: Clinic mission, vision, and values
- **Our Doctors**: Browse doctor profiles by specialty
- **Education Portal**: Heart health articles and resources

### Patient Portal
- **Dashboard**: View upcoming appointments and medical history
- **Appointment Booking**: Schedule in-person or telehealth consultations
- **Medical Records**: Secure access to personal health records
- **Profile Management**: Update personal and emergency contact information

### Doctor Portal
- **Dashboard**: Today's schedule and patient overview
- **Appointment Management**: View and manage patient appointments
- **Medical Records**: Access and update patient records
- **Content Creation**: Publish educational articles

### Admin Portal
- **System Dashboard**: Overview of clinic statistics
- **Appointment Management**: Full control over all appointments
- **User Management**: Manage patients, doctors, and staff accounts
- **Content Management**: Oversee all educational content
- **Reports & Analytics**: System-wide reporting

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth.js with SAML Jackson for SSO
- **Payments**: Stripe integration
- **Email**: Resend for transactional emails
- **Webhooks**: Svix for event notifications
- **Audit Logs**: Retraced for compliance
- **Testing**: Playwright for E2E tests

## Database Schema

### Core Medical Models
- **PatientProfile**: Patient demographics, medical history, allergies, medications
- **DoctorProfile**: Specialty, qualifications, availability, consultation fees
- **Appointment**: Scheduling (in-person/telehealth), status tracking
- **MedicalRecord**: Visit notes, diagnoses, prescriptions, lab results
- **EducationalContent**: Articles, videos, categorized health information
- **Payment**: Transaction tracking for appointments and subscriptions

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Stripe account for payments
- (Optional) Email service (SMTP or Resend)

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:4002
   - Default port can be changed in package.json

### Building for Production

```bash
npm run build
npm start
```

## User Roles & Permissions

### Patient
- Book, view, and cancel own appointments
- Access personal medical records
- Update personal profile
- View educational content

### Doctor
- Manage personal schedule
- View and update patient records for assigned patients
- Conduct telehealth consultations
- Create and publish educational content
- Update own profile

### Admin
- Full access to all appointments and records
- Manage all user accounts
- Oversee educational content
- Access audit logs and analytics
- Configure system settings

## Key API Routes

### Appointments
- `GET/POST /api/appointments` - List/create appointments
- `GET/PUT/DELETE /api/appointments/[id]` - Manage specific appointment

### Medical Records
- `GET/POST /api/medical-records` - List/create records
- `GET/PUT/DELETE /api/medical-records/[id]` - Manage specific record

### Educational Content
- `GET/POST /api/educational-content` - List/create content
- `GET/PUT/DELETE /api/educational-content/[slug]` - Manage specific article

### Profiles
- `GET/POST/PUT /api/profile/patient` - Patient profile management
- `GET/POST/PUT /api/profile/doctor` - Doctor profile management

### Doctors
- `GET /api/doctors` - List all accepting doctors
- `GET /api/doctors?specialty=Cardiology` - Filter by specialty

## Development Workflow

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run check-types

# Linting
npm run check-lint
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

## Security Features

- **Authentication**: Secure password hashing with bcrypt
- **Authorization**: Role-based access control (RBAC)
- **Session Management**: Secure session handling via NextAuth
- **HIPAA Compliance**: Audit logs via Retraced
- **Data Encryption**: Sensitive data encrypted at rest
- **API Security**: CSRF protection, rate limiting

## Deployment

### Environment Variables (Production)
Ensure all required environment variables are set:
- DATABASE_URL
- NEXTAUTH_URL and NEXTAUTH_SECRET
- SMTP configuration for emails
- STRIPE keys (if using payments)
- SUPABASE keys (if using Supabase features)

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker Deployment
```bash
# Build image
docker build -t heartclinic .

# Run container
docker run -p 4002:4002 heartclinic
```

## Future Enhancements

- [ ] Real-time telehealth video integration
- [ ] Mobile app (React Native)
- [ ] Prescription e-prescribing integration
- [ ] Lab results integration (HL7/FHIR)
- [ ] Automated appointment reminders (SMS/Email)
- [ ] Patient health tracking dashboards
- [ ] AI-powered symptom checker
- [ ] Multi-language support (i18n)
- [ ] Integration with insurance providers
- [ ] Waitlist management for appointments

## Support & Documentation

For detailed API documentation, see the `/docs` directory.

For issues and feature requests, please create an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Built with [BoxyHQ SaaS Starter Kit](https://github.com/boxyhq/saas-starter-kit) as the foundation.
