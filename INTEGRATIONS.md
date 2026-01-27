# Integration Setup Guide

This guide covers setting up all third-party integrations for Ask-TEOS-AI.

## Table of Contents
- [GitHub API](#github-api)
- [Tavily Deep Search](#tavily-deep-search)
- [PostHog Analytics](#posthog-analytics)
- [Solana TEOS RPC](#solana-teos-rpc)

---

## GitHub API

### Purpose
Fetch repository metrics (stars, forks, issues, contributors) for the founder dashboard.

### Setup

1. **Generate Personal Access Token**
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `public_repo` (or `repo` for private repos)
   - Copy the token

2. **Add to Environment Variables**
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```

3. **Verify**
   - Visit `/founder` dashboard
   - Metrics should load without rate limit errors

### Rate Limits
- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour

### Code Location
- API Route: `app/api/founder/metrics/route.ts`
- Dashboard: `app/founder/page.tsx`

---

## Tavily Deep Search

### Purpose
AI-powered deep search for comprehensive web research and context gathering.

### Setup

1. **Get API Key**
   - Sign up at [tavily.com](https://tavily.com)
   - Navigate to API Keys section
   - Copy your API key

2. **Add to Environment Variables**
   ```env
   TAVILY_API_KEY=tvly-your-key-here
   ```

3. **Usage Example**
   ```typescript
   import { deepSearch } from '@/lib/integrations/tavily'
   
   const results = await deepSearch({
     query: "What is TEOS blockchain?",
     searchDepth: "advanced",
     maxResults: 10
   })
   ```

### Features
- Basic and advanced search depth
- Domain filtering (include/exclude)
- Customizable result count
- Relevance scoring

### Code Location
- Integration: `lib/integrations/tavily.ts`

---

## PostHog Analytics

### Purpose
Track user events, analyze behavior, and monitor application usage.

### Setup

1. **Create Account**
   - Sign up at [posthog.com](https://posthog.com)
   - Create a new project

2. **Get API Key**
   - Go to Project Settings
   - Copy the API key

3. **Add to Environment Variables**
   ```env
   POSTHOG_KEY=phc_your_key_here
   POSTHOG_HOST=https://app.posthog.com
   ```

4. **Usage Example**
   ```typescript
   import { posthog } from '@/lib/integrations/posthog'
   
   // Track chat query
   await posthog.trackChatQuery(userId, "What is TEOS?", false)
   
   // Track login attempt
   await posthog.trackPiLoginAttempt(userId, true)
   ```

### Tracked Events

| Event | Properties | Description |
|-------|------------|-------------|
| `chat_query` | query_length, is_founder | User sends a chat message |
| `pi_login_attempt` | success | User attempts Pi Network login |

### Features
- Real-time event tracking
- User session recording (optional)
- Feature flags
- A/B testing capabilities

### Code Location
- Integration: `lib/integrations/posthog.ts`

---

## Solana TEOS RPC

### Purpose
Connect to Egypt's sovereign TEOS blockchain for balance checks and transactions.

### Setup

1. **Get RPC Endpoint**
   - Contact TEOS network administrators for RPC URL
   - Or use Solana devnet for testing

2. **Add to Environment Variables**
   ```env
   TEOS_RPC=https://your-teos-rpc-endpoint.com
   # OR for development
   NEXT_PUBLIC_TEOS_RPC=https://api.devnet.solana.com
   ```

3. **Usage Example**
   ```typescript
   import { getBalance, getRecentTransactions } from '@/lib/integrations/solana'
   
   // Get account balance
   const balance = await getBalance('YourPublicKeyHere')
   
   // Get recent transactions
   const txs = await getRecentTransactions('YourPublicKeyHere', 5)
   ```

### Features
- Account balance queries
- Transaction history
- Network health checks
- Fallback to Solana devnet

### Code Location
- Integration: `lib/integrations/solana.ts`

---

## Testing Integrations

### Verify GitHub API
```bash
curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/Elmahrosa/Ask-Teos-AI
```

### Verify Tavily API
```bash
curl -X POST https://api.tavily.com/search \
  -H "Authorization: Bearer YOUR_TAVILY_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
```

### Verify PostHog
Check events in PostHog dashboard after running the app.

### Verify TEOS RPC
Visit `/founder` dashboard and check feature status.

---

## Environment Variables Summary

Create `.env.local` file in project root:

```env
# GitHub (Optional - for higher rate limits)
GITHUB_TOKEN=ghp_your_token_here

# Tavily Deep Search (Optional)
TAVILY_API_KEY=tvly-your-key-here

# PostHog Analytics (Optional)
POSTHOG_KEY=phc_your_key_here
POSTHOG_HOST=https://app.posthog.com

# Solana TEOS RPC (Optional)
TEOS_RPC=https://your-teos-rpc.com
# OR for client-side
NEXT_PUBLIC_TEOS_RPC=https://api.devnet.solana.com
```

---

## Troubleshooting

### GitHub API Rate Limits
- Add `GITHUB_TOKEN` to increase limits
- Check rate limit status: `curl -H "Authorization: Bearer TOKEN" https://api.github.com/rate_limit`

### Tavily Not Working
- Verify API key is correct
- Check you have credits available
- Review error messages in console

### PostHog Events Not Appearing
- Ensure API key is set
- Check PostHog host URL
- Wait a few minutes for events to appear

### Solana RPC Errors
- Verify RPC endpoint is accessible
- Check network connectivity
- Review Solana Web3.js version compatibility
