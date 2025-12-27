#!/bin/bash
# Quick status check for quiz tests

cd "$(dirname "$0")"

LOG_FILE="test-results-full.log"

if [ ! -f "$LOG_FILE" ]; then
    echo "❌ Test log not found. Test may not be running."
    exit 1
fi

echo "=== Quiz Test Status ==="
echo ""

# Get latest progress line
LATEST=$(tail -20 "$LOG_FILE" | grep "Progress:" | tail -1)

if [ -z "$LATEST" ]; then
    echo "⏳ Test is initializing..."
    echo "Latest log entry:"
    tail -3 "$LOG_FILE"
else
    echo "$LATEST"
    echo ""
    
    # Count incorrect results
    INCORRECT=$(grep -c "INCORRECT RESULT" "$LOG_FILE" 2>/dev/null || echo "0")
    CORRECT=$(grep -c "Progress:" "$LOG_FILE" 2>/dev/null | awk '{print $1}' || echo "0")
    
    echo "Incorrect results found: $INCORRECT"
    echo ""
    echo "Latest incorrect result (if any):"
    grep "INCORRECT RESULT" "$LOG_FILE" | tail -1
fi

echo ""
echo "To see full progress: tail -f $LOG_FILE"
echo "To see all incorrect results: grep 'INCORRECT' $LOG_FILE"

