import crypto from "crypto";

// In-memory rate limiting cache for serverless invocation window
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

/**
 * Hash an IP address or identifier with salt for privacy and deduplication.
 */
export function hashIdentifier(input: string): string {
  const salt = process.env.SECURITY_SALT || "devashish_portfolio_salt_2025";
  return crypto.createHash("sha256").update(`${input}_${salt}`).digest("hex");
}

/**
 * Extract client IP from standard request headers.
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}

/**
 * Extract server-side geolocation and system telemetry from headers.
 * Vercel and Cloudflare automatically inject edge geo headers without any user prompts.
 */
export function extractServerTelemetry(req: Request) {
  const headers = req.headers;
  const ip = getClientIp(req);
  const userAgent = headers.get("user-agent") || "";

  // Edge geolocation injected automatically by Vercel & Cloudflare
  const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || undefined;
  const countryRegion = headers.get("x-vercel-ip-country-region") || undefined;
  const city = headers.get("x-vercel-ip-city") || headers.get("cf-ipcity") || undefined;
  const latitude = headers.get("x-vercel-ip-latitude") || undefined;
  const longitude = headers.get("x-vercel-ip-longitude") || undefined;
  const timezone = headers.get("x-vercel-ip-timezone") || undefined;
  const referrer = headers.get("referer") || undefined;

  // OS Detection
  let os = "Unknown OS";
  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
  else if (/linux/i.test(userAgent)) os = "Linux";

  // Browser Detection
  let browser = "Unknown Browser";
  if (/edg/i.test(userAgent)) browser = "Edge";
  else if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = "Safari";
  else if (/opera|opr/i.test(userAgent)) browser = "Opera";

  return {
    ip,
    userAgent,
    country,
    countryRegion,
    city,
    latitude,
    longitude,
    timezone,
    referrer,
    os,
    browser,
  };
}

/**
 * Check rate limit for a specific action and key.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || existing.expiresAt < now) {
    rateLimitMap.set(key, {
      count: 1,
      expiresAt: now + windowSeconds * 1000,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  return { allowed: true, remaining: maxRequests - existing.count };
}

/**
 * Validate email format if provided.
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Sanitize text to prevent XSS and strip HTML tags.
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "") // strip all HTML tags
    .replace(/javascript:/gi, "") // strip javascript: protocol
    .replace(/vbscript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/onload=/gi, "")
    .replace(/onerror=/gi, "")
    .replace(/onclick=/gi, "")
    .trim();
}

/**
 * Basic spam filter (rejects excessive URLs or spam triggers).
 */
export function isSpam(text: string): boolean {
  if (!text) return false;
  // If text contains more than 1 URL or obvious spam keywords
  const urlMatches = text.match(/https?:\/\//gi);
  if (urlMatches && urlMatches.length > 1) return true;

  const spamKeywords = [
    "viagra",
    "cialis",
    "casino",
    "crypto giveaway",
    "telegram bot",
    "whatsapp girl",
    "free bitcoin",
    "seo ranking service",
  ];
  const lower = text.toLowerCase();
  return spamKeywords.some((word) => lower.includes(word));
}
