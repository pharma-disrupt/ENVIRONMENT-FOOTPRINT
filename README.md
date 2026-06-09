# 🌍 Carbon Footprint Platform

A full-stack web application that helps individuals understand, track, and reduce their carbon footprint through personalized insights and actionable goals.

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│   Netlify   │────▶│    Render    │────▶│    Neon     │     │   Upstash   │
│  (Frontend) │     │   (Backend)  │     │  (Postgres) │     │   (Redis)   │
│   Next.js   │◀────│    Fastify   │◀────│  Database   │     │   Cache     │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd carbon-footprint-platform
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Backend** (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   # Edit with your local database credentials
   ```
   
   **Frontend** (`frontend/.env.local`):
   ```bash
   cp frontend/.env.local.example frontend/.env.local
   ```

4. **Set up the database**
   - Create a local PostgreSQL database or use Docker
   - Run migrations from `database/migrations/`
   - Seed initial data from `database/seeds/`

5. **Start development servers**
   ```bash
   npm run dev
   ```
   
   This starts both frontend (port 3000) and backend (port 8080).

## 📁 Project Structure

```
carbon-footprint-platform/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── store/        # Zustand state management
│   │   └── lib/          # Utilities and API client
│   └── package.json
│
├── backend/               # Fastify server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── calculators/  # Carbon calculation logic
│   │   ├── models/       # Database queries
│   │   └── middleware/   # Auth, validation, etc.
│   └── package.json
│
├── database/              # SQL migrations and seeds
│   ├── migrations/
│   └── seeds/
│
├── docs/                  # Documentation
└── docker-compose.yml     # Local development containers
```

## ☁️ Deployment (Free Tier)

See [docs/deployment-netlify.md](./docs/deployment-netlify.md) for complete deployment instructions.

### Quick Deploy Summary

| Component | Platform | Cost |
|-----------|----------|------|
| Frontend | Netlify | Free |
| Backend | Render | Free (sleeps after 15m) |
| Database | Neon | Free (0.5GB) |
| Cache | Upstash | Free (10k commands/day) |

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Charts**: Custom SVG components
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Validation**: Zod
- **Jobs**: node-cron

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (optional)
- **Hosting**: Netlify + Render + Neon + Upstash

## 📊 Features

- ✅ User authentication (JWT)
- ✅ Carbon footprint calculator (IPCC factors)
- ✅ Activity tracking (transport, energy, food, shopping)
- ✅ Personalized goals and challenges
- ✅ Insights and recommendations engine
- ✅ Gamification (badges, streaks)
- ✅ Data visualization (charts, trends)
- ✅ Mobile-responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License

## 🌱 Impact

This platform aims to make carbon footprint tracking accessible and actionable for everyone. By understanding our impact, we can make informed decisions to reduce it.

---

Built with ❤️ for a sustainable future
