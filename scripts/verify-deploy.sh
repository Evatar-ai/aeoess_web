#!/bin/bash
# AEOESS Deployment Verification Script
# Run after ANY push to production repos
# Usage: ./verify-deploy.sh [service]
# Services: all, mcp, gateway, sdk

set -e
PASS=0
FAIL=0

check() {
  local name="$1"
  local result="$2"
  local expected="$3"
  if echo "$result" | grep -q "$expected"; then
    echo "  ✅ $name"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $name — got: $result"
    FAIL=$((FAIL + 1))
  fi
}

SERVICE="${1:-all}"

echo "═══════════════════════════════════════"
echo "  AEOESS Deploy Verification"
echo "  $(date)"
echo "═══════════════════════════════════════"

if [[ "$SERVICE" == "all" || "$SERVICE" == "mcp" ]]; then
  echo ""
  echo "── MCP Remote (mcp.aeoess.com) ──"
  
  # Health check
  HEALTH=$(curl -s -m 10 https://mcp.aeoess.com/health 2>&1)
  check "Health endpoint responds" "$HEALTH" "status.*ok"
  
  # Version check
  check "Version is current" "$HEALTH" "2.19.1"
  
  # SSE connects and gets endpoint
  SSE=$(curl -s -m 6 https://mcp.aeoess.com/sse 2>&1 || true)
  check "SSE returns endpoint event" "$SSE" "endpoint"
  
  # Check session was created
  HEALTH2=$(curl -s -m 10 https://mcp.aeoess.com/health 2>&1)
  SESSIONS=$(echo "$HEALTH2" | python3 -c "import json,sys; print(json.load(sys.stdin).get('sessions',0))" 2>/dev/null || echo "0")
  if [[ "$SESSIONS" -gt 0 ]]; then
    echo "  ✅ Session created (sessions: $SESSIONS)"
    PASS=$((PASS + 1))
  else
    echo "  ❌ No sessions created (sessions: $SESSIONS)"
    FAIL=$((FAIL + 1))
  fi
fi

if [[ "$SERVICE" == "all" || "$SERVICE" == "gateway" ]]; then
  echo ""
  echo "── Gateway (gateway.aeoess.com) ──"
  
  GW_HEALTH=$(curl -s -m 10 https://gateway.aeoess.com/healthz 2>&1)
  check "Health endpoint responds" "$GW_HEALTH" "status.*ok"
  check "Version is current" "$GW_HEALTH" "0.3.2"
  
  # JWKS endpoint
  JWKS=$(curl -s -m 10 https://gateway.aeoess.com/.well-known/jwks.json 2>&1)
  check "JWKS endpoint responds" "$JWKS" "Ed25519"
  
  # Receipt resolution
  RECEIPT=$(curl -s -m 10 https://gateway.aeoess.com/.well-known/receipts/test 2>&1)
  check "Receipt resolution responds" "$RECEIPT" "proofId"
fi

if [[ "$SERVICE" == "all" || "$SERVICE" == "sdk" ]]; then
  echo ""
  echo "── npm Packages ──"
  
  SDK_VER=$(curl -s https://registry.npmjs.org/agent-passport-system/latest | python3 -c "import json,sys; print(json.load(sys.stdin)['version'])" 2>/dev/null)
  check "SDK on npm" "$SDK_VER" "1.29"
  
  MCP_VER=$(curl -s https://registry.npmjs.org/agent-passport-system-mcp/latest | python3 -c "import json,sys; print(json.load(sys.stdin)['version'])" 2>/dev/null)
  check "MCP on npm" "$MCP_VER" "2.19"
  
  echo ""
  echo "── Website (aeoess.com) ──"
  
  WEB=$(curl -s -o /dev/null -w "%{http_code}" -m 10 https://aeoess.com 2>&1)
  check "Website responds" "$WEB" "200"
fi

if [[ "$SERVICE" == "all" ]]; then
  echo ""
  echo "── Intent Network (api.aeoess.com — Mac Mini) ──"
  
  API=$(curl -s -m 10 https://api.aeoess.com/health 2>&1)
  if echo "$API" | grep -q "ok\|status"; then
    check "Intent API responds" "$API" "ok"
  else
    echo "  ⚠️  Intent API unreachable (Mac Mini may be off)"
  fi
fi

echo ""
echo "═══════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
if [[ $FAIL -gt 0 ]]; then
  echo "  ⚠️  DEPLOYMENT HAS ISSUES"
  exit 1
else
  echo "  ✅ ALL CHECKS PASSED"
  exit 0
fi
