# SecureBank Backend API

A secure, production-ready NestJS backend for a banking application with JWT authentication, OTP verification, and comprehensive transaction management.

## Features

- **Authentication**: JWT-based authentication with OTP email verification
- **User Management**: Profile updates, email/phone management
- **Beneficiary Management**: Add and manage transfer recipients with IBAN validation
- **Secure Transfers**: Execute transfers with transaction recording and balance management
- **Transaction History**: View and filter transaction records
- **Security**: Password hashing, rate limiting, input validation, CORS, Helmet

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure environment variables:
   \`\`\`bash
   cp .env.example .env

# Edit .env with your database credentials

\`\`\`

4. Create MySQL database:
   \`\`\`bash
   mysql -u root -p
   CREATE DATABASE banking_app;
   EXIT;
   \`\`\`

## Running the Application

### Development mode:

\`\`\`bash
npm run start:dev
\`\`\`

### Production mode:

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

### Database migrations:

\`\`\`bash
npm run migration:run
\`\`\`

### Seed database with demo data:

\`\`\`bash
npm run db:seed
\`\`\`

## API Endpoints

### Authentication

- `POST /auth/login` - Login with email and password
- `POST /auth/verify-otp` - Verify OTP and get JWT tokens
- `POST /auth/refresh-token` - Refresh access token

### User

- `GET /user` - Get user profile (requires auth)
- `PATCH /user/update-email` - Update email (requires auth)
- `PATCH /user/update-phone` - Update phone (requires auth)

### Beneficiaries

- `GET /beneficiaries` - List user beneficiaries (requires auth)
- `POST /beneficiaries` - Add new beneficiary (requires auth)

### Transfers

- `POST /transfer` - Execute transfer (requires auth)

### Transactions

- `GET /transactions` - Get transaction history (requires auth)
  - Query params: `type` (all/sent/received), `date` (YYYY-MM-DD)

## Demo Credentials

Email: `john.doe@example.com`
Password: `Password123!`

## Database Schema

### Tables

- **users**: User accounts
- **accounts**: Bank accounts with balance
- **beneficiaries**: Transfer recipients
- **transactions**: Transfer history
- **otps**: OTP verification records

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- OTP verification for login
- Rate limiting on endpoints
- Input validation with class-validator
- CORS configuration
- Helmet.js for secure headers
- SQL injection prevention via TypeORM

## Error Handling

All errors return appropriate HTTP status codes with descriptive messages:

- `400`: Bad Request (validation errors)
- `401`: Unauthorized (auth failures)
- `404`: Not Found
- `500`: Internal Server Error

## Development

### Linting:

\`\`\`bash
npm run lint
\`\`\`

### Testing:

\`\`\`bash
npm run test
npm run test:watch
\`\`\`

## Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `FRONTEND_URL` to your production frontend URL
3. Use strong JWT_SECRET
4. Configure email service for OTP sending
5. Use production database credentials
6. Deploy to your hosting provider (Vercel, AWS, DigitalOcean, etc.)

## License

Proprietary - Banking App
