# DayCraft: Make Your Days Count.

DayCraft is a personal task manager built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) for the Term Work-2 micro project *"Design and Implement a Simple Full Stack Web Application Using MERN Stack"*.

Users register, log in, and manage their own tasks: create, view, edit, delete, search, filter, and track progress.

## Features

- Public **home page** with hero, features, how-it-works section and footer
- **Registration and login** with server-side validation and bcrypt-hashed passwords
- Secure sessions: short-lived **JWT stored in an HttpOnly cookie**, CSRF guard, Helmet, CORS, rate limiting on auth routes
- Protected **dashboard** (data display page) with summary cards calculated from MongoDB records
- Full **CRUD** for tasks (title, description, category, priority, due date, status), with a styled delete confirmation dialog
- **Search** by title, **filter** by status and priority, **sort** by newest, due date or priority
- One-click "mark as completed"
- Users can only see and change **their own** tasks (enforced in every database query)
- Responsive layout (phone, tablet, desktop), keyboard-accessible, original SVG logo and favicon
- Visual design uses only four colours: Deep Teal `#0F5B55`, Warm Cream `#F8F5EB`, Muted Gold `#D5B45B`, Slate Navy `#344A73`

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, plain CSS |
| Backend | Node.js, Express 4, REST API |
| Database | MongoDB (Atlas or local) with Mongoose |
| Security | bcryptjs, jsonwebtoken, cookie-parser, helmet, cors, express-rate-limit |

## Folder structure

```
daycraft/
├── client/                  React app (Vite)
│   ├── public/              logo.svg, logo-full.svg, favicon.svg
│   └── src/
│       ├── components/      Logo, Field, Modal, TaskModal, ConfirmDialog, Toast, ...
│       ├── context/         AuthContext (login state)
│       ├── hooks/           useDebounce
│       ├── pages/           Home, Register, Login, Dashboard, NotFound
│       ├── services/        api.js (all calls to the backend)
│       └── styles/          global.css, home.css, auth.css, dashboard.css
├── server/                  Express API
│   ├── config/              db.js (MongoDB connection)
│   ├── controllers/         authController.js, taskController.js
│   ├── middleware/          auth.js, csrf.js, errorHandler.js
│   ├── models/              User.js, Task.js
│   ├── routes/              authRoutes.js, taskRoutes.js
│   ├── utils/               validators.js, token.js, constants.js
│   ├── tests/               validators.test.js
│   ├── app.js               Express app
│   └── server.js            starts the server
├── docs/                    architecture.svg, REPORT_TEMPLATE.md, TESTING_CHECKLIST.md
├── .gitignore
└── README.md
```

---

## Prerequisites (Windows)

1. **Node.js LTS** (version 18 or newer): download from <https://nodejs.org>, install with the default options. Check it worked, in a new terminal:
   ```
   node -v
   npm -v
   ```
2. **Git**: <https://git-scm.com/download/win> (needed for the GitHub upload).
3. **VS Code**: you already have it. Use its built-in terminal (**Terminal → New Terminal**).
4. A free **MongoDB Atlas** account: <https://www.mongodb.com/cloud/atlas/register>.

## Step 1: Create the MongoDB Atlas database

1. Sign in to Atlas and create a **free (M0)** cluster. Any cloud provider and region is fine.
2. **Database Access** → **Add New Database User**. Choose a username and a password. Use only letters and numbers in the password to avoid problems. Give it *Read and write to any database*. Save the password somewhere safe.
3. **Network Access** → **Add IP Address** → **Add Current IP Address**. (If you move to another Wi-Fi later, add that IP too.)
4. **Database** → **Connect** → **Drivers**. Copy the connection string. It looks like:
   ```
   mongodb+srv://myuser:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your real password and add the database name `daycraft` just before the `?`:
   ```
Configure your MongoDB connection using the `MONGODB_URI` environment variable. Never commit database credentials to GitHub.
   ```

> **Local MongoDB instead?** Install MongoDB Community Server, make sure the service is running, and use
> `MONGODB_URI=mongodb://127.0.0.1:27017/daycraft`.

## Step 2: Start the backend (Terminal 1)

Open a terminal in VS Code. Commands starting from the project root (the `daycraft` folder):

```
cd server
npm install
copy .env.example .env
```

Open `server/.env` and fill it in:

- `MONGODB_URI`: the connection string from Step 1
- `JWT_SECRET`: a long random text. Generate one with:
  ```
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
  and paste the output after `JWT_SECRET=`.

Start the server:

```
npm run dev
```

You should see `MongoDB connected: daycraft` and `DayCraft API listening on http://localhost:5000`. Leave this terminal running.
Quick check: open <http://localhost:5000/api/health> in the browser. It should show `"DayCraft API is running."`.

## Step 3: Start the frontend (Terminal 2)

Open a **second** terminal (click the **+** in the terminal panel) and run, from the project root:

```
cd client
npm install
npm run dev
```

Open **<http://localhost:5173>**. Vite forwards every `/api` request to the backend on port 5000, so no extra configuration is needed.

| What | Address |
|---|---|
| Website (React) | http://localhost:5173 |
| API (Express) | http://localhost:5000/api |

## API endpoints

All bodies and responses are JSON. Routes marked 🔒 need a logged-in user (the cookie is sent automatically by the browser). Requests that change data must include the header `X-Requested-With: DayCraft` (the React app does this for you).

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account and log in |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out (clears the cookie) |
| GET | `/api/auth/me` 🔒 | Current user (used to restore login after refresh) |
| GET | `/api/tasks` 🔒 | List my tasks + statistics. Query: `search`, `status`, `priority`, `sort` (`newest`, `due`, `priority`) |
| POST | `/api/tasks` 🔒 | Create a task |
| GET | `/api/tasks/:id` 🔒 | Get one of my tasks |
| PUT | `/api/tasks/:id` 🔒 | Update one of my tasks |
| DELETE | `/api/tasks/:id` 🔒 | Delete one of my tasks |
| GET | `/api/health` | Health check |

## Database design

**users**: `name`, `email` (unique), `passwordHash`, `createdAt`, `updatedAt`
**tasks**: `title`, `description`, `category`, `priority` (Low/Medium/High), `status` (Pending/In Progress/Completed), `dueDate`, `userId` (owner, indexed), `createdAt`, `updatedAt`

## Testing

Automated unit tests for the validation rules (no database needed):

```
cd server
npm test
```

The full end-to-end checklist (register, login, CRUD, ownership, mobile layout...) is in [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md). Work through it on your own running copy and tick each item only after you have seen it work.

### Verification status of this code

Before delivery the following were checked in a build environment without internet access or a MongoDB database:

- Server and client source files pass syntax checks, and the client bundles successfully
- The 10 validation unit tests in `server/tests` pass
- The colour audit found only the four approved colours in the CSS, SVG and JSX

**Not yet run:** the live app against MongoDB, the browser UI, and the responsive layouts. You need to run these yourself using the checklist and take your own screenshots.

## Upload to GitHub

1. Create an account at <https://github.com>, then click **New repository**. Name it `daycraft`, leave it empty (no README, no .gitignore), and click **Create repository**.
2. In the VS Code terminal, from the **project root** (`daycraft`):
   ```
   git init
   git add .
   git status
   ```
   Check the list: `node_modules` and `.env` must **not** appear. (`.env.example` is fine.)
3. Commit and push (replace the URL with the one GitHub shows you):
   ```
   git commit -m "DayCraft: MERN task manager"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/daycraft.git
   git push -u origin main
   ```
4. Refresh the repository page and confirm your code is there. Copy the repository URL into your report.

> If you ever commit `.env` by mistake, change your Atlas database password and `JWT_SECRET` immediately.

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm.ps1 cannot be loaded because running scripts is disabled` (PowerShell) | Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or use **Command Prompt** instead of PowerShell. |
| `MONGODB_URI is not set` | You did not create `server/.env`. Run `copy .env.example .env` inside `server` and fill it in. |
| `Could not connect to MongoDB` / timeout | In Atlas → **Network Access**, add your current IP. Check the username and password in the connection string. |
| `bad auth` / authentication failed | Wrong database user or password. Special characters in passwords must be URL-encoded; easiest is to create a new password with letters and numbers only. |
| `JWT_SECRET is missing` | Fill in `JWT_SECRET` in `server/.env`. |
| `EADDRINUSE: address already in use :::5000` | Another program uses port 5000. Close the old terminal, or change `PORT` in `server/.env` **and** the proxy `target` in `client/vite.config.js`. |
| "Cannot reach the server" in the browser | The backend is not running. Start Terminal 1 (`npm run dev` in `server`). |
| Edited `.env` but nothing changed | Stop the server (Ctrl + C) and start it again. |
| Logged out right after logging in | Make sure you open the site at `http://localhost:5173` (not by IP address) and that the backend is running. |
| Session expires after 2 hours | Intentional (short-lived login). Change `JWT_EXPIRES_HOURS` in `server/.env`. |

## Notes on deployment

The project is meant to run locally. If you deploy later, serve both over HTTPS, set `NODE_ENV=production`, set `CLIENT_URL` to your site address, and set `VITE_API_URL` for the client build. Cookies marked `secure` only work over HTTPS.
