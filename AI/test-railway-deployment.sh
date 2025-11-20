#!/bin/bash

# Railway Deployment Test Script
# Tests all 13 endpoints after Railway deployment

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
RAILWAY_DOMAIN="${1:-http://localhost:8000}"
RESULTS_FILE="/tmp/railway_test_results_$(date +%s).txt"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     BLOCKEDLEARNING AI - Railway Deployment Test Suite      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Testing endpoint: $RAILWAY_DOMAIN"
echo "Results saved to: $RESULTS_FILE"
echo ""

# Initialize results file
> "$RESULTS_FILE"

# Test counter
PASSED=0
FAILED=0
TOTAL=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local path=$2
    local data=$3
    local description=$4
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "[$TOTAL] Testing $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$RAILWAY_DOMAIN$path")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$RAILWAY_DOMAIN$path" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
        echo "[$TOTAL] $description - PASS (HTTP $http_code)" >> "$RESULTS_FILE"
        echo "      Response: ${body:0:100}..." >> "$RESULTS_FILE"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
        echo "[$TOTAL] $description - FAIL (HTTP $http_code)" >> "$RESULTS_FILE"
        echo "      Response: $body" >> "$RESULTS_FILE"
        FAILED=$((FAILED + 1))
    fi
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Week 1: Learning Mentor (3 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/mentor/explain" \
    '{"question":"What is reentrancy?","user_context":{"skill_level":"beginner","topics":["smart_contracts"]}}' \
    "POST /mentor/explain"

test_endpoint "POST" "/mentor/suggest" \
    '{"user_context":{"skill_level":"intermediate","completed_topics":["wallets","transactions"]}}' \
    "POST /mentor/suggest"

test_endpoint "POST" "/mentor/profile" \
    '{"wallet":"0x123abc","user_context":{"completed_modules":[1,2,3],"skill_level":"intermediate"}}' \
    "POST /mentor/profile"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Week 2: Content Intelligence (3 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/analyze/video" \
    '{"video_url":"https://example.com/video.mp4","user_context":{"skill_level":"intermediate"}}' \
    "POST /analyze/video"

test_endpoint "POST" "/analyze/quality" \
    '{"video_url":"https://example.com/video.mp4","transcript":"Smart contracts are programs..."}' \
    "POST /analyze/quality"

test_endpoint "POST" "/generate/quiz" \
    '{"content":"Reentrancy is a vulnerability where...","difficulty":"intermediate","num_questions":3}' \
    "POST /generate/quiz"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Week 3: High Impact Features (4 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/mentor/audit-code" \
    '{"code":"contract Test { mapping(address => uint) public balance; }","language":"solidity"}' \
    "POST /mentor/audit-code"

test_endpoint "POST" "/mentor/generate-project" \
    '{"title":"Token Contract","skill_level":"intermediate","technologies":["solidity"],"hours":20}' \
    "POST /mentor/generate-project"

test_endpoint "POST" "/generate/thumbnail" \
    '{"video_title":"Solidity Basics","transcript":"Learn how to write smart contracts...","key_concept":"Functions"}' \
    "POST /generate/thumbnail"

test_endpoint "POST" "/search/semantic" \
    '{"query":"how to prevent reentrancy","difficulty":"beginner"}' \
    "POST /search/semantic"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Week 4: Engagement Features (2 endpoints)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "POST" "/recommend/next" \
    '{"user_id":"0x123","completed_videos":[1,2],"skill_level":"intermediate","interests":["security"]}' \
    "POST /recommend/next"

test_endpoint "POST" "/trends/industry" \
    '{"region":"global","industry":"blockchain","experience_level":"intermediate"}' \
    "POST /trends/industry"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Health & Utility (1 endpoint)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET" "/" "" "GET / (Health Check)"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                        TEST RESULTS                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Total tests: $TOTAL"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    echo "Your BLOCKEDLEARNING AI service is fully operational on Railway!"
    echo ""
    echo "API Documentation:"
    echo "  • Interactive API: $RAILWAY_DOMAIN/docs"
    echo "  • ReDoc: $RAILWAY_DOMAIN/redoc"
else
    echo -e "${RED}❌ SOME TESTS FAILED!${NC}"
    echo ""
    echo "Review the results file: $RESULTS_FILE"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check logs: railway logs -s ai-service"
    echo "  2. Verify environment variables are set"
    echo "  3. Ensure Redis service is running"
    echo "  4. Check GEMINI_API_KEY is configured"
fi

echo ""
echo "Detailed results saved to: $RESULTS_FILE"
cat "$RESULTS_FILE"
