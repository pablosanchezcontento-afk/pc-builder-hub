// lib/validateSource.ts

import { 
  extractDomain, 
  isDomainAllowed, 
  getAllowedTypes,
  type SourceType 
} from "./allowlist.config";

export interface ValidationResult {
  valid: boolean;
  domain?: string;
  allowedTypes?: SourceType[];
  reason?: string;
}

/**
 * Validate if a URL is from an approved official source
 * 
 * @param url - The URL to validate
 * @param expectedType - Optional: check if domain supports this source type
 * @returns ValidationResult with details
 * 
 * @example
 * validateSource("https://ark.intel.com/content/www/us/en/ark/products/...")
 * // → { valid: true, domain: "intel.com", allowedTypes: ["cpu_specs"] }
 * 
 * validateSource("https://pcpartpicker.com/...")
 * // → { valid: false, reason: "Domain not in allowlist" }
 */
export function validateSource(
  url: string,
  expectedType?: SourceType
): ValidationResult {
  // Step 1: Extract domain
  let domain: string;
  try {
    domain = extractDomain(url);
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : "Invalid URL format",
    };
  }

  // Step 2: Check if domain is allowed
  if (!isDomainAllowed(domain)) {
    return {
      valid: false,
      reason: `Domain "${domain}" is not in the allowlist. Only official manufacturer and approved retailer sources are permitted.`,
    };
  }

  // Step 3: Get allowed types for this domain
  const allowedTypes = getAllowedTypes(domain);

  // Step 4: If expectedType is specified, verify it's supported
  if (expectedType && !allowedTypes.includes(expectedType)) {
    return {
      valid: false,
      reason: `Domain "${domain}" does not support source type "${expectedType}". Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // Step 5: Valid source
  return {
    valid: true,
    domain,
    allowedTypes,
  };
}

/**
 * Validate multiple sources at once
 * Useful for batch validation of component sources
 */
export function validateSources(
  urls: string[],
  expectedType?: SourceType
): { url: string; result: ValidationResult }[] {
  return urls.map((url) => ({
    url,
    result: validateSource(url, expectedType),
  }));
}

/**
 * Strict validation: throws error if URL is invalid
 * Use this when you want to fail fast during data import
 */
export function validateSourceStrict(
  url: string,
  expectedType?: SourceType
): void {
  const result = validateSource(url, expectedType);
  if (!result.valid) {
    throw new Error(`Source validation failed: ${result.reason}`);
  }
}
