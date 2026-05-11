# TuVi Backend API Setup Guide

## Overview
This is the backend API server for the Vietnamese Astrology (Tử Vi) platform, built with Node.js, Express, and MongoDB.

## Prerequisites
- **Node.js** 16+ (https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas cloud: https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js)

## Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your values
# Open .env with your text editor and configure:
# - MONGODB_URI (your database connection string)
# - JWT_SECRET (a strong random key)
# - CORS_ORIGINS (your frontend URLs)
```

### 3. Generate JWT Secret (Recommended)
Create a strong JWT secret for production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it in `.env` as `JWT_SECRET`.

## Configuration

### MongoDB Connection
- **Local MongoDB**: `mongodb://localhost:27017/tuvi_db`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/tuvi_db`

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGODB_URI` | Database connection | `mongodb://...` |
| `JWT_SECRET` | Token signing key | 32+ character random string |
| `CORS_ORIGINS` | Allowed frontend URLs | `http://localhost:3000,http://localhost:3001` |

## Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server will start at `http://localhost:5000`

## API Health Check
```bash
curl http://localhost:5000/api/health
```

## Database Seeding (Optional)

### Seed Admin User
```bash
node seedAdmin.js
```
This creates an admin account for accessing the admin panel.

### Seed Sample Data
```bash
node seedDatabase.js
```
This loads sample Tử Vi interpretation data.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create new account
- `POST /login` - Login with email/password
- `POST /refresh-token` - Get new access token
- `GET /me` - Get current user info (protected)
- `PUT /update-profile` - Update user profile (protected)
- `PUT /change-password` - Change password (protected)

### Tử Vi Calculations (`/api/tuvi`)
- `POST /calculate` - Calculate Tử Vi reading
- `GET /history` - Get user's calculation history (protected)
- `GET /:id` - Get specific calculation result
- `DELETE /:id` - Delete calculation (protected)
- `GET /stats` - Admin statistics (admin only)

### Articles (`/api/articles`)
- `GET /` - List all articles
- `GET /:slug` - Get article by slug
- `POST /` - Create article (admin only)
- `PUT /:id` - Update article (admin only)
- `DELETE /:id` - Delete article (admin only)

### Contact (`/api/contact`)
- `POST /` - Submit contact form
- `GET /` - List contacts (admin only)
- `PUT /:id` - Update contact status (admin only)

### Masters (`/api/masters`)
- `GET /` - List astrology masters
- `GET /:id` - Get master details

### Admin (`/api/admin`)
- Various admin operations for managing the platform

## Security Features Implemented

✅ **Rate Limiting**
- General: 100 req/15min per IP
- Auth: 5 req/15min per IP (login protection)
- TuVi: 20 calculations/hour per user

✅ **Input Validation**
- All inputs validated with express-validator
- Password strength requirements: 8+ chars, uppercase, lowercase, number, special char
- Email validation and normalization

✅ **Authentication**
- JWT access tokens (short-lived: 1 hour)
- Refresh tokens (long-lived: 7 days)
- Bcryptjs password hashing (12 salt rounds)

✅ **CORS Protection**
- Configurable origins from environment
- Credentials support

✅ **Security Headers**
- Helmet.js for HTTP security headers
- CSP (Content Security Policy) configured
- XSS protection

✅ **Database**
- Proper indexes on frequently queried fields
- Mongoose schema validation
- Connection pooling

## Error Handling

All errors return JSON with structure:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ { "field": "fieldName", "message": "validation error" } ]
}
```

## Logging

- **Development**: Morgan HTTP request logging
- **Production**: File-based logging (implement Winston for persistence)

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in .env
- Ensure credentials are correct

### Port Already in Use
```bash
# Change PORT in .env to an available port (e.g., 5001)
PORT=5001
```

### CORS Errors
- Verify frontend URLs in CORS_ORIGINS match exactly
- Include http:// or https:// protocol
- No trailing slashes

### JWT Token Errors
- Ensure JWT_SECRET is set in .env
- Check token format: `Authorization: Bearer <token>`
- Tokens expire after 1 hour (use refresh-token endpoint to get new one)

## Production Deployment

### Before Deploying
1. Change `NODE_ENV` to `production`
2. Use a strong, unique `JWT_SECRET` (32+ characters)
3. Setup separate MongoDB instance
4. Configure CORS_ORIGINS with production URLs
5. Setup error tracking (Sentry)
6. Enable HTTPS

### Environment Variables (Production)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=<production_mongodb_uri>
JWT_SECRET=<strong_random_key>
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

### Deployment Options
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **AWS EC2**: Deploy with PM2 process manager
- **DigitalOcean**: App Platform or Droplet

## Performance Optimization

- Database indexes on frequently queried fields ✅
- Rate limiting to prevent abuse ✅
- Input validation to prevent injection ✅
- Helmet for security headers ✅
- Pagination for large datasets ✅

## Support & Documentation

- API Documentation: `http://localhost:5000/api/docs` (if Swagger configured)
- Issues: Report via GitHub Issues
- Contact: admin@tuvi.vn

---

**Last Updated**: May 2026  
**Version**: 1.0.0
