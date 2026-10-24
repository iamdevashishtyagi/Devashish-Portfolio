import { NextResponse } from "next/server";
import { getVisitCount, recordVisit } from "@/src/app/lib/db";
import { hashIdentifier, checkRateLimit, extractServerTelemetry } from "@/src/app/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await getVisitCount();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Failed to get visit count:", err);
    return NextResponse.json({ count: 1420 }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const serverTelemetry = extractServerTelemetry(req);
    const ip = serverTelemetry.ip;
    const ipHash = hashIdentifier(ip);

    let clientTelemetry: Record<string, unknown> = {};
    try {
      const body = await req.json();
      if (body && typeof body.telemetry === "object") {
        clientTelemetry = body.telemetry;
      }
    } catch {
      // Empty body is acceptable
    }

    const fullTelemetry = {
      ...serverTelemetry,
      ...clientTelemetry,
      ipHash,
    };

    // Rate limit: Max 1 recorded increment per IP per 10 minutes to prevent spam / F5 abuse
    const rateLimit = checkRateLimit(`visit_${ipHash}`, 1, 600);
    if (!rateLimit.allowed) {
      const current = await getVisitCount();
      return NextResponse.json({ count: current, counted: false });
    }

    const newCount = await recordVisit(fullTelemetry);
    return NextResponse.json({ count: newCount, counted: true });
  } catch (err) {
    console.error("Failed to record visit:", err);
    const fallback = await getVisitCount();
    return NextResponse.json({ count: fallback, counted: false });
  }
}
