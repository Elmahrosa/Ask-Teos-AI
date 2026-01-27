import { NextResponse } from "next/server"
import {
  TEOS_FOUNDER,
  TEOS_VISION,
  TEOS_CORE_REPOS,
  TEOS_ALL_REPOS,
  TEOS_DAPPS,
  TEOS_TECH_STACK,
  TEOS_QUICK_INFO,
} from "@/lib/teos-ecosystem"

export async function GET() {
  return NextResponse.json({
    founder: TEOS_FOUNDER,
    vision: TEOS_VISION,
    techStack: TEOS_TECH_STACK,
    coreRepos: TEOS_CORE_REPOS,
    allRepos: TEOS_ALL_REPOS,
    dapps: TEOS_DAPPS,
    quickInfo: TEOS_QUICK_INFO,
  })
}
