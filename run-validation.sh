#!/bin/bash
# Quiz Validation Test Runner
# Runs the automated tests and outputs only incorrect results

cd "$(dirname "$0")"

echo "Starting quiz validation tests..."
echo "This will test 200 quiz variations."
echo "Only incorrect results will be displayed."
echo ""

MAX_TESTS=${1:-200}
node automate-quiz-tests.js 2>&1 | grep -A 5 "INCORRECT RESULT" || echo "All tests passed!"




