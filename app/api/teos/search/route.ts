import { NextResponse } from "next/server"
import { searchTeosEcosystem } from "@/lib/teos-ecosystem"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  const results = searchTeosEcosystem(query)

  return NextResponse.json({
    query,
    results,
    count: results.length,
  })
}
