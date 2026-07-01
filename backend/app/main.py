from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routers import admin, auth, questions, results, scribe, surveys, users

# Create tables on startup (dev convenience; use Alembic in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Resilience API",
    description="Backend API for the Resilience healthcare staff wellbeing platform",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://resilience.acmedian.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(surveys.router, prefix="/api")
app.include_router(questions.router, prefix="/api")
app.include_router(results.router, prefix="/api")
app.include_router(scribe.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}
