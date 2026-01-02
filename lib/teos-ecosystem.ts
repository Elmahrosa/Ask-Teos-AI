// TEOS Ecosystem Knowledge Base
// Complete information about TEOS Egypt's sovereign blockchain ecosystem

export const TEOS_FOUNDER = {
  name: "Ayman Seif",
  username: "ayman-seif-elmahrosa",
  role: "Founder & Lead Developer",
  organization: "TEOS Egypt",
  github: "github.com/Elmahrosa",
} as const

export const TEOS_VISION = {
  mission: "Egypt digital sovereignty through blockchain technology",
  alignment: ["UN SDG (Sustainable Development Goals)", "Egypt Vision 2030"],
  goal: "Creating a sovereign blockchain ecosystem for Egyptian digital transformation",
} as const

export const TEOS_TECH_STACK = {
  frontend: "React + TypeScript",
  backend: "Express.js",
  blockchain: "TEOS Sovereign Blockchain",
  ai: "TEOS Knowledge Base + 43 Repositories",
  search: "Tavily Deep Search",
  analytics: "PostHog",
  bridge: "Pi Network ↔ TEOS Bridge",
} as const

export const TEOS_CORE_REPOS = [
  {
    name: "El-Mahrosa.Teos-Sovereign-System",
    description: "Main TEOS sovereign blockchain system",
    category: "Core Infrastructure",
  },
  {
    name: "TeosWallet",
    description: "Official TEOS blockchain wallet",
    category: "Wallet",
  },
  {
    name: "TeosPump Launchpad",
    description: "Token launchpad platform for TEOS ecosystem",
    category: "DeFi",
  },
  {
    name: "Teos Governance",
    description: "Decentralized governance system",
    category: "Governance",
  },
  {
    name: "Pi-TEOS Bridge",
    description: "Cross-chain bridge between Pi Network and TEOS",
    category: "Bridge",
  },
  {
    name: "Digital Passport",
    description: "Blockchain-based digital identity system",
    category: "Identity",
  },
  {
    name: "Bankchain",
    description: "Decentralized banking infrastructure",
    category: "Banking",
  },
  {
    name: "PiTaxi",
    description: "Decentralized ride-sharing platform",
    category: "Transportation",
  },
  {
    name: "PiNode Tools",
    description: "Node management and monitoring tools",
    category: "Infrastructure",
  },
  {
    name: "Teos Mining Bot",
    description: "Automated mining bot for TEOS network",
    category: "Mining",
  },
  {
    name: "Teos Staking",
    description: "Staking platform for TEOS tokens",
    category: "Staking",
  },
] as const

export const TEOS_DAPPS = [
  "TeosWallet - Secure blockchain wallet",
  "TeosPump Launchpad - Token launch platform",
  "Teos Governance - DAO governance system",
  "Bankchain - Decentralized banking",
  "Digital Passport - Blockchain identity",
  "PiTaxi - Ride-sharing DApp",
  "Teos Mining - Mining operations",
  "Teos Staking - Token staking rewards",
] as const

export const TEOS_INTEGRATIONS = {
  deepSearch: {
    provider: "Tavily",
    envVar: "TAVILY_API_KEY",
    purpose: "Advanced AI-powered search",
  },
  founderAuth: {
    method: "JWT",
    envVar: "FOUNDER_JWT_SECRET",
    userId: "ayman-seif-elmahrosa",
    features: ["Unlimited chat", "Crown badge", "Admin dashboard"],
  },
  metrics: {
    endpoint: "/founder/metrics",
    data: ["GitHub stars", "forks", "issues", "contributors"],
    envVar: "GITHUB_TOKEN",
  },
  analytics: {
    provider: "PostHog",
    envVar: "POSTHOG_KEY",
    events: ["chat_query", "pi_login_attempt"],
  },
  cicd: {
    platform: "GitHub Actions",
    tests: ["npm install", "npm test"],
    trigger: "push/PR",
  },
  deployment: {
    frontend: "Vercel",
    backend: "Render.com (free tier)",
    monitoring: "UptimeRobot",
  },
  blockchain: {
    network: "TEOS Testnet",
    rpc: "TEOS_RPC",
    status: "Placeholder for future integration",
  },
} as const

export const TEOS_ALL_REPOS = {
  total: 43,
  mainRepo: "github.com/Elmahrosa/Ask-Teos-AI",
  categories: {
    core: ["El-Mahrosa.Teos-Sovereign-System", "TEOS-Core-Protocol", "TEOS-Consensus", "TEOS-Network-Node"],
    wallet: ["TeosWallet", "TeosWallet-Mobile", "TeosWallet-Extension"],
    defi: ["TeosPump-Launchpad", "TEOS-DEX", "TEOS-Liquidity-Pool", "TEOS-Swap", "TEOS-Farming"],
    governance: ["Teos-Governance", "TEOS-DAO", "TEOS-Voting", "TEOS-Proposals"],
    bridge: ["Pi-TEOS-Bridge", "TEOS-Bridge-SDK", "Bridge-Validator"],
    identity: ["Digital-Passport", "TEOS-Identity", "KYC-Verifier"],
    banking: ["Bankchain", "TEOS-Bank-API", "Payment-Gateway"],
    transportation: ["PiTaxi", "PiTaxi-Driver", "PiTaxi-Rider"],
    infrastructure: ["PiNode-Tools", "TEOS-Explorer", "TEOS-Analytics", "Network-Monitor"],
    mining: ["Teos-Mining-Bot", "Mining-Pool", "Hashrate-Optimizer"],
    staking: ["Teos-Staking", "Staking-Rewards", "Validator-Manager"],
    developer: ["TEOS-SDK", "TEOS-API", "Developer-Docs", "Smart-Contract-Templates"],
  },
} as const

export const TEOS_QUICK_INFO = `
ASK-TEOS-AI | TEOS Egypt Gateway

1. Founder: Ayman Seif
2. Stack: React + TypeScript + Express
3. AI: TEOS knowledge + 43 repos
4. Deep Search: Tavily (TAVILY_API_KEY)
5. Founder Access: JWT (FOUNDER_JWT_SECRET) crown + unlimited chat
6. Metrics API: /founder/metrics → stars, forks, issues, contributors (GITHUB_TOKEN)
7. Analytics: PostHog (POSTHOG_KEY)
8. CI/CD: GitHub Action tests on push/PR
9. Deploy: Frontend→Vercel, Backend→Render free, Uptime→UptimeRobot
10. Core TEOS Repos:
    - El-Mahrosa.Teos-Sovereign-System
    - TeosWallet
    - TeosPump Launchpad
    - Teos Governance
    - Pi↔TEOS Bridge
    - Digital Passport
    - Bankchain
    - PiTaxi
    - PiNode Tools
    - Teos Mining Bot + Staking

11. DApps Supported: Wallet, Launchpad, Governance, Bankchain, Passport, Taxi, Mining.
12. Vision: Egypt digital sovereignty + UN SDG + Vision 2030.
`

// Helper function to search TEOS ecosystem
export function searchTeosEcosystem(query: string): string[] {
  const lowerQuery = query.toLowerCase()
  const results: string[] = []

  // Search in core repos
  TEOS_CORE_REPOS.forEach((repo) => {
    if (
      repo.name.toLowerCase().includes(lowerQuery) ||
      repo.description.toLowerCase().includes(lowerQuery) ||
      repo.category.toLowerCase().includes(lowerQuery)
    ) {
      results.push(`${repo.name}: ${repo.description} (${repo.category})`)
    }
  })

  // Search in all repos categories
  Object.entries(TEOS_ALL_REPOS.categories).forEach(([category, repos]) => {
    if (category.includes(lowerQuery)) {
      results.push(`Category: ${category} - ${repos.join(", ")}`)
    } else {
      repos.forEach((repo) => {
        if (repo.toLowerCase().includes(lowerQuery)) {
          results.push(`${repo} (${category})`)
        }
      })
    }
  })

  return results
}

// Get repository by category
export function getReposByCategory(category: keyof typeof TEOS_ALL_REPOS.categories) {
  return TEOS_ALL_REPOS.categories[category]
}

// Get all DApps
export function getAllDApps() {
  return TEOS_DAPPS
}

// Get founder info
export function getFounderInfo() {
  return TEOS_FOUNDER
}
