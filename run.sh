#!/bin/bash

# ============================================================================
# MASTER RUN SCRIPT: AI AGENT MARKETPLACE (STABILIZED)
# ============================================================================
# Orchestrates Node.js API Gateway and all Python Agent services.
# ============================================================================

# Handle cleanup on exit
trap "exit" INT TERM
trap "kill 0" EXIT

echo "===================================================="
echo "🚀 INITIALIZING AI MARKETPLACE SERVICES"
echo "===================================================="

# 1. Kill stale processes
echo "🧹 Cleaning up existing services on ports 3000, 5002, 5003, 5004..."
lsof -ti:3000,5002,5003,5004 | xargs kill -9 > /dev/null 2>&1
sleep 1

# 2. Start Python Agents
echo "🐍 Starting Resume Intelligence (5002)..."
./.venv/bin/python3 agents/resume.py &
sleep 1

echo "🐍 Starting Product Intelligence (5003)..."
./.venv/bin/python3 agents/product.py &
sleep 1

echo "🐍 Starting Text Analysis Agent (5004)..."
./.venv/bin/python3 agents/analyze.py &
sleep 1

# 3. Start Node.js API Gateway
echo "🌐 Starting API Gateway (3000)..."
cd backend
export PATH=$PATH:/usr/local/bin
npm start &

echo "===================================================="
echo "✅ ALL SERVICES STARTED SUCCESSFULLY"
echo "===================================================="
echo "Monitoring logs... Press Ctrl+C to stop all."

# Wait for background processes
wait
