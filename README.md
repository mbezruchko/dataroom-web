# DataRoom Web

Production link -> https://dataroom-web.onrender.com

Web frontend for **DataRoom** — a file and folder management application. Browse folders, upload files, manage favorites, search, and restore items from trash.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — dev server and build
- **React Router v7** — routing
- **TanStack Query** — server state and caching
- **Zustand** — client state
- **Tailwind CSS** — styling
- **Radix UI** — accessible components
- **Axios** — HTTP client
- **Lucide React** — icons
- **Sonner** — toasts

## Prerequisites

- **Node.js** 18+ (or 20+ recommended)
- **npm** or **pnpm** or **yarn**

A running **DataRoom API** backend is required (e.g. at `http://localhost:8000`). The frontend talks to it via `/api/v1` by default.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (or the next free port Vite reports).

In development, requests to `/api` are proxied to `http://localhost:8000` (see `vite.config.ts`). Ensure the backend is running so folders and files load correctly.

### Build for production

```bash
npm run build
```

Output goes to the `dist/` folder. Serve it with any static file server.

### Preview production build locally

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Variables

| Variable              | Description                                      | Default   |
|-----------------------|--------------------------------------------------|-----------|
| `VITE_API_BASE_URL`   | Base URL for the DataRoom API (e.g. `/api/v1`)   | `/api/v1` |

Create a `.env` file in the project root if you need to override the API URL (e.g. for a different backend host in production).

## Main Features

- **File explorer** — navigate folders, view files and subfolders, breadcrumbs
- **Create folders** — new folders inside the current folder
- **Upload files** — upload one or more files into the current folder
- **Rename** — rename folders inline
- **Favorites** — mark folders and files as favorites; view them in **Favorites**
- **Trash** — deleted items go to trash; **Trash** view allows restore or permanent delete
- **Search** — full-text search across folders and files
- **Download** — download files via the API

## Project Structure (overview)

```
src/
├── components/
│   ├── layout/     # Layout, Header
│   ├── ui/         # Buttons, cards, dialogs, shared UI
│   └── views/      # FileExplorer, Favorites, Trash, SearchResults, NotFound
├── hooks/          # useResourceActions and other hooks
├── lib/
│   ├── api.ts      # Axios instance, API types
│   └── queries.ts  # TanStack Query hooks for folders, files, search
└── App.tsx         # Routes and root layout
```

## Routes

| Path              | Description                    |
|-------------------|--------------------------------|
| `/`               | Redirects to `/root`           |
| `/root`           | Root folder (file explorer)    |
| `/folder/:folderId` | Folder by ID (file explorer) |
| `/favorites`      | Favorites list                 |
| `/trash`          | Trash (deleted items)          |
| `/search`         | Search results                 |

All other paths show a 404 page.
