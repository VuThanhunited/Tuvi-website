# Tử Vi Online - Vietnamese Astrology Platform

A full-stack web application for Vietnamese classical astrology (Tử Vi) readings with user authentication, admin panel, and real-time calculations.

## 📁 Project Structure

```
.
├── server/          # Express.js backend API (Port 5000)
├── client/          # React frontend (Port 3000)
└── admin/           # React admin dashboard (Port 3001)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (https://nodejs.org/)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Server Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```
Server runs at: `http://localhost:5000`

### 2. Client Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Client runs at: `http://localhost:3000`

### 3. Admin Dashboard Setup
```bash
cd admin
npm install
cp .env.example .env
npm run dev
```
Admin runs at: `http://localhost:3001`

## 🔐 Security Features

✅ **Rate Limiting**
- Prevents brute force attacks on login
- Resource throttling for expensive operations

✅ **Input Validation**
- Server-side validation with express-validator
- Strong password requirements
- Date/email sanitization

✅ **Authentication**
- JWT-based auth with access + refresh tokens
- Bcryptjs password hashing
- Session management

✅ **CORS & Security Headers**
- Helmet.js for security headers
- Configurable CORS origins
- XSS & Clickjacking protection

✅ **Database Security**
- Proper indexing for performance
- Mongoose schema validation
- User data encryption

## 📚 Documentation

### Server
- [Server README](./server/README.md) - Backend setup & API documentation
- [.env.example](./server/.env.example) - Environment variables reference

### Client
- [.env.example](./client/.env.example) - Frontend configuration

### Admin
- [.env.example](./admin/.env.example) - Admin panel configuration

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + ES Modules
- **Framework**: Express.js 4.21+
- **Database**: MongoDB + Mongoose 8.9+
- **Authentication**: JWT + Bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, express-rate-limit, CORS

### Frontend (Client)
- **Framework**: React 19.1+
- **Build Tool**: Vite 6.3+
- **Routing**: React Router DOM 7.14+
- **State**: Context API
- **Styling**: Pure CSS

### Admin
- **Framework**: React 19.1+
- **Build Tool**: Vite 6.3+
- **Editor**: React Quill 2.0+ (Rich text editing)
- **HTTP Client**: Axios 1.6+
- **Icons**: Lucide React 0.292+
- **Styling**: Pure CSS

## 📝 API Routes

### Authentication
```
POST   /api/auth/register           - Register new account
POST   /api/auth/login              - Login
POST   /api/auth/refresh-token      - Refresh access token
GET    /api/auth/me                 - Get current user
PUT    /api/auth/update-profile     - Update profile
PUT    /api/auth/change-password    - Change password
```

### Tử Vi Calculations
```
POST   /api/tuvi/calculate          - Calculate reading
GET    /api/tuvi/history            - User's history
GET    /api/tuvi/:id                - Get specific result
DELETE /api/tuvi/:id                - Delete result
GET    /api/tuvi/stats              - Admin stats
```

### Articles
```
GET    /api/articles                - List articles
GET    /api/articles/:slug          - Get article
POST   /api/articles                - Create (admin)
PUT    /api/articles/:id            - Update (admin)
DELETE /api/articles/:id            - Delete (admin)
```

### Masters
```
GET    /api/masters                 - List masters
GET    /api/masters/:id             - Get master details
```

### Admin
```
GET    /api/admin/stats             - Dashboard statistics
```

### Contact
```
POST   /api/contact                 - Submit contact form
GET    /api/contact                 - Get contacts (admin)
```

## 🔧 Environment Setup

### Server (.env)
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://...
JWT_SECRET=<strong-random-key>
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Client (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

### Admin (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

See `.env.example` files for complete reference.

## 📊 Database Models

- **User** - User accounts (user/admin/master roles)
- **TuViResult** - Calculation results
- **Article** - Knowledge base articles
- **Interpretation** - Horoscope interpretation data
- **MasterProfile** - Astrology expert profiles
- **Contact** - Contact form submissions
- **TuViDatabase** - Reference data for calculations

## 🚢 Deployment

### Requirements
- Production Node.js 16+
- MongoDB Atlas or self-hosted MongoDB
- Environment variables configured
- SSL certificate for HTTPS

### Steps
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production `CORS_ORIGINS`
4. Deploy to: Heroku, Railway, AWS, DigitalOcean, etc.
5. Setup HTTPS with reverse proxy (Nginx)

See [Server README](./server/README.md) for detailed deployment guide.

## 🐛 Troubleshooting

### CORS Errors
- Check `CORS_ORIGINS` in `.env` includes your frontend URL
- Ensure format: `http://localhost:3000` (with protocol)

### MongoDB Connection Failed
- Verify `MONGODB_URI` in `.env`
- Ensure MongoDB is running
- Check firewall/security group rules

### Port Already in Use
- Change `PORT` in `.env` for backend
- Use `npm run dev -- --port 3002` for frontend

### JWT Token Errors
- Check `JWT_SECRET` is set in `.env`
- Use `Authorization: Bearer <token>` header format
- Get new token via `/refresh-token` endpoint if expired

## 📖 Features

### User Features
- User registration & authentication
- Tử Vi reading calculation
- Personal reading history
- Favorites collection
- Article browsing
- Knowledge base access
- Contact form submission

### Admin Features
- User management
- Article CMS (create/edit/delete)
- Master profile management
- Contact form management
- Interpretation management
- Dashboard statistics

### Master Features
- Profile showcase
- Reading availability
- Client consultation

## 🔄 Version History

**v1.0.0** - Initial release
- Core Tử Vi calculation engine
- User authentication
- Admin panel
- Article management

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For issues or questions:
- Email: admin@tuvi.vn
- GitHub Issues: [Create an issue]

---

**Last Updated**: May 2026  
**Created by**: [Your Team]
