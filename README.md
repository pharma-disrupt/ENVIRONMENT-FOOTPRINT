# Carbon Footprint Awareness Platform

A comprehensive solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## 🌱 Features

- **Track Activities**: Log daily activities across transport, energy, food, flights, and shopping
- **Footprint Analysis**: Visualize your carbon footprint with interactive charts and breakdowns
- **Personalized Goals**: Set and track carbon reduction goals
- **Community Challenges**: Join challenges to reduce emissions with others
- **Smart Insights**: Get AI-powered tips and recommendations
- **Gamification**: Earn badges and maintain streaks for consistent eco-friendly behavior
- **Trend Analysis**: Monitor your progress over time with detailed analytics

## 🏗️ Architecture

```
carbon-footprint-platform/
├── frontend/          # Next.js 14+ App Router, TypeScript, TailwindCSS
├── backend/           # Node.js + Fastify, TypeScript
├── database/          # PostgreSQL migrations and seeds
├── tests/             # Unit, integration, and fixture files
└── docs/              # API documentation and methodology
```

### Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Zustand (State Management)
- Recharts (Data Visualization)
- Axios (API Client)

**Backend:**
- Node.js + Fastify
- TypeScript
- PostgreSQL (Database)
- Redis (Caching & Sessions)
- Zod (Validation)
- JWT (Authentication)

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carbon-footprint-platform
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL on port 5432
   - Redis on port 6379
   - Backend API on port 3001
   - Frontend on port 3000

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - API Documentation: http://localhost:3001/api/docs

### Local Development (without Docker)

1. **Start database and Redis**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Run migrations**
   ```bash
   cd database
   psql -U carbon_user -d carbon_footprint -f migrations/001_create_users.sql
   # ... run all migration files
   ```

3. **Start backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Start frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📊 Database Schema

The platform uses PostgreSQL with the following main tables:

- `users` - User authentication and accounts
- `profiles` - User profiles with household and location data
- `activities` - Logged carbon-emitting activities
- `footprint_snapshots` - Aggregated footprint data for trends
- `goals` - User carbon reduction goals
- `challenges` - Community challenges
- `user_challenges` - Challenge participation tracking
- `badges` - Achievement badges
- `user_badges` - User badge awards
- `emission_categories` - Emission factor categories
- `emission_factors` - CO2e calculation factors

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |
| GET | `/api/activities` | List activities |
| POST | `/api/activities` | Log new activity |
| GET | `/api/footprint` | Get footprint overview |
| GET | `/api/footprint/breakdown` | Category breakdown |
| GET | `/api/footprint/trends` | Historical trends |
| GET | `/api/goals` | List goals |
| POST | `/api/goals` | Create goal |
| GET | `/api/challenges` | List challenges |
| POST | `/api/challenges/:id/join` | Join challenge |
| GET | `/api/insights` | Get personalized tips |

See [docs/api-reference.md](docs/api-reference.md) for full API documentation.

## 🧮 Carbon Calculation Methodology

Our calculations are based on IPCC (Intergovernmental Panel on Climate Change) emission factors. See [docs/emission-methodology.md](docs/emission-methodology.md) for detailed methodology.

### Categories Tracked

1. **Transport** - Cars, motorcycles, public transit, cycling
2. **Energy** - Electricity, heating, cooling
3. **Food** - Diet choices, food waste
4. **Flights** - Air travel (domestic & international)
5. **Shopping** - Consumer goods, clothing, electronics

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 📁 Project Structure

See the architecture diagram at the top of this README for complete structure.

### Key Directories

- `frontend/src/app` - Next.js pages and routing
- `frontend/src/components` - Reusable UI components
- `frontend/src/hooks` - Custom React hooks
- `frontend/src/store` - Zustand state stores
- `backend/src/routes` - API route definitions
- `backend/src/controllers` - Request handlers
- `backend/src/services` - Business logic
- `backend/src/calculators` - Carbon calculation engines
- `backend/src/models` - Database queries
- `database/migrations` - SQL migration files
- `database/seeds` - Initial data seeding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🌍 Impact

Every small action counts. Together, we can make a significant impact on reducing global carbon emissions.

---

**Built with ❤️ for a sustainable future**
