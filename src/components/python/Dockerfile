FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH="${POETRY_HOME}/bin:${PATH}"

WORKDIR /app
COPY src/components/python ./src/components/python
COPY src/components/python/pyproject.toml .
COPY src/components/python/poetry.lock .
COPY src/configs ./configs

RUN poetry install --no-interaction --no-ansi --only=main
ENV PYTHONPATH=/app/src

EXPOSE 8000
CMD ["poetry", "run", "uvicorn", "src.components.python.main:app", "--host", "0.0.0.0"]