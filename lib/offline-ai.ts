// Offline AI - Local TEOS knowledge base responses
// Handles chat responses when backend is unavailable

import {
  TEOS_CORE_REPOS,
  TEOS_FOUNDER,
  TEOS_VISION,
  TEOS_DAPPS,
  TEOS_INTEGRATIONS,
  searchTeosEcosystem,
  TEOS_QUICK_INFO,
  TEOS_GLOBAL_RECOGNITION,
  TEOS_CONSTITUTION,
  getGlobalRecognition,
  getCompetitivePosition,
  getConstitutionInfo,
} from "./teos-ecosystem"

export function generateOfflineResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim()

  // Greetings
  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon)/)) {
    return "Hello! I'm ASK TEOS AI, your gateway to Egypt's sovereign blockchain ecosystem. Ranked #3 globally among sovereign civic blockchains, I can help you learn about TEOS, our DApps, the International Civic Blockchain Constitution, and our vision for Egypt's digital sovereignty. What would you like to know?"
  }

  // Global ranking and recognition
  if (
    message.includes("ranking") ||
    message.includes("global") ||
    message.includes("best") ||
    message.includes("top") ||
    message.includes("recognition") ||
    message.includes("position") ||
    message.includes("consensus")
  ) {
    const recognition = getGlobalRecognition()
    return `🏆 TEOS Global Recognition - Ranked #${recognition.position} Worldwide\n\n${recognition.ranking}\n\nTEOS Egypt / Elmahrosa stands as the #3 best sovereign civic blockchain globally, recognized at Consensus Hong Kong 2026:\n\n✅ ${recognition.competitors[2].description}\n\nDistinguishing Factors:\n${recognition.competitors[2].distinguishingFactors?.map((f) => `• ${f}`).join("\n")}\n\nCompeting alongside:\n1️⃣ EU EBSI / EUDI Wallet (EU-wide government digital identity)\n2️⃣ Sovrin Network (Global self-sovereign identity pioneer)\n4️⃣ ADI Chain Abu Dhabi (UAE institutional blockchain)\n\nAchievements:\n${recognition.achievements.map((a) => `• ${a}`).join("\n")}`
  }

  // Constitution questions
  if (
    message.includes("constitution") ||
    message.includes("civic") ||
    message.includes("petition") ||
    message.includes("badge") ||
    message.includes("sign with it")
  ) {
    const constitution = getConstitutionInfo()
    return `📜 ${constitution.name}\n\nMotto: "${constitution.motto}"\n\n${constitution.description}\n\nPrinciples:\n${constitution.principles.map((p) => `• ${p}`).join("\n")}\n\nLinked Civic Ecosystem (9 projects):\n${constitution.linkedEcosystem.map((e) => `• ${e}`).join("\n")}\n\nRepository: ${constitution.repo}\n\nLicensing:\n• Community (MIT): ${constitution.licensing.community}\n• Enterprise: ${constitution.licensing.enterprise}`
  }

  // FPBE Bank questions
  if (message.includes("fpbe") || message.includes("bank") || message.includes("pimisr")) {
    return "FPBE (First Pimisr Bank Elmahrosa) is the civic-first banking backbone of TEOS. It serves as:\n\n• Operational core for treasury flows\n• Custody and validator fee management\n• Future gold deposit vault for Teos-Gold-Reserve\n• Banking infrastructure for humanitarian projects\n\nFPBE routes all civic and treasury flows with full transparency and dual verification."
  }

  // Gaza reconstruction questions
  if (message.includes("gaza") || message.includes("humanitarian") || message.includes("reconstruction")) {
    return "Digital Reconstruction of Gaza is part of TEOS's humanitarian initiative:\n\n• Badge-gated participation ensuring accountability\n• Donation custody with full transparency\n• Impact tracking and reporting\n• Dual verification for all humanitarian flows\n\nThis project demonstrates TEOS's commitment to social impact beyond financial applications."
  }

  // Founder questions
  if (message.includes("founder") || message.includes("ayman") || message.includes("who created") || message.includes("elmahrosa")) {
    return `TEOS was founded by ${TEOS_FOUNDER.name} (@${TEOS_FOUNDER.username}), Founder & Architect of Egypt's sovereign blockchain ecosystem (Elmahrosa) and recognized globally at Consensus Hong Kong 2026. TEOS ranks #3 worldwide among sovereign civic blockchain projects. The founder also created the International Civic Blockchain Constitution - a global civic-first framework. Visit ${TEOS_FOUNDER.github} for more information.`
  }

  // Vision questions
  if (message.includes("vision") || message.includes("mission") || message.includes("goal")) {
    return `TEOS Vision: ${TEOS_VISION.mission}. We are aligned with ${TEOS_VISION.alignment.join(" and ")} to achieve ${TEOS_VISION.goal}. Our mission is to empower Egypt through decentralized blockchain technology.\n\nGlobally recognized as #3 best sovereign civic blockchain in 2026, TEOS is pioneering Digital Public Infrastructure (DPI) for national resilience and constitutional-rooted blockchain governance.`
  }

  // DApps questions
  if (message.includes("dapp") || message.includes("application") || message.includes("what can")) {
    return `TEOS Ecosystem DApps:\n\n${TEOS_DAPPS.join("\n")}\n\nThese applications cover wallet, DeFi, governance, banking, identity, transportation, mining, and staking - all built for Egypt's digital future.`
  }

  // Wallet questions
  if (message.includes("wallet")) {
    const wallet = TEOS_CORE_REPOS.find((r) => r.name === "TeosWallet")
    return `TeosWallet: ${wallet?.description}. It's the official wallet for the TEOS ecosystem, providing secure storage and management of TEOS tokens and digital assets.`
  }

  // Launchpad questions
  if (message.includes("launchpad") || message.includes("pump") || message.includes("token launch")) {
    const launchpad = TEOS_CORE_REPOS.find((r) => r.name === "TeosPump Launchpad")
    return `TeosPump Launchpad: ${launchpad?.description}. This is the official token launch platform for the TEOS ecosystem, enabling fair and decentralized token distribution.`
  }

  // Bridge questions
  if (message.includes("bridge") || message.includes("pi network")) {
    const bridge = TEOS_CORE_REPOS.find((r) => r.name === "Pi-TEOS Bridge")
    return `Pi-TEOS Bridge: ${bridge?.description}. This bridge connects Pi Network with TEOS blockchain, enabling seamless cross-chain asset transfers and interoperability between both networks.`
  }

  // Governance questions
  if (message.includes("governance") || message.includes("voting") || message.includes("dao")) {
    const governance = TEOS_CORE_REPOS.find((r) => r.name === "Teos Governance")
    return `Teos Governance: ${governance?.description}. TEOS uses a decentralized autonomous organization (DAO) model where community members can propose and vote on protocol changes, ensuring democratic decision-making.`
  }

  // Banking questions
  if (message.includes("bank") || message.includes("payment") || message.includes("financial")) {
    const bankchain = TEOS_CORE_REPOS.find((r) => r.name === "Bankchain")
    return `Bankchain: ${bankchain?.description}. This is TEOS's decentralized banking infrastructure that enables peer-to-peer financial services, payments, and banking operations without traditional intermediaries.`
  }

  // Identity questions
  if (message.includes("identity") || message.includes("passport") || message.includes("kyc")) {
    const passport = TEOS_CORE_REPOS.find((r) => r.name === "Digital Passport")
    return `Digital Passport: ${passport?.description}. TEOS provides blockchain-based digital identity management, enabling secure, verifiable, and sovereign identity for Egyptian citizens and residents.`
  }

  // Mining/Staking questions
  if (message.includes("mining") || message.includes("staking") || message.includes("reward")) {
    return `TEOS supports both mining and staking:\n\n• Teos Mining Bot: Automated mining for TEOS network\n• Teos Staking: Earn rewards by staking TEOS tokens\n\nBoth mechanisms help secure the network while providing passive income opportunities for participants.`
  }

  // Repository search
  if (message.includes("repo") || message.includes("repository") || message.includes("github")) {
    const searchResults = searchTeosEcosystem(message)
    if (searchResults.length > 0) {
      return `Found ${searchResults.length} matching repositories:\n\n${searchResults.slice(0, 5).join("\n")}\n\nVisit github.com/Elmahrosa for the complete list of 43+ TEOS repositories.`
    }
    return "TEOS has 43+ repositories covering core infrastructure, DeFi, governance, identity, and more. Visit github.com/Elmahrosa/Ask-Teos-AI for the main project."
  }

  // How many repos
  if (message.includes("how many")) {
    return `The TEOS ecosystem consists of 43+ repositories organized into categories: Core Infrastructure, Wallet, DeFi, Governance, Bridge, Identity, Banking, Transportation, Infrastructure, Mining, Staking, and Developer Tools.`
  }

  // Egypt/SDG questions
  if (message.includes("egypt") || message.includes("sdg") || message.includes("2030")) {
    return `TEOS is deeply committed to Egypt's digital transformation:\n\n• Aligned with UN Sustainable Development Goals (SDGs)\n• Supporting Egypt Vision 2030\n• Building sovereign blockchain infrastructure\n• Empowering Egyptian citizens through decentralized technology\n\nOur goal is to position Egypt as a leader in blockchain innovation while maintaining digital sovereignty.`
  }

  // Technology stack
  if (message.includes("tech") || message.includes("stack") || message.includes("built")) {
    return `TEOS Tech Stack:\n\n• Frontend: React + TypeScript\n• Backend: Express.js\n• Blockchain: TEOS Sovereign Blockchain\n• AI: TEOS Knowledge Base (43+ repos)\n• Search: Tavily Deep Search\n• Analytics: PostHog\n• Bridge: Pi Network ↔ TEOS\n\nDeployed on Vercel (frontend) and Render.com (backend) with automated CI/CD via GitHub Actions.`
  }

  // System explanation
  if (message.includes("offline") || message.includes("demo") || message.includes("503") || message.includes("how do you work")) {
    return "ASK TEOS AI runs on a comprehensive local knowledge base covering all 43+ TEOS repositories, the International Civic Blockchain Constitution, DApps, founder information, and Egypt's digital sovereignty vision. I provide instant responses about the entire TEOS ecosystem, global recognition (#3 worldwide), and technical architecture."
  }

  // General ecosystem questions
  if (
    message.includes("what is teos") ||
    message.includes("tell me about teos") ||
    message.includes("teos ecosystem")
  ) {
    return TEOS_QUICK_INFO
  }

  // Search attempt
  const searchResults = searchTeosEcosystem(message)
  if (searchResults.length > 0) {
    return `I found information related to your query:\n\n${searchResults.slice(0, 3).join("\n")}\n\nWould you like to know more about any specific component?`
  }

  // Default response
  return "I'm ASK TEOS AI, Egypt's sovereign blockchain assistant. I can help you with:\n\n• TEOS ecosystem overview (43+ repositories)\n• International Civic Blockchain Constitution\n• DApps: Wallet, Launchpad, Governance, Bankchain, Digital Passport\n• Founder & global recognition (#3 worldwide)\n• Egypt Vision 2030 & UN SDG alignment\n• Technical stack & architecture\n• FPBE Bank, Gaza Reconstruction, humanitarian projects\n\nWhat would you like to know?"
}
