from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv

from src.components.python.common.consul import register_to_consul


def app() -> FastAPI:
    load_dotenv()
    app = FastAPI()
    app.add_api_route("/health", lambda: "I am fine")

    # app.include_router(api_router, prefix="/api")

    register_to_consul("component-python", 8000)

    return app


if __name__ == "__main__":
    app()
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST", "0.0.0.0"),
        port=int(os.getenv("APP_PORT", 8000)),
        reload=True,
    )
