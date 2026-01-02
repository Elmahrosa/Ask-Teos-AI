# ASK TEOS AI - Egypt's Sovereign Blockchain Gateway

ASK-TEOS-AI is your gateway to Egypt's sovereign blockchain, built on Solana with TypeScript.

## Features

- **Pi Network Integration**: Secure authentication via Pi Network SDK
- **AI-Powered Chat**: Intelligent chatbot for blockchain queries
- **Founder Dashboard**: Unlimited access and GitHub metrics for founders
- **Production Ready**: CI/CD pipeline with GitHub Actions
- **Analytics Ready**: PostHog integration support
- **Deep Search**: Tavily API integration for comprehensive search

## Project Structure

```
ask-teos-ai/
├── app/
│   ├── founder/          # Founder dashboard
│   ├── api/              # API routes
│   └── page.tsx          # Main chat interface
├── hooks/
│   ├── use-chatbot.ts    # Chat logic
│   ├── use-founder-status.ts  # Founder authentication
│   └── use-pi-network-authentication.ts
├── lib/
│   ├── founder-auth.ts   # Founder utilities
│   └── system-config.ts  # System configuration
└── .github/workflows/    # CI/CD pipeline
```

## Environment Variables

### Required for Production

```env
# Pi Network (Already configured)
NEXT_PUBLIC_PI_NETWORK_SANDBOX=false

# GitHub Metrics (Optional - increases rate limit)
GITHUB_TOKEN=your_github_token

# Future Integrations
TAVILY_API_KEY=your_tavily_key        # For deep search
POSTHOG_KEY=your_posthog_key          # For analytics
TEOS_RPC=your_solana_rpc_url          # For Solana testnet
FOUNDER_JWT_SECRET=your_jwt_secret     # For founder auth
```

## Founder Access

Founders have unlimited messaging and access to:
- GitHub repository metrics (stars, forks, issues, contributors)
- Feature status dashboard
- Quick actions panel

### Accessing Founder Dashboard

Visit `/founder` after authenticating with Pi Network. Only user ID `ayman-seif-elmahrosa` has access.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically on push to main

### Backend
Currently hosted at: `https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com`

## CI/CD

GitHub Actions workflow runs on:
- Push to main/develop branches
- Pull requests
- Tests Node.js 18.x and 20.x

## Repository

GitHub: [github.com/Elmahrosa/Ask-Teos-AI](https://github.com/Elmahrosa/Ask-Teos-AI)

## Roadmap

- [x] Pi Network authentication
- [x] Founder dashboard
- [x] GitHub metrics API
- [x] CI/CD pipeline
- [ ] Tavily deep search integration
- [ ] PostHog analytics
- [ ] Solana RPC integration
- [ ] UptimeRobot monitoring

## License

MIT License - See LICENSE file for details
