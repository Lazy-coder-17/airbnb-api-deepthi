# Airbnb API (airbnb-api-deepthi)

This repository contains an Express + Handlebars app for managing Airbnb-style listings. The project includes a serverless wrapper for Vercel deployment and a local `server.js` for development.

## What's included

- Express app in `app.js` (exported) and a local `server.js` for starting the app.
- Serverless function wrapper at `api/index.js` (uses `serverless-http`) for Vercel deployment.
- Routes under `routes/airbnbs.js` (HTML and API routes).
- Views in `views/` (Handlebars) and static assets in `public/`.
- MongoDB config in `config/database.js` (reads `MONGO_URI` from environment).

---

## Prerequisites

- Node 18.x (recommended)
- npm
- A running MongoDB instance and connection URI
- (For deployment) A Vercel account and `vercel` CLI (optional; can use dashboard)

---

## Environment variables

Create a `.env` file in the project root or set environment variables in your host. The app expects at least:

- `MONGO_URI` — MongoDB connection string (e.g. mongodb+srv://<user>:<pass>@cluster0.mongodb.net)
- `PORT` — (optional) port for local server, default comes from config (8000 by default)

Example `.env`:

MONGO_URI="mongodb+srv://USER:PASS@cluster0.example.mongodb.net"
PORT=8000
 
---

## Install and run locally

From the project folder (`airbnb-api-deepthi`):

```bash
# Install dependencies
npm install

# (Optional) install dev tool for auto-reload
npm install -D nodemon

# Start the app locally
node server.js
# or if you added nodemon
npx nodemon server.js
```

Visit http://localhost:8000/airbnbs (or the port you configured).

Notes:
- `server.js` is a small local starter that imports and listens on the Express `app` exported from `app.js`.
- The app uses Handlebars templates in `views/` and serves static assets from `public/`.

---

## Git: push to remote (quick commands)

```bash
# initialize local repo (if needed)
git init
git add .
git commit -m "Initial commit - Airbnb API"

# add remote and push (adjust URL)
git remote add origin git@github.com:<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

---

## Deploy to Vercel (recommended flow)

This project is prepared for Vercel serverless deployment via the `api/index.js` handler. The function wraps the Express app so your routes and Handlebars rendering will work server-side.

1. Install Vercel CLI (optional):

```bash
npm i -g vercel
```

2. Make sure `serverless-http` is installed as a dependency:

```bash
npm install serverless-http
```

3. Commit all changes and push them to your Git remote (Vercel can deploy from GitHub/GitLab/Bitbucket).

4. Deploy via Vercel CLI (interactive):

```bash
vercel login
vercel --prod
```

During deploy, add environment variables (MONGO_URI) when prompted, or later in the Vercel dashboard under Project Settings → Environment Variables.
Alternatively, deploy from the Vercel Dashboard by importing your Git repository and setting the `MONGO_URI` environment variable in the dashboard.

Notes for Vercel:
- The serverless function lives at `/api/index.js` and will serve all Express routes through the function. Statically served files in `/public` will be served by Vercel automatically.
- If you need Node 18, add an `engines.node` entry to `package.json` or set the Vercel runtime via `vercel.json`.

Example `vercel.json` (optional):

```json
{
	"functions": {
		"api/index.js": {
			"runtime": "nodejs18.x"
		}
	}
}
```

---

## Post-deploy checks / Troubleshooting

- If the app returns template errors after deployment, verify the working directory and that `views/` and `public/` files were included in the repo.
- Ensure `MONGO_URI` is set in Vercel and the database is reachable from Vercel (allow IP access or use a cloud-hosted DB like Atlas).
- To view logs during or after deploy, use the Vercel dashboard or `vercel logs <deployment-url>`.

---

## Additional tips

- If you want to keep the `/airbnbs/new` anchor working as an alias, add a redirect in `routes/airbnbs.js`:

```js
router.get('/new', (req, res) => res.redirect('/airbnbs/add'));
```

- To bulk import sample data into your MongoDB, see the `airbnbs-sample.json` (not included in this repo) and use `mongoimport --db <db> --collection airbnbs --file airbnbs-sample.json --jsonArray`.

---

If you'd like, I can:
- Add a `vercel.json` file automatically and finish `package.json` updates (scripts + engines). 
- Add a script that POSTs sample data to `/airbnbs/api` to seed the DB.

Tell me which of the two you'd like me to do next and I'll implement it.

