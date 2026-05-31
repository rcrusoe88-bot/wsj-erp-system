#!/bin/bash
# Materia ERP Linux/macOS Deployment Script
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/04-backend"
FRONTEND_DIR="$PROJECT_ROOT/05-frontend"

build() {
  echo "=== Building backend ==="
  cd "$BACKEND_DIR"
  npm install
  npx prisma generate
  npm run build

  echo "=== Building frontend ==="
  cd "$FRONTEND_DIR"
  npm install
  npx umi build

  echo "Build complete."
}

start() {
  echo "=== Starting Materia ERP ==="

  cd "$BACKEND_DIR"
  npx prisma migrate deploy
  nohup node dist/main > /tmp/materia-backend.log 2>&1 &
  echo "Backend PID: $!"

  cd "$FRONTEND_DIR"
  nohup npx serve dist -l 8080 --single > /tmp/materia-frontend.log 2>&1 &
  echo "Frontend PID: $!"

  echo "Frontend: http://localhost:8080"
  echo "Backend:  http://localhost:3000"
}

stop() {
  echo "Stopping Materia ERP..."
  pkill -f "node dist/main" 2>/dev/null || true
  pkill -f "serve dist" 2>/dev/null || true
  echo "Stopped."
}

case "${1:-start}" in
  build) build ;;
  start) start ;;
  stop) stop ;;
  restart) stop; sleep 2; start ;;
  *) echo "Usage: $0 {build|start|stop|restart}" ;;
esac
