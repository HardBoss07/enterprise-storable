# Storable Deployment Guide

This guide explains how to deploy **Storable** using Docker for self-hosting.

## Prerequisites

- Docker and Docker Compose installed.
- (Optional) Nginx Proxy Manager or similar reverse proxy for SSL.

## One-Click Setup (Docker Compose)

1. **Clone the repository** (or download the release files).
2. **Configure Environment:**
   Copy `.env.example` to `.env` and update the values.

   ```bash
   cp .env.example .env
   ```

   _Note: Ensure `MYSQL_ROOT_PASSWORD` is set to a strong password._

3. **Launch:**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

## Portainer Setup

1. Open Portainer and go to **Stacks** -> **Add stack**.
2. Name the stack `storable`.
3. Paste the contents of `docker-compose.production.yml` into the Web editor.
4. Add the Environment Variables from `.env` in the **Environment variables** section.
5. Click **Deploy the stack**.

## Nginx Proxy Manager (Reverse Proxy)

To access Storable via a domain (e.g., `files.example.com`):

1. **Frontend Proxy:**
   - Add a new **Proxy Host**.
   - Domain: `files.example.com`
   - Scheme: `http`
   - Forward IP: `storable_app` (or your host IP)
   - Forward Port: `3000`
   - Enable **Websockets Support**.

2. **Backend Proxy (Optional/Advanced):**
   - The frontend communicates with the backend via `NEXT_PUBLIC_API_URL`.
   - If using a reverse proxy, set `NEXT_PUBLIC_API_URL=https://files.example.com/api` (if you proxy `/api` to port `8080`) or use a separate subdomain like `api.example.com`.

## Troubleshooting

- **Large Uploads:** If using Nginx Proxy Manager, ensure `client_max_body_size` is set to `0` or your desired limit in the **Advanced** tab:
  ```nginx
  client_max_body_size 5G;
  ```
- **Database Connection:** Ensure the `SPRING_DATASOURCE_URL` in `.env` uses `db` as the hostname if running in Docker.

---

_Storable - High-performance private file management._
