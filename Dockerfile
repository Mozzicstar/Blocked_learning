FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY AI/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY AI . 

RUN useradd -m -u 1000 aiuser && chown -R aiuser:aiuser /app
USER aiuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["python", "main.py"]
