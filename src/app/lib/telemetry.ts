"use client";

export interface ClientTelemetry {
  screenResolution: string;
  viewport: string;
  devicePixelRatio: number;
  colorDepth: number;
  timezone: string;
  language: string;
  platform: string;
  deviceType: "mobile" | "tablet" | "desktop";
  isTouch: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  connectionType?: string;
  referrer: string;
  path: string;
  searchParams?: Record<string, string>;
}

/**
 * Collects rich device & browser telemetry available silently without triggering permission prompts.
 */
export function collectClientTelemetry(): ClientTelemetry {
  if (typeof window === "undefined") {
    return {
      screenResolution: "unknown",
      viewport: "unknown",
      devicePixelRatio: 1,
      colorDepth: 24,
      timezone: "UTC",
      language: "en",
      platform: "unknown",
      deviceType: "desktop",
      isTouch: false,
      referrer: "",
      path: "/",
    };
  }

  const width = window.innerWidth;
  const isTouch =
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window ||
    (window.matchMedia && window.matchMedia("(pointer:coarse)").matches);

  let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
  if (width < 640 || (isTouch && width < 768)) {
    deviceType = "mobile";
  } else if (width <= 1024 && isTouch) {
    deviceType = "tablet";
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; downlink?: number };
  };

  // Parse UTM parameters or referrer tags
  const searchParams: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    params.forEach((val, key) => {
      if (key.startsWith("utm_") || key === "ref" || key === "source") {
        searchParams[key] = val.slice(0, 50);
      }
    });
  } catch {
    // ignore
  }

  return {
    screenResolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio || 1,
    colorDepth: window.screen?.colorDepth || 24,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    language: navigator.language || (navigator.languages && navigator.languages[0]) || "en",
    platform: navigator.platform || "",
    deviceType,
    isTouch,
    hardwareConcurrency: navigator.hardwareConcurrency || undefined,
    deviceMemory: nav.deviceMemory || undefined,
    connectionType: nav.connection?.effectiveType || undefined,
    referrer: document.referrer || "",
    path: window.location.pathname || "/",
    searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
  };
}
