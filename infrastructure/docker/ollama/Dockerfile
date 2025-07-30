# Ollama LLM Service Dockerfile
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV OLLAMA_HOST=0.0.0.0
ENV OLLAMA_ORIGINS=*

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Create app directory
WORKDIR /app

# Copy startup script
COPY start-ollama.sh /app/start-ollama.sh

# Set executable permissions
RUN chmod +x /app/start-ollama.sh

# Expose Ollama port
EXPOSE 11434

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:11434/api/tags || exit 1

# Start Ollama service
CMD ["/app/start-ollama.sh"]
