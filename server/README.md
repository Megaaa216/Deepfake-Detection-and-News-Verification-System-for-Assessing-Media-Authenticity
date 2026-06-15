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

3. Testing with Postman

- Register: POST to `/api/auth/register` with JSON body `{ "name": "Alice", "email": "a@b.com", "password": "secret" }` — returns token.
- Login: POST to `/api/auth/login` with JSON body `{ "email": "a@b.com", "password": "secret" }` — returns token.
- Profile: GET `/api/auth/profile` with header `Authorization: Bearer <token>` — returns user info.
