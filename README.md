# Infoziant - Online Course Marketplace

A full-stack application for selling online courses with user authentication, MongoDB backend, and Razorpay integration.

## Project Structure

This project follows a client-server architecture:
- `/client` - React frontend
- `/server` - Express backend

## Features

- User registration and authentication with JWT
- Course browsing and filtering
- Course enrollment with Razorpay payment integration
- User dashboard and profile management
- Responsive design for all devices

## Tech Stack

### Frontend
- React 
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Razorpay API for payments

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Infoziant
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongouri
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=rzp_test_mock
RAZORPAY_KEY_SECRET=mock_secret
MOCK_PAYMENT=true
```

### 3. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
npm run client:install

# Seed the database with sample courses
npm run seed
```

### 4. Run the Application

#### Development Mode

```bash
# Run frontend and backend concurrently
npm run dev

# Or run them separately
npm run server    # Backend only
npm run client    # Frontend only
```

#### Production Mode

```bash
# Build the frontend
cd client && npm run build

# Start the server
npm start
```

## API Endpoints

### Authentication
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user

### User
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- PUT /api/users/change-password - Change password

### Courses
- GET /api/courses - Get all courses
- GET /api/courses/:id - Get a single course
- GET /api/courses/enrolled - Get user enrolled courses

### Payments
- POST /api/payments/create-order - Create payment order
- POST /api/payments/verify - Verify payment
- GET /api/payments/history - Get payment history

## License

[MIT License](LICENSE)
