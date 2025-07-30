#!/bin/bash
set -e

echo "🚀 Starting Ollama LLM Service..."

# Start Ollama in background
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to initialize
echo "⏳ Waiting for Ollama to initialize..."
sleep 15

# Pull the model
echo "📥 Pulling phi model..."
ollama pull phi

echo "✅ Ollama LLM Service is ready!"

# Wait for the background process
wait $OLLAMA_PID