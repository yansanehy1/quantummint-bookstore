FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Azure Speech SDK
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libasound2 \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables for production
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

# Run FastAPI with uvicorn
CMD ["uvicorn", "fastapi_server:app", "--host", "0.0.0.0", "--port", "8000"]
