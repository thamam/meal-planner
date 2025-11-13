#!/bin/bash

# 🍱 Kids' Meal Planner - Launch Script
# Quick start script to launch the app in your browser

PORT=8000
URL="http://localhost:$PORT"

echo "🍱 Starting Kids' Meal Planner..."
echo "📡 Server will run on: $URL"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Try to open the browser
sleep 2 && open "$URL" &

# Start the Python HTTP server
python3 -m http.server $PORT
