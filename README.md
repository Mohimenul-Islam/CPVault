# CPVault

A personal vault for competitive programmers to save problems worth revisiting — whether for a key technique learned, a tricky edge case, or just a problem you want to remember.

## What It Does

- **Organize by Decks**: Group notes into themed decks (e.g., "DP Optimizations", "Graph Tricks", "Segment Trees")
- **Capture What Matters**: For each problem, save the key takeaway, your solution, mistakes made, and alternative approaches
- **Public or Private**: Share useful decks with others, or keep your personal notes private

## Tech Stack

- ASP.NET Core (.NET 10)
- PostgreSQL + Entity Framework Core
- JWT Authentication
- Docker

## Quick Start

```bash
# Start database
docker-compose up -d

# Apply migrations
dotnet ef database update

# Run API
dotnet run
```

Open `http://localhost:5263/swagger` to explore the API.

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Get JWT token |
| `GET /api/decks/mine` | Your decks |
| `GET /api/decks/public` | Browse public decks |
| `POST /api/decks` | Create a deck |
| `POST /api/decks/{id}/notes` | Add a note |

## Project Structure

```
Controllers/   → API endpoints
Models/        → User, Deck, Note entities
Dtos/          → Request/response shapes
Data/          → Database context
```
