import { BACKEND_CONFIG } from "./system-config"

export async function checkBackendHealth(): Promise<{
  isHealthy: boolean
  message: string
  statusCode?: number
}> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(BACKEND_CONFIG.BASE_URL, {
      method: "GET",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return {
        isHealthy: true,
        message: "Backend is operational",
        statusCode: response.status,
      }
    }

    return {
      isHealthy: false,
      message: `Backend returned status ${response.status}`,
      statusCode: response.status,
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          isHealthy: false,
          message: "Backend connection timeout - server may be down",
        }
      }
      return {
        isHealthy: false,
        message: `Backend unreachable: ${error.message}`,
      }
    }
    return {
      isHealthy: false,
      message: "Backend connection failed",
    }
  }
}
