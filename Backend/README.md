# Hostel Management Committee Backend API

A comprehensive backend API for managing hostel operations including student management, complaint tracking, payment processing, and administrative dashboard.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Student Management**: Complete student profile management with academic and hostel information
- **Complaint System**: File and track complaints with status updates and resolution tracking
- **Payment Management**: Fee management with payment tracking and receipt generation
- **Dashboard Analytics**: Comprehensive analytics and reporting for administrators
- **Role-based Access**: Different permissions for admin, warden, and student roles

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hmc
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Start the production server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /logout` - Logout user

### Students (`/api/students`)

- `GET /` - Get all students (admin/warden only)
- `GET /:id` - Get student by ID
- `POST /` - Create new student (admin/warden only)
- `PUT /:id` - Update student information (admin/warden only)
- `PUT /profile/:id` - Update student's own profile
- `DELETE /:id` - Delete student (admin only)
- `GET /profile/me` - Get student's own profile
- `GET /search/query` - Search students (admin/warden only)

### Complaints (`/api/complaints`)

- `GET /` - Get all complaints (filtered by role)
- `GET /:id` - Get complaint by ID
- `POST /` - Create new complaint (students only)
- `PUT /:id/status` - Update complaint status (admin/warden only)
- `POST /:id/followup` - Add follow-up to complaint (admin/warden only)
- `POST /:id/resolve` - Resolve complaint (admin/warden only)
- `DELETE /:id` - Delete complaint (admin only)
- `GET /stats/dashboard` - Get complaint statistics (admin/warden only)
- `GET /search/query` - Search complaints

### Payments (`/api/payments`)

- `GET /` - Get all payments (filtered by role)
- `GET /:id` - Get payment by ID
- `POST /` - Create new payment (admin/warden only)
- `PUT /:id` - Update payment (admin/warden only)
- `POST /:id/pay` - Mark payment as paid (admin/warden only)
- `GET /overdue/list` - Get overdue payments (admin/warden only)
- `GET /stats/dashboard` - Get payment statistics (admin/warden only)
- `POST /:id/receipt` - Generate fee receipt (admin/warden only)
- `DELETE /:id` - Delete payment (admin only)

### Dashboard (`/api/dashboard`)

- `GET /overview` - Get dashboard overview (admin/warden only)
- `GET /student` - Get student dashboard (students only)
- `GET /monthly-stats` - Get monthly statistics (admin/warden only)
- `GET /room-occupancy` - Get room occupancy statistics (admin/warden only)
- `GET /performance` - Get performance metrics (admin/warden only)

## User Roles

### Admin
- Full access to all features
- Can manage students, complaints, and payments
- Can view comprehensive analytics and reports

### Warden
- Can manage students, complaints, and payments
- Can view analytics and reports
- Cannot delete records or manage other staff

### Student
- Can view and update their own profile
- Can create and track their own complaints
- Can view their payment history and fees
- Can access their personal dashboard

## Database Schema

### User Model
- Authentication credentials
- Role assignment
- Basic profile information

### Student Model
- Personal information
- Academic details
- Hostel accommodation
- Fee tracking
- Document management

### Complaint Model
- Complaint details and categorization
- Status tracking
- Resolution management
- Follow-up communications

### Payment Model
- Payment details and categorization
- Status tracking
- Receipt generation
- Fee calculations

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration

## Development

The project uses nodemon for development:
```bash
npm run dev
```

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure MongoDB with proper security
4. Set up proper logging and monitoring

## API Documentation

Visit `http://localhost:5000/api` for API endpoint information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
