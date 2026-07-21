# Base image
FROM python:3.11-slim

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# Send logs directly to stdout/stderr
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Copy dependency file first for Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Create a non-root user
RUN useradd -m appuser && \
    chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Application port
EXPOSE 8000

# Optional health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Start FastAPI
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]