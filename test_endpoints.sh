#!/bin/bash

BASE_URL="https://blockbackend-production.up.railway.app"

echo "Testing endpoints on $BASE_URL"
echo "----------------------------------------"

check_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo -n "Testing $method $endpoint ... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    if [ "$response" == "200" ] || [ "$response" == "201" ]; then
        echo "✅ OK ($response)"
    elif [ "$response" == "400" ]; then
        echo "✅ OK (400 - Validation Error, Route Exists)"
    elif [ "$response" == "404" ]; then
        echo "❌ FAILED (404 - Not Found)"
    else
        echo "⚠️  WARNING ($response)"
    fi
}

# Health & Root
check_endpoint "GET" "/health"
check_endpoint "GET" "/"

# Courses
check_endpoint "GET" "/api/courses"
check_endpoint "GET" "/api/courses/onchain"
check_endpoint "POST" "/api/courses/upload" "{}" # Expect 400

# Admin
check_endpoint "GET" "/api/admin/stats"

# Blockchain
check_endpoint "GET" "/api/blockchain/status"
check_endpoint "GET" "/api/blockchain/courses/total"
check_endpoint "GET" "/api/blockchain/certificates/total"

# Auth
check_endpoint "POST" "/api/auth/nonce" "{}" # Expect 400

# Mentor
check_endpoint "POST" "/api/mentor/explain" "{}" # Expect 400

echo "----------------------------------------"
echo "Done."
