import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import Base, engine
from app.core.limiter import limiter
from app.routers import admin, auth, patients, questions, results, screenings, scribe, surveys, users

# Create tables on startup (dev convenience; use Alembic in production)
Base.metadata.create_all(bind=engine)

logger = logging.getLogger("resilience.requests")
logging.basicConfig(level=logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO)

app = FastAPI(
    title="Resilience API",
    description="Backend API for the Resilience healthcare staff wellbeing platform",
    version="2.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://resilience.acmedian.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s -> %s (%.1fms)",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(surveys.router, prefix="/api")
app.include_router(questions.router, prefix="/api")
app.include_router(results.router, prefix="/api")
app.include_router(scribe.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(screenings.router, prefix="/api")
app.include_router(patients.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}
