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

export const TEOS_GLOBAL_RECOGNITION = {
  ranking: "Top 5 Best Sovereign Civic Blockchain Projects in 2026",
  position: 3,
  competitors: [
    {
      rank: 1,
      name: "European EBSI / EUDI Wallet",
      description: "Benchmark for government-backed digital identity with EU-wide adoption and strong legal harmonization",
      region: "European Union",
    },
    {
      rank: 2,
      name: "Sovrin Network",
      description: "Long-standing pioneer of self-sovereign identity with privacy-first architecture and principled governance",
      region: "Global",
    },
    {
      rank: 3,
      name: "TEOS Egypt / Elmahrosa",
      description: "Sovereign-first civic blockchain born in Egypt, aligned with constitutional governance, sustainable development goals, and real institutional enforcement",
      region: "Egypt",
      flag: "🇪🇬💙",
      distinguishingFactors: [
        "Constitution-rooted blockchain ecosystem",
        "First sovereign blockchain in MENA region",
        "Aligned with Egyptian Vision 2030",
        "Real institutional enforcement capabilities",
        "Independent development ahead of regional initiatives",
      ],
    },
    {
      rank: 4,
      name: "ADI Chain (Abu Dhabi)",
      description: "High-performance institutional blockchain with strong state backing and enterprise focus",
      region: "UAE",
    },
  ],
  achievements: [
    "Recognized globally as a leading sovereign civic blockchain",
    "Standing independently alongside EU and global pioneers",
    "First constitutional-rooted blockchain in MENA",
    "Featured at Consensus Hong Kong 2026",
    "Pioneering Digital Public Infrastructure (DPI) for national resilience",
  ],
  consensus2026: {
    event: "Consensus Hong Kong 2026",
    theme: "The future of blockchain meets real-world sovereignty",
    presentation: "TEOS — The Sovereign Stack: Digital Public Infrastructure for National Resilience",
  },
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

export const TEOS_CONSTITUTION = {
  name: "International Civic Blockchain Constitution",
  repo: "github.com/Elmahrosa/International-Civic-Blockchain-Constitution",
  motto: "Sign With It",
  description: "Global civic-first blockchain constitution anchored by Elmahrosa as coordinating authority",
  principles: [
    "Petition-first onboarding",
    "Badge enforcement (Citizen, Validator, Founder tiers)",
    "Transparent vault registry",
    "Legal safety templates for each nation",
    "Ritual logging of every update",
  ],
  structure: {
    charter: "Founding document",
    invitationManifesto: "Global call for nations",
    chapterResurrection: "Ritual log of onboarding and updates",
    vaultRegistry: "Treasury registry with dual verification",
    governance: "Roles, petitions, badges, treasury rules",
    compliance: "Templates and country profiles",
    onboarding: "Flows and scripts for petition-first activation",
    audits: "Transparency and certification logs",
  },
  linkedEcosystem: [
    "Teos-Civic-Mixer: Petition-first civic flows",
    "FPBE-First-Pimisr-Bank-Elmahrosa: Civic-first banking backbone",
    "Digital-Reconstruction-of-Gaza: Humanitarian reconstruction",
    "ERT-LAUNCH: Founder token injection",
    "ElMahrosa-Pi-Smart-City: Pi SDK urban governance",
    "Teos-Gold-Reserve: Gold-backed stability",
    "TEOS-AI-Auditor: Transparency enforcement",
    "TEOS-NFT-AI-Generator: NFT minting, royalties, staking",
    "salma-unity-care-hospital: Social impact and healthcare",
  ],
  roadmap: {
    phase1: "Civic Mixer - Petition-first flows and badge-gated onboarding",
    phase2: "FPBE Bank Backbone - Route all flows through FPBE",
    phase3: "Gaza Reconstruction - Humanitarian pipelines",
    phase4: "ERT Launch - Founder injection and TEOS+ERT activation",
    phase5: "Pi Smart City - Governance via Pi SDK",
    phase6: "AI Auditor - Automated transparency enforcement",
    phase7: "NFT Generator - Minting, royalties, and staking",
    phase8: "Salma Hospital - Healthcare impact rails",
    phase9: "Teos-Gold-Reserve - Convert liquidity to real gold (final step)",
  },
  licensing: {
    community: "MIT - Free for civic contributors, students, humanitarian partners",
    enterprise: "Required for governments, NGOs, institutions needing compliance and custody guarantees",
  },
} as const

export const TEOS_ALL_REPOS = {
  total: 43,
  mainRepo: "github.com/Elmahrosa/Ask-Teos-AI",
  constitutionRepo: "github.com/Elmahrosa/International-Civic-Blockchain-Constitution",
  categories: {
    core: ["El-Mahrosa.Teos-Sovereign-System", "TEOS-Core-Protocol", "TEOS-Consensus", "TEOS-Network-Node"],
    wallet: ["TeosWallet", "TeosWallet-Mobile", "TeosWallet-Extension"],
    defi: ["TeosPump-Launchpad", "TEOS-DEX", "TEOS-Liquidity-Pool", "TEOS-Swap", "TEOS-Farming"],
    governance: ["Teos-Governance", "TEOS-DAO", "TEOS-Voting", "TEOS-Proposals"],
    bridge: ["Pi-TEOS-Bridge", "TEOS-Bridge-SDK", "Bridge-Validator"],
    identity: ["Digital-Passport", "TEOS-Identity", "KYC-Verifier"],
    banking: ["Bankchain", "TEOS-Bank-API", "Payment-Gateway", "FPBE-First-Pimisr-Bank-Elmahrosa"],
    transportation: ["PiTaxi", "PiTaxi-Driver", "PiTaxi-Rider"],
    infrastructure: ["PiNode-Tools", "TEOS-Explorer", "TEOS-Analytics", "Network-Monitor"],
    mining: ["Teos-Mining-Bot", "Mining-Pool", "Hashrate-Optimizer"],
    staking: ["Teos-Staking", "Staking-Rewards", "Validator-Manager"],
    developer: ["TEOS-SDK", "TEOS-API", "Developer-Docs", "Smart-Contract-Templates"],
    civic: ["Teos-Civic-Mixer", "International-Civic-Blockchain-Constitution"],
    humanitarian: ["Digital-Reconstruction-of-Gaza", "salma-unity-care-hospital"],
    assets: ["Teos-Gold-Reserve", "ERT-LAUNCH"],
    ai: ["TEOS-AI-Auditor", "TEOS-NFT-AI-Generator"],
    smartCity: ["ElMahrosa-Pi-Smart-City"],
  },
} as const

export const TEOS_QUICK_INFO = `
ASK-TEOS-AI | TEOS Egypt Gateway

🏆 RANKED #3 GLOBALLY - Best Sovereign Civic Blockchain Projects 2026

1. Founder: Ayman Seif (Founder & Architect) - Elmahrosa
2. Recognition: Top 5 Global Sovereign Blockchain (Consensus Hong Kong 2026)
3. Constitution: International Civic Blockchain Constitution - "Sign With It"
4. Stack: React + TypeScript + Express
5. AI: TEOS knowledge + 43+ repos
6. Deep Search: Tavily (TAVILY_API_KEY)
7. Founder Access: JWT (FOUNDER_JWT_SECRET) crown + unlimited chat
8. Metrics API: /founder/metrics → stars, forks, issues, contributors (GITHUB_TOKEN)
9. Analytics: PostHog (POSTHOG_KEY)
10. CI/CD: GitHub Action tests on push/PR
11. Deploy: Frontend→Vercel, Backend→Render free, Uptime→UptimeRobot
12. Linked Civic Ecosystem:
    - International Civic Blockchain Constitution
    - FPBE Bank (First Pimisr Bank Elmahrosa)
    - Teos-Civic-Mixer
    - Digital Reconstruction of Gaza
    - Teos-Gold-Reserve
    - TEOS-AI-Auditor
    - TEOS-NFT-AI-Generator
    - ElMahrosa Pi Smart City
    - Salma Unity Care Hospital

13. Core TEOS Repos: Sovereign System, Wallet, Launchpad, Governance, Pi Bridge, Digital Passport, Bankchain, PiTaxi, Mining, Staking.
14. DApps Supported: Wallet, Launchpad, Governance, Bankchain, Passport, Taxi, Mining, NFT Generator.
15. Vision: Egypt digital sovereignty + UN SDG + Vision 2030 + Civic-First Constitution.
16. Global Standing: #3 worldwide, ahead of regional initiatives, alongside EU EBSI and Sovrin Network.
17. Motto: "Sign With It" - Petition-first onboarding, badge enforcement, transparent vault registry.
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

// Get global recognition and ranking
export function getGlobalRecognition() {
  return TEOS_GLOBAL_RECOGNITION
}

// Get TEOS competitive position
export function getCompetitivePosition() {
  const { rank, name, description, distinguishingFactors } = TEOS_GLOBAL_RECOGNITION.competitors.find(c => c.rank === 3)!
  return {
    rank,
    name,
    description,
    distinguishingFactors,
    competitors: TEOS_GLOBAL_RECOGNITION.competitors.filter(c => c.rank !== 3),
  }
}

// Get constitution information
export function getConstitutionInfo() {
  return TEOS_CONSTITUTION
}
