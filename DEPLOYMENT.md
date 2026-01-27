# Deployment Guide

## Frontend Deployment (Vercel)

### Automatic Deployment via GitHub

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import `github.com/Elmahrosa/Ask-Teos-AI`

2. **Configure Environment Variables**
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   TAVILY_API_KEY=your_tavily_api_key
   POSTHOG_KEY=your_posthog_api_key
   TEOS_RPC=your_solana_rpc_endpoint
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main branch

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Backend Deployment

Currently hosted at Pi App Engine:
```
https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com
```

### Alternative: Render.com

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository (backend)
   - Select "Web Service"

2. **Configure**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

3. **Auto-Deploy**
   - Enable "Auto-Deploy" for main branch
   - Render will rebuild on every push

## Monitoring Setup

### UptimeRobot

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add new monitor:
   - Type: HTTP(s)
   - URL: Your production URL
   - Interval: 5 minutes

### PostHog Analytics

1. Sign up at [posthog.com](https://posthog.com)
2. Get API key from Project Settings
3. Add `POSTHOG_KEY` to environment variables

## CI/CD Pipeline

GitHub Actions automatically runs on:
- Push to main/develop
- Pull requests

Pipeline includes:
- Dependency installation
- Linting
- Build verification
- Test execution (if configured)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Optional | Increases GitHub API rate limit |
| `TAVILY_API_KEY` | Optional | Enables deep search |
| `POSTHOG_KEY` | Optional | Enables analytics |
| `TEOS_RPC` | Optional | Solana RPC endpoint |
| `FOUNDER_JWT_SECRET` | Backend | JWT verification secret |

## Post-Deployment Checklist

- [ ] Test Pi Network authentication
- [ ] Verify founder dashboard access
- [ ] Check GitHub metrics API
- [ ] Test chat functionality
- [ ] Verify environment variables
- [ ] Set up monitoring alerts
- [ ] Enable analytics tracking

## Troubleshooting

### Build Fails
- Check Node.js version (18.x or 20.x required)
- Verify all dependencies in package.json
- Check environment variables

### API Errors
- Verify backend URL in `lib/system-config.ts`
- Check Pi Network authentication
- Verify API keys are set correctly

### GitHub Metrics Not Loading
- Add `GITHUB_TOKEN` for higher rate limits
- Check repository name and owner in API route
```

```typescript file="" isHidden
