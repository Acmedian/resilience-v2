# Resilience v2 — Deployment Guide

This covers deploying the FastAPI backend + React frontend to a single AWS
Lightsail Ubuntu instance, served by nginx at `https://resilience.acmedian.com`.

## 1. Server setup

```bash
sudo apt update && sudo apt install -y python3-pip python3-venv nginx mysql-server nodejs npm
sudo npm install -g pm2
```

### 1a. Create the MySQL database

```bash
sudo mysql
CREATE DATABASE resilience_v2 CHARACTER SET utf8mb4;
CREATE USER 'resilience'@'localhost' IDENTIFIED BY '<strong-password>';
GRANT ALL PRIVILEGES ON resilience_v2.* TO 'resilience'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1b. nginx config

Copy `backend/nginx-resilience.conf` to the server:

```bash
sudo cp nginx-resilience.conf /etc/nginx/sites-available/resilience
sudo ln -s /etc/nginx/sites-available/resilience /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/resilience-v2
sudo nginx -t && sudo systemctl reload nginx
```

### 1c. SSL certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d resilience.acmedian.com
```

## 2. Environment variables

On the server, create `backend/.env` from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — `mysql+pymysql://resilience:<password>@localhost/resilience_v2`
- `SECRET_KEY` — generate with `python3 -c "import secrets; print(secrets.token_hex(32))"`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
- `AZURE_SPEECH_KEY` / `AZURE_SPEECH_REGION` — from Azure Speech resource (used client-side by the frontend build, see below)
- `ENVIRONMENT=production`

The frontend reads its own `.env` at **build time** (Vite inlines `VITE_*` vars
into the bundle). Set `frontend/.env` before running `frontend/deploy.sh`:

```
VITE_API_URL=https://resilience.acmedian.com
VITE_GOOGLE_CLIENT_ID=<same client id as backend>
VITE_AZURE_SPEECH_KEY=<azure speech key>
VITE_AZURE_SPEECH_REGION=<azure region>
```

## 3. Database migrations

This repo currently creates tables via `Base.metadata.create_all()` on
startup for local development convenience. Before running `deploy.sh` in
production, initialize Alembic migrations once:

```bash
cd backend
source venv/bin/activate  # or your venv path
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

After that, `deploy.sh`'s `alembic upgrade head` step will apply new
migrations on every deploy.

## 4. Seed initial data

Run once against the production database:

```bash
cd backend
python -m app.seeders.seed_users
python -m app.seeders.seed_screenings
python -m app.seeders.seed_patients
```

This creates the three demo accounts (`patient@demo.com`,
`clinician@demo.com`, `admin@demo.com`), the three demo screenings, and six
demo clinical patients. Skip this step (or write your own seed data) for a
real production launch — these are demo credentials only.

## 5. Start/restart the backend with PM2

```bash
cd backend
bash deploy.sh
```

This pulls the latest code, installs dependencies, runs migrations, and
starts (or restarts) the `resilience-api` PM2 process on port 8001.

Useful PM2 commands:

```bash
pm2 status
pm2 logs resilience-api
pm2 restart resilience-api
```

## 6. Deploy frontend updates

Run **locally** (not on the server):

```bash
cd frontend
bash deploy.sh
```

This builds the production bundle and rsyncs `dist/` to
`/var/www/resilience-v2` on the server, which nginx serves directly.

## 7. Verify

```bash
curl https://resilience.acmedian.com/health  # should return {"status":"ok",...}
```

Then visit `https://resilience.acmedian.com` and sign in with one of the
demo accounts (see the app's own README / commit history for current demo
credentials).
