# Deepfake Detection Backend

Minimal Express backend scaffold for the "Deepfake Detection and News Verification System for Assessing Media Authenticity" project.

Setup

1. Install dependencies

```bash
cd server
npm install
```

2. Create an `.env` file (or copy `.env.example`) and set any variables you need:

```text
PORT=5000
CLIENT_URL=http://localhost:3000
```

3. Run in development

```bash
npm run dev
```

Health check

GET /api/health

Notes

- Uploads are served from the `uploads` folder.

Database & Auth

1. Set `MONGO_URI` and `JWT_SECRET` in your `.env` (see `.env.example`).

2. Endpoints added:

- `POST /api/auth/register` — register user (body: `name`, `email`, `password`)
- `POST /api/auth/login` — login (body: `email`, `password`)
- `GET /api/auth/profile` — protected; requires `Authorization: Bearer <token>`

News verification

- `POST /api/news/verify` — verify a news URL. JSON body: `{ "url": "https://..." }` (protected; requires auth)
- `GET /api/news/history` — list verifications for authenticated user
- `GET /api/news/:id` — get saved verification result by id

Deepfake image analysis

- `POST /api/deepfake/analyze` — upload image (multipart/form-data, field `image`) to analyze
- `GET /api/deepfake/history` — list deepfake analyses for user
- `GET /api/deepfake/:id` — get deepfake analysis by id

Combined history & reports

- `GET /api/history` — unified list of news + deepfake verifications for user
- `GET /api/history/:id` — get a single verification result by id
- `POST /api/reports/generate` — generate PDF and Excel report (saved in uploads)
- `GET /api/reports` — list generated reports
- `GET /api/reports/:id` — get report metadata

Seeding sample data

To create demo user and sample records:

```bash
node scripts/seed.js
```

Frontend integration notes

- Base API: `http://localhost:5000/api`
- Send JWT in header: `Authorization: Bearer <token>` for protected routes.
- For image upload use `multipart/form-data` with field `image`.

Environment variables required

- `PORT` (optional)
- `CLIENT_URL` (frontend origin)
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (JWT signing secret)


3. Testing with Postman

- Register: POST to `/api/auth/register` with JSON body `{ "name": "Alice", "email": "a@b.com", "password": "secret" }` — returns token.
- Login: POST to `/api/auth/login` with JSON body `{ "email": "a@b.com", "password": "secret" }` — returns token.
- Profile: GET `/api/auth/profile` with header `Authorization: Bearer <token>` — returns user info.
