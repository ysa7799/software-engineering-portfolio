# Shift Log REST API

A RESTful API for logging security/operations incidents on a shift — built with **Node.js + Express**. Models the kind of shift log kept in a physical-security/G4S environment, turned into a clean backend service.

## Features
- Full CRUD: create, read, update, delete incident entries
- Input **validation** (required title, category enum, priority enum) with clear 400 errors
- **Filtering** by category and priority (`/api/logs?category=Alarm%20Response&priority=high`)
- Health check endpoint; proper HTTP status codes (200/201/400/404)
- In-memory store so it runs with zero setup (swap for MongoDB in production — same route layer)

## Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Service status + record count |
| GET | `/api/logs` | List (optional `?category=` `?priority=`) |
| GET | `/api/logs/:id` | One entry |
| POST | `/api/logs` | Create (title, category, priority?, notes?) |
| PUT | `/api/logs/:id` | Update |
| DELETE | `/api/logs/:id` | Delete |

## Run it
```bash
npm install
npm start        # API on http://localhost:3000
npm test         # runs the test suite
```

## Example
```bash
curl -X POST localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"title":"Door alarm zone 3","category":"Alarm Response","priority":"high"}'
```

## Skills demonstrated
REST API design, Express routing/middleware, request validation, HTTP status semantics, automated testing, clean project structure.
