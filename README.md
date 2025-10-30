# E-Wallet REST API

A complete REST API for transactional services (digital wallet) built with Node.js, Express.js, and PostgreSQL.

## 🎯 Project Overview

This API provides a comprehensive e-wallet solution with user management, balance operations, and transaction processing. It supports various services like Pulsa top-ups and Voucher Game purchases.

## ✨ Features

- **User Authentication** - Registration, login with JWT tokens
- **Profile Management** - View and update user profiles
- **Wallet Operations** - Check balance, top-up funds
- **Transaction Processing** - Service payments with atomic operations
- **Transaction History** - Paginated transaction records
- **Reference Data** - Services catalog and promotional banners

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (30-minute expiry)
- **Validation**: Joi
- **Password Hashing**: bcryptjs
- **Database Driver**: node-postgres (pg)

## 📋 API Endpoints

### Authentication
- `POST /api/v1/registration` - User registration
- `POST /api/v1/login` - User login

### Profile Management
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile/update` - Update profile
- `PUT /api/v1/profile/image` - Update profile image

### Reference Data
- `GET /api/v1/banner` - Get promotional banners
- `GET /api/v1/services` - Get available services

### Wallet & Transactions
- `GET /api/v1/balance` - Get wallet balance
- `POST /api/v1/topup` - Top-up wallet balance
- `POST /api/v1/transaction` - Make service payment
- `GET /api/v1/transaction/history` - Get transaction history

### System
- `GET /api/v1/health` - Health check

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Backend-API-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ewallet_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_complex_and_long
   JWT_EXPIRES_IN=30m
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb ewallet_db
   
   # Run DDL script
   psql -d ewallet_db -f db.sql
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🧪 Testing

### Manual Testing with Postman

1. Import `postman-collection.json` into Postman
2. Set base_url to `http://localhost:3000/api/v1`
3. Run the collection in order

### Quick Server Test

```bash
node test-server.js
```

### Testing Flow

1. Register a new user
2. Login to get JWT token
3. Check initial balance (should be 0)
4. Top-up wallet balance
5. Make a service payment
6. Check transaction history

## 📊 Database Schema

### Tables

- **users** - User accounts and profiles
- **wallets** - User wallet balances
- **services** - Available services (Pulsa, Voucher Game, etc.)
- **transactions** - Transaction records (TOPUP/PAYMENT)
- **banners** - Promotional banners

### Key Features

- **ACID Transactions** - All balance operations are atomic
- **Balance Constraints** - Prevents negative balances
- **Sequential Invoice Numbers** - Format: `INVDDMMYYYY-001`
- **Referential Integrity** - Foreign key constraints

## 🔐 Security Features

- **JWT Authentication** - 30-minute token expiry
- **Password Hashing** - bcrypt with 12 salt rounds
- **SQL Injection Prevention** - Prepared statements
- **Input Validation** - Comprehensive Joi schemas
- **Error Handling** - Sanitized error responses

## 🌐 Deployment

### Railway.app Deployment

1. **Prepare repository**
   ```bash
   git add .
   git commit -m "feat: complete E-Wallet API"
   git push origin main
   ```

2. **Deploy to Railway**
   - Connect GitHub repository
   - Add PostgreSQL service
   - Configure environment variables
   - Deploy automatically

3. **Initialize production database**
   ```bash
   psql "your_railway_connection_string" -f db.sql
   ```

See `deployment-guide.md` for detailed instructions.

## 📁 Project Structure

```
Backend-API-test/
├── src/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── referenceController.js # Reference data
│   │   └── transactionController.js # Transaction logic
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Error handling
│   ├── repositories/
│   │   ├── userRepository.js     # User data access
│   │   ├── walletRepository.js   # Wallet operations
│   │   ├── transactionRepository.js # Transaction data
│   │   └── referenceRepository.js # Reference data
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── referenceRoutes.js    # Reference endpoints
│   │   └── transactionRoutes.js  # Transaction endpoints
│   └── validations/
│       ├── authValidation.js     # Auth input validation
│       └── transactionValidation.js # Transaction validation
├── db.sql                        # Database schema
├── index.js                      # Application entry point
├── package.json                  # Dependencies
├── railway.json                  # Railway configuration
└── README.md                     # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `ewallet_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | `30m` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## 📖 API Documentation

### Response Format

All responses follow this format:

```json
{
  "status": 0,
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Format

```json
{
  "status": 400,
  "message": "Error message"
}
```

### Authentication

Protected endpoints require JWT token in header:

```
Authorization: Bearer <your_jwt_token>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section in `deployment-guide.md`
2. Review the testing guide in `testing-guide.md`
3. Check application logs for errors

## 🎉 Acknowledgments

Built following the specifications from [api-doc-tht.nutech-integrasi.com](https://api-doc-tht.nutech-integrasi.com)

---

**Ready for production deployment! 🚀**
