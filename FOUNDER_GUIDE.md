# Founder Access Guide

## Overview

The founder dashboard provides unlimited messaging access and comprehensive project metrics for authorized founders.

## Founder Authentication

### How It Works

1. **User ID Detection**: When you log in with Pi Network, the system extracts your user ID from the Pi access token
2. **Founder Verification**: Your user ID is checked against the authorized founder list
3. **Unlimited Access**: Founders bypass the 10 message daily limit automatically

### Authorized Founders

Currently authorized user IDs:
- `ayman-seif-elmahrosa`

### Adding More Founders

To add additional founders, edit `lib/founder-auth.ts`:

```typescript
export const FOUNDER_CONFIG = {
  FOUNDER_USER_ID: "ayman-seif-elmahrosa",
  FOUNDER_IDS: [
    "ayman-seif-elmahrosa",
    "new-founder-id-here"  // Add new founder IDs here
  ] as const,
}
```

## Features

### 1. Unlimited Messaging
- No daily message limit
- Visible "Unlimited Messages Available" badge in chat
- Crown badge showing founder status

### 2. Founder Dashboard (`/founder`)
Access comprehensive metrics and controls:

#### GitHub Metrics
- Stars count
- Forks count
- Open issues
- Contributors
- Watchers
- Open pull requests

#### Feature Status
Track which integrations are active:
- Founder Authentication ✅
- Unlimited Messaging ✅
- GitHub Metrics API ✅
- Tavily Deep Search ⏳
- PostHog Analytics ⏳
- Solana RPC Integration ⏳

#### Quick Actions
- View Repository
- Refresh Metrics
- Test Chatbot

### 3. Visual Indicators
- Crown badge in chat header
- "Founder" badge showing status
- "Unlimited Messages Available" footer badge
- Dashboard access button

## Accessing the Dashboard

1. **Authenticate**: Log in with Pi Network using founder credentials
2. **Navigate**: Click "Access Dashboard" button in chat header OR visit `/founder`
3. **Explore**: View metrics and manage application

## Backend Configuration

### Required Setup (Backend)

The backend must verify founder status to bypass rate limits. Add this logic:

```typescript
// Example backend middleware
function isFounder(userId: string): boolean {
  const founderIds = ["ayman-seif-elmahrosa"]
  return founderIds.includes(userId)
}

// In your rate limit middleware
if (isFounder(userId)) {
  // Skip rate limiting for founders
  return next()
}
```

### Environment Variables (Backend)

```env
FOUNDER_JWT_SECRET=your_secret_key_here
```

## Troubleshooting

### "Access Denied" Message
- Verify your Pi Network user ID matches the authorized list
- Check that you're logged in with the correct account
- Review `lib/founder-auth.ts` configuration

### Still Getting Rate Limited
- Backend may not be checking founder status
- Verify backend has founder bypass logic
- Check that user ID is being passed correctly

### Dashboard Not Loading
- Ensure you're authenticated with Pi Network
- Check browser console for errors
- Verify you have founder status (Crown badge visible)

## Security Notes

1. **User ID Verification**: The system extracts user IDs from Pi access tokens
2. **Backend Enforcement**: Rate limit bypass must be enforced on backend
3. **Frontend Indicators**: UI badges are for convenience only, not security

## API Endpoints

### GET /api/founder/metrics
Returns GitHub repository metrics:

```json
{
  "stars": 42,
  "forks": 7,
  "issues": 3,
  "contributors": 5,
  "watchers": 15,
  "openPullRequests": 2
}
```

**Authentication**: Accessible to all authenticated users (public metrics)

## Next Steps

1. Configure backend to recognize founder status
2. Add more founder user IDs if needed
3. Set up GitHub token for higher API rate limits
4. Enable additional integrations (Tavily, PostHog, Solana)
