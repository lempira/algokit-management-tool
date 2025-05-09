from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    dependencies,
    functional_specs,
    issues,
    outdated,
    pipelines,
    pull_requests,
    slack,
)
from app.core.config import settings

app = FastAPI(
    title="AlgoKit Dependencies API",
    description="API for managing AlgoKit dependencies, outdated packages, and GitHub issues",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    dependencies.router, prefix=settings.API_V1_STR, tags=["dependencies"]
)
app.include_router(issues.router, prefix=settings.API_V1_STR, tags=["issues"])
app.include_router(outdated.router, prefix=settings.API_V1_STR, tags=["outdated"])
app.include_router(
    functional_specs.router, prefix=settings.API_V1_STR, tags=["functional_specs"]
)
app.include_router(
    pipelines.router, prefix=settings.API_V1_STR, tags=["pipeline_status"]
)
app.include_router(
    pull_requests.router, prefix=settings.API_V1_STR, tags=["pull_requests"]
)
app.include_router(slack.router, prefix=settings.API_V1_STR, tags=["slack"])


@app.get("/")
async def root():
    return {
        "message": "AlgoKit Dependencies API",
        "docs_url": "/docs",
        "openapi_url": "/openapi.json",
    }
