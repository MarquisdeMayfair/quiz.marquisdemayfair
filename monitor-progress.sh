#!/bin/bash
# Real-time progress monitor for quiz tests

LOG_FILE="test-results-full.log"

if [ ! -f "$LOG_FILE" ]; then
    echo "Waiting for log file to be created..."
    while [ ! -f "$LOG_FILE" ]; do
        sleep 1
    done
fi

echo "Monitoring test progress (Ctrl+C to stop)..."
echo ""

tail -f "$LOG_FILE" | grep --line-buffered -E "(Progress:|INCORRECT|Final Test|Correct|Incorrect)" | while IFS= read -r line; do
    echo "$line"
done



