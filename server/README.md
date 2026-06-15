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

Deployment Notes (Ubuntu + Nginx + HTTPS)

1. Prepare server

- Install Node.js (LTS), npm, and MongoDB or use a managed MongoDB service.
- Create a system user for the app (e.g. `deepfake`), and clone the repo into `/var/www/deepfake-backend`.

2. Install and build

```bash
cd /var/www/deepfake-backend/server
npm install --production
```

3. Process manager (PM2)

Install PM2 and start the app as a service:

```bash
npm install -g pm2
pm2 start index.js --name deepfake-backend
pm2 save
pm2 startup
```

4. Nginx reverse proxy with HTTPS (Let's Encrypt)

- Install Nginx and Certbot.
- Create an Nginx site config (example):

```
server {
	listen 80;
	server_name your.domain.example;

	location / {
		proxy_pass http://127.0.0.1:5000;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
	location /uploads/ {
		alias /var/www/deepfake-backend/server/uploads/;
	}
}
```

Then obtain a TLS certificate with Certbot and enable HTTPS:

```bash
certbot --nginx -d your.domain.example
```

5. Environment & security

- Store `MONGO_URI` and `JWT_SECRET` in a systemd unit, PM2 environment, or a `.env` file owned by the app user with restrictive permissions.
- Ensure `uploads/` and `logs/` directories are writable by the app user and not world-writable.

6. Additional production notes

- Use a managed MongoDB or run a replica set for reliability.
- Monitor logs (PM2 + Nginx) and set up log rotation.
- Consider rate-limiting and authentication hardening before public deployment.

Final README additions
----------------------
Below are consolidated installation, run, test, and deployment steps.

Installation steps

1. Clone repo and install dependencies

```bash
git clone <repo-url>
cd <repo>/server
npm install
```

Run steps

```bash
cp .env.example .env   # edit .env
npm run dev            # development with nodemon
npm start              # production (node index.js) or use PM2
```

Test steps

1. Start server and check health:

```bash
curl http://localhost:5000/api/health
```

2. Register + login (use Postman or curl):

```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Demo","email":"demo@example.com","password":"password123"}'
```

3. Use returned token to call protected endpoints (news verify, deepfake analyze, history).

Deployment steps (Ubuntu + Nginx + HTTPS)

1. Install Node.js, npm, and MongoDB or use a managed DB.
2. Clone repo to server and `npm install --production`.
3. Start app with PM2 and save the process list.
4. Configure Nginx as reverse proxy and obtain TLS with Certbot.
5. Ensure environment variables are set securely and directories have correct permissions.



3. Testing with Postman

- Register: POST to `/api/auth/register` with JSON body `{ "name": "Alice", "email": "a@b.com", "password": "secret" }` — returns token.
- Login: POST to `/api/auth/login` with JSON body `{ "email": "a@b.com", "password": "secret" }` — returns token.
- Profile: GET `/api/auth/profile` with header `Authorization: Bearer <token>` — returns user info.
