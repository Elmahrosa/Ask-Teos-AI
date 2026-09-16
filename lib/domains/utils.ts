/**
 * Utility functions for domain filtering
 */

/**
 * Check if a URL matches any of the allowed domains
 * @param url The URL to check
 * @param allowedDomains List of allowed domains (empty array means no restriction)
 * @returns true if URL matches allowed domains or if no restriction is specified
 */
export function isAllowedDomain(url: string, allowedDomains: string[]): boolean {
  // If no domains specified, allow all
  if (!allowedDomains || allowedDomains.length === 0) {
    return true;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if hostname matches any allowed domain (including subdomains)
    return allowedDomains.some(domain => {
      const lowerDomain = domain.toLowerCase();
      return hostname === lowerDomain || hostname.endsWith('.' + lowerDomain);
    });
  } catch (error) {
    // If URL is invalid, don't allow it when restriction is active
    return !allowedDomains || allowedDomains.length === 0;
  }
}

/**
 * Default TEOS domains for restriction
 */
export const TEOS_ALLOWED_DOMAINS = [
  'teosegypt.com',
  'elmahrosa.org',
  'github.com/Elmahrosa'
] as const;

export type TEOSAllowedDomain = typeof TEOS_ALLOWED_DOMAINS[number];
