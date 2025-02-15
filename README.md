# AI Foundation Platform

## Foundation Module
- OpenAI model integration with automatic load balancing
- Token usage tracking and rate limiting
- User authentication/authorization system
- RBAC (Role-Based Access Control) implementation
- API key management

## RAG Module
### Knowledge Storage
- Abstract storage base class supporting:
  - File upload/download
  - Presigned URL generation
  - File lifecycle management
- Implemented storage backends:
  - Local filesystem
  - S3 (TODO)
  - Azure Blob Storage (TODO)

### Async Processing Pipeline
- File preprocessing using Celery workers:
  - Chunking and segmentation
  - Vector embedding generation
  - Metadata extraction
- Distributed task queue configuration:
  - Redis as broker
  - MongoDB as result backend

## Development Setup
```bash
# Install dependencies
poetry install

# Start Celery worker
celery -A src.task worker --loglevel=info

# Start API server
uvicorn src.main:app --reload
