# Changelog

All notable changes to Ask-TEOS-AI will be documented in this file.

## [1.0.0] - 2025-01-02

### Added
- **Founder Authentication System**
  - User ID-based founder verification
  - Automatic detection from Pi Network tokens
  - Visual indicators (Crown badge, status badges)
  
- **Founder Dashboard** (`/founder`)
  - GitHub metrics integration (stars, forks, issues, contributors)
  - Feature status tracking
  - Quick actions panel
  - Real-time metrics refresh
  
- **Unlimited Messaging for Founders**
  - Bypass 10 message daily limit
  - Visual confirmation in chat interface
  - Backend integration ready
  
- **Integration Support**
  - Tavily Deep Search API integration
  - PostHog analytics tracking
  - Solana TEOS RPC support
  - GitHub API for repository metrics
  
- **CI/CD Pipeline**
  - GitHub Actions workflow
  - Multi-version Node.js testing (18.x, 20.x)
  - Automated builds on push/PR
  - Artifact uploads
  
- **Documentation**
  - Comprehensive README
  - Founder access guide
  - Integration setup guide
  - Deployment guide
  - Environment variables reference

### Changed
- Updated chat interface to show founder status
- Enhanced header with founder badge and dashboard link
- Improved error messages for rate limiting

### Technical Details
- Added `lib/founder-auth.ts` for founder utilities
- Added `hooks/use-founder-status.ts` for status detection
- Created API route `/api/founder/metrics` for GitHub data
- Implemented analytics tracking utilities
- Added Solana Web3.js dependency for blockchain integration

## [0.1.0] - Initial Release

### Added
- Pi Network authentication
- Basic chatbot interface
- Backend integration
- Message history
- Responsive design

---

## Upcoming Features

### [1.1.0] - Planned
- [ ] Tavily deep search implementation in chat
- [ ] PostHog event tracking activation
- [ ] Solana wallet integration
- [ ] TEOS blockchain queries
- [ ] Enhanced founder analytics

### [1.2.0] - Future
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Advanced chat history search
- [ ] Export chat transcripts
- [ ] Custom chatbot personalities

---

## Migration Guide

### Upgrading to 1.0.0

1. **Environment Variables**
   - Add optional integrations to `.env.local`:
     ```env
     GITHUB_TOKEN=your_token
     TAVILY_API_KEY=your_key
     POSTHOG_KEY=your_key
     TEOS_RPC=your_rpc_url
     ```

2. **Dependencies**
   - Run `npm install` to update packages
   - New dependency: `@solana/web3.js`

3. **Backend Updates** (Required for unlimited messaging)
   - Implement founder detection in rate limiter
   - Check user ID against founder list
   - Bypass limits for authorized founders

4. **Testing**
   - Test Pi Network authentication
   - Verify founder dashboard access
   - Check GitHub metrics loading
   - Confirm unlimited messaging works

---

For detailed upgrade instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
