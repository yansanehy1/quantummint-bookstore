#!/bin/bash
echo "=== QuantumMint Health Check ==="
echo "Time: $(date)"
echo ""

echo "🐳 Docker Containers:"
docker compose ps
echo ""

echo "💾 Disk Usage:"
df -h / | tail -1
echo ""

echo "🧠 Memory Usage:"
free -h | grep Mem
echo ""

echo "🔥 PostgreSQL Connections:"
docker exec quantummint-postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "SELECT count(*) FROM pg_stat_activity;"
echo ""

echo "🚨 Backend Error Logs (last 10 lines):"
docker compose logs backend --tail=10
