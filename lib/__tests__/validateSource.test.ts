// lib/__tests__/validateSource.test.ts

import { describe, expect, test } from "@jest/globals";
import { validateSource, validateSources, validateSourceStrict } from "../validateSource";

describe("validateSource", () => {
  // Valid sources
  test("accepts Intel ARK URL", () => {
    const result = validateSource(
      "https://ark.intel.com/content/www/us/en/ark/products/230496/intel-core-i9-14900k-processor.html"
    );
    expect(result.valid).toBe(true);
    expect(result.domain).toBe("intel.com");
    expect(result.allowedTypes).toContain("cpu_specs");
  });

  test("accepts AMD CPU specs URL", () => {
    const result = validateSource(
      "https://www.amd.com/en/products/cpu/amd-ryzen-9-7950x"
    );
    expect(result.valid).toBe(true);
    expect(result.domain).toBe("amd.com");
  });

  test("accepts NVIDIA GPU specs URL", () => {
    const result = validateSource(
      "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/"
    );
    expect(result.valid).toBe(true);
    expect(result.domain).toBe("nvidia.com");
  });

  test("accepts PcComponentes price URL", () => {
    const result = validateSource(
      "https://www.pccomponentes.com/intel-core-i9-14900k"
    );
    expect(result.valid).toBe(true);
    expect(result.domain).toBe("pccomponentes.com");
  });

  // Invalid sources (forbidden sites)
  test("rejects PCPartPicker URL", () => {
    const result = validateSource(
      "https://pcpartpicker.com/product/abc123"
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("not in the allowlist");
  });

  test("rejects TechPowerUp URL", () => {
    const result = validateSource(
      "https://www.techpowerup.com/cpu-specs/core-i9-14900k.c3067"
    );
    expect(result.valid).toBe(false);
  });

  test("rejects WikiChip URL", () => {
    const result = validateSource(
      "https://en.wikichip.org/wiki/intel/core_i9/i9-14900k"
    );
    expect(result.valid).toBe(false);
  });

  test("rejects CPU-World URL", () => {
    const result = validateSource(
      "https://www.cpu-world.com/CPUs/Core_i9/Intel-Core%20i9%20i9-14900K.html"
    );
    expect(result.valid).toBe(false);
  });

  // Type validation
  test("validates source type correctly", () => {
    const result = validateSource(
      "https://ark.intel.com/content/www/us/en/ark/products/230496/intel-core-i9-14900k-processor.html",
      "cpu_specs"
    );
    expect(result.valid).toBe(true);
  });

  test("rejects mismatched source type", () => {
    const result = validateSource(
      "https://ark.intel.com/content/www/us/en/ark/products/230496/intel-core-i9-14900k-processor.html",
      "price_availability"
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("does not support source type");
  });

  // Edge cases
  test("handles URLs with subdomains correctly", () => {
    const result = validateSource("https://ark.intel.com/some/path");
    expect(result.valid).toBe(true);
    expect(result.domain).toBe("intel.com");
  });

  test("handles HTTP and HTTPS", () => {
    const https = validateSource("https://www.amd.com/test");
    const http = validateSource("http://www.amd.com/test");
    expect(https.valid).toBe(true);
    expect(http.valid).toBe(true);
  });

  test("rejects invalid URL format", () => {
    const result = validateSource("not-a-valid-url");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Invalid URL format");
  });
});

describe("validateSources (batch)", () => {
  test("validates multiple URLs at once", () => {
    const urls = [
      "https://ark.intel.com/test",
      "https://pcpartpicker.com/test",
      "https://www.amd.com/test",
    ];
    const results = validateSources(urls);

    expect(results[0].result.valid).toBe(true);
    expect(results[1].result.valid).toBe(false);
    expect(results[2].result.valid).toBe(true);
  });
});

describe("validateSourceStrict", () => {
  test("throws error for invalid source", () => {
    expect(() => {
      validateSourceStrict("https://pcpartpicker.com/test");
    }).toThrow("Source validation failed");
  });

  test("does not throw for valid source", () => {
    expect(() => {
      validateSourceStrict("https://ark.intel.com/test");
    }).not.toThrow();
  });
});
