# CPVault

A personal vault for competitive programmers to save problems worth revisiting — whether for a key technique learned, a tricky edge case, or just a problem you want to remember.

## What It Does

- **Organize by Decks**: Group notes into themed decks (e.g., "DP Optimizations", "Graph Tricks", "Segment Trees")
- **Capture What Matters**: For each problem, save the key takeaway, your solution, mistakes made, and alternative approaches
- **Public or Private**: Share useful decks with others, or keep your personal notes private

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Backend | ASP.NET Core (.NET 10) |
| Database | PostgreSQL 16 |
| Auth | JWT Bearer Tokens |
| Containerization | Docker, docker-compose |

## Quick Start (Docker)

Run the entire stack with one command:

```bash
docker-compose up --build
```

Once running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5263
- **Swagger UI**: http://localhost:5263/swagger

## Local Development

If you prefer running without Docker:

```bash
# Terminal 1: Start database only
docker-compose up postgres -d

# Terminal 2: Run backend
dotnet ef database update
dotnet run

# Terminal 3: Run frontend
cd frontend
npm install
npm run dev
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│              React + TypeScript (Port 3000)                      │
│                                                                  │
│  ┌────────────┐   ┌────────────┐   ┌────────────────┐           │
│  │  Login     │   │  DeckList  │   │  DeckDetails   │           │
│  └─────┬──────┘   └─────┬──────┘   └───────┬────────┘           │
│        │                │                   │                    │
│        └────────────────┼───────────────────┘                    │
│                         ▼                                        │
│              ┌────────────────────┐                             │
│              │  AuthContext       │  JWT Token Management        │
│              │  Axios Interceptor │  Auto-attach Bearer token    │
│              └─────────┬──────────┘                             │
└────────────────────────┼────────────────────────────────────────┘
                         │ HTTP + JWT
                         ▼
┌────────────────────────┴────────────────────────────────────────┐
│                         BACKEND                                  │
│              ASP.NET Core Web API (Port 5263)                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Middleware Pipeline                                         │ │
│  │   UseCors → UseAuthentication → UseAuthorization            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                         │                                        │
│  ┌──────────────────────┼──────────────────────────────────────┐│
│  │ Controllers          ▼                                       ││
│  │  AuthController   DecksController   NotesController          ││
│  │  (login/register) (CRUD + ownership) (CRUD + parent-auth)   ││
│  └──────────────────────┬──────────────────────────────────────┘│
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────────┐│
│  │ Entity Framework Core (ORM)                                  ││
│  │   User ←─── 1:Many ───→ Deck ←─── 1:Many ───→ Note          ││
│  └──────────────────────┬──────────────────────────────────────┘│
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────┴───────────────────────────────────────┐
│                     PostgreSQL (Port 5432)                       │
│                                                                  │
│   Tables: Users, Decks, Notes, __EFMigrationsHistory            │
│   Constraints: Unique email index                                │
└──────────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Authenticate and get JWT |

### Decks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/decks/public` | No | List all public decks |
| GET | `/api/decks/mine` | Yes | List your decks |
| GET | `/api/decks/{id}` | Conditional | Get deck (public or owned) |
| POST | `/api/decks` | Yes | Create a new deck |
| PUT | `/api/decks/{id}` | Yes | Update your deck |
| DELETE | `/api/decks/{id}` | Yes | Delete your deck |

### Notes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/decks/{id}/notes` | Conditional | List notes in deck |
| POST | `/api/decks/{id}/notes` | Yes | Add note to your deck |
| PUT | `/api/notes/{id}` | Yes | Update your note |
| DELETE | `/api/notes/{id}` | Yes | Delete your note |

## Project Structure

```
CPVault/
├── Controllers/           # API endpoints
│   ├── AuthController.cs  # Register, Login
│   ├── DecksController.cs # Deck CRUD
│   ├── NotesController.cs # Note CRUD
│   └── HealthController.cs
├── Models/                # Database entities
│   ├── User.cs
│   ├── Deck.cs
│   └── Note.cs
├── Dtos/                  # Request/Response shapes
├── Data/                  # DbContext + migrations
├── Extensions/            # Helper methods
├── Program.cs             # App configuration
├── Dockerfile             # Backend container
├── docker-compose.yml     # Full stack orchestration
└── frontend/              # React application
    ├── src/
    │   ├── api/           # Axios + API helpers
    │   ├── auth/          # AuthContext
    │   └── pages/         # React pages
    ├── Dockerfile         # Frontend container
    └── nginx.conf         # SPA routing + API proxy
```

## How It Works

### Authentication Flow
1. User registers → password hashed with PBKDF2 → stored in database
2. User logs in → credentials verified → JWT token generated
3. Frontend stores token in localStorage
4. Axios interceptor attaches `Bearer {token}` to every request
5. Backend validates token signature and extracts user ID

### Authorization Model
- **Public endpoints**: Anyone can access (e.g., `GET /api/decks/public`)
- **Protected endpoints**: Require valid JWT (marked with `[Authorize]`)
- **Ownership checks**: Only deck owner can modify their decks/notes

### Docker Setup
The `docker-compose.yml` orchestrates three services:
1. **postgres**: PostgreSQL 16 database with persistent volume
2. **backend**: .NET 10 API, waits for database health check
3. **frontend**: Nginx serving React build, proxies `/api` to backend

## Environment Variables

In production, override these in docker-compose or environment:

| Variable | Description |
|----------|-------------|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string |
| `Jwt__Key` | Secret key for signing tokens (min 32 chars) |
| `Jwt__Issuer` | Token issuer identifier |
| `Jwt__Audience` | Token audience identifier |
