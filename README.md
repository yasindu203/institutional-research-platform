# Fundamental Investment Research System (FIRS)

Institutional-grade investment research platform with a 5-layer analytical architecture.

## Architecture

- **Frontend**: Next.js (static export) → hosted on GitHub Pages
- **Backend**: Python FastAPI → hosted on Render.com
- **Database**: SQLite (dev) / PostgreSQL (production via Render)

## Local Development

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API docs available at: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App available at: http://localhost:3000

## Environment Variables

### Backend (`backend/.env`)
```
TAVILY_API_KEY=your_key
OPENROUTER_API_KEY=your_key
DATABASE_URL=sqlite+aiosqlite:///./firs.db
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Deployment

- **Frontend**: GitHub Pages (auto-deploys from `main` branch via GitHub Actions)
- **Backend**: Render.com (configured via `render.yaml`)
