// src/app/sections/Projects/SystemTopologyBackground.tsx
"use client";

import { useEffect, useRef, useMemo } from "react";

interface SystemTopologyBackgroundProps {
  activeIndex: number;
}

export type PipelineNodeType =
  | "ingress"
  | "gateway"
  | "service"
  | "db"
  | "cache"
  | "worker"
  | "cloud"
  | "queue";

export interface PipelineNode {
  id: string;
  name: string;
  sub: string;
  tech: string;
  rx: number; // 0 to 1 relative X
  ry: number; // 0 to 1 relative Y
  type: PipelineNodeType;
}

export interface PipelineEdge {
  from: string;
  to: string;
  label?: string;
  bidirectional?: boolean;
}

export interface PipelineArchitecture {
  id: string;
  title: string;
  accent: string;
  secondary: string;
  status: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

// DEEP BOOK-BLACK DARK BLUE INK COLOR (Authoritative architectural blueprint ink)
const INK_COLOR = "#0B132B"; // Deep dark navy that looks black
const INK_MUTED = "rgba(11, 19, 43, 0.65)";
const INK_FAINT = "rgba(11, 19, 43, 0.12)";

// 5 PRODUCTION PIPELINE ARCHITECTURES MATCHING PROFILE DATA
const PIPELINE_ARCHITECTURES: PipelineArchitecture[] = [
  // 0. COLLEGE ERP (Enterprise System of Record)
  {
    id: "college-erp",
    title: "ENTERPRISE PIPELINE // INSTITUTIONAL SYSTEM OF RECORD",
    accent: "#2563EB",
    secondary: "#38BDF8",
    status: "30+ MODULES // LIVE MULTI-COLLEGE DEPLOYMENT",
    nodes: [
      { id: "client", name: "CLIENT PORTAL", sub: "Admissions & Fees", tech: "Vue.js", rx: 0.08, ry: 0.18, type: "ingress" },
      { id: "gateway", name: "API GATEWAY", sub: "Reverse Proxy & SSL", tech: "Nginx", rx: 0.28, ry: 0.18, type: "gateway" },
      { id: "auth", name: "RBAC AUTH ENGINE", sub: "30+ Role Matrix", tech: "Node / JWT", rx: 0.48, ry: 0.18, type: "service" },
      { id: "core", name: "ACADEMIC CORE", sub: "Course Modules", tech: "REST Service", rx: 0.72, ry: 0.20, type: "service" },
      { id: "db", name: "SHARDED DATABASE", sub: "Academic Records", tech: "MongoDB Replica", rx: 0.88, ry: 0.42, type: "db" },
      { id: "s3", name: "DOCUMENT VAULT", sub: "Encrypted Files", tech: "AWS S3", rx: 0.88, ry: 0.72, type: "cloud" },
      { id: "cron", name: "BATCH WORKER", sub: "Daily Attendance", tech: "Node Cron", rx: 0.50, ry: 0.82, type: "worker" },
      { id: "redis", name: "SESSION CACHE", sub: "Peak Ingress Buffer", tech: "Redis Cluster", rx: 0.22, ry: 0.74, type: "cache" },
    ],
    edges: [
      { from: "client", to: "gateway", label: "HTTPS / REST" },
      { from: "gateway", to: "auth", label: "JWT Token" },
      { from: "auth", to: "core", label: "Authorized Payload" },
      { from: "auth", to: "redis", label: "Session Lookup" },
      { from: "core", to: "db", label: "CRUD Operations" },
      { from: "core", to: "s3", label: "Transcripts Upload" },
      { from: "core", to: "cron", label: "Daily Batch Event" },
      { from: "cron", to: "db", label: "Attendance Write" },
    ],
  },

  // 1. ITALIAN INVOICE CONVERTER (Compliance Engine)
  {
    id: "invoice-converter",
    title: "COMPLIANCE PIPELINE // SDI XML CONVERSION & VALIDATION ENGINE",
    accent: "#D97706",
    secondary: "#F59E0B",
    status: "SCHEMA STRICT // SDI FATTURAPA COMPLIANT",
    nodes: [
      { id: "raw", name: "RAW INGESTION", sub: "CSV & JSON Invoices", tech: "Input Buffer", rx: 0.08, ry: 0.20, type: "ingress" },
      { id: "normalizer", name: "DATA NORMALIZER", sub: "Tax Normalization", tech: "Node Parser", rx: 0.28, ry: 0.20, type: "service" },
      { id: "xsd", name: "XSD VALIDATOR", sub: "SDI Schema Gate", tech: "XML / XSD", rx: 0.50, ry: 0.20, type: "service" },
      { id: "canonical", name: "CANONICAL TREE", sub: "Deterministic Nodes", tech: "Tax Spec", rx: 0.74, ry: 0.24, type: "service" },
      { id: "xmlgen", name: "FATTURAPA XML", sub: "Compliant Generator", tech: "XML Engine", rx: 0.88, ry: 0.56, type: "worker" },
      { id: "audit", name: "AUDIT LEDGER", sub: "Immutable Hash Log", tech: "Proof Store", rx: 0.66, ry: 0.80, type: "db" },
      { id: "relay", name: "TAX GATEWAY", sub: "Italian SDI Dispatch", tech: "Govt API", rx: 0.32, ry: 0.80, type: "cloud" },
      { id: "trap", name: "ERROR BOUNDARY", sub: "Pre-Flight Error Trap", tech: "Syntax Gate", rx: 0.50, ry: 0.50, type: "service" },
    ],
    edges: [
      { from: "raw", to: "normalizer", label: "Parse Records" },
      { from: "normalizer", to: "xsd", label: "Schema Verify" },
      { from: "xsd", to: "canonical", label: "Valid Schema" },
      { from: "xsd", to: "trap", label: "Malformed Trap" },
      { from: "canonical", to: "xmlgen", label: "Compile XML" },
      { from: "xmlgen", to: "audit", label: "Verify Integrity" },
      { from: "audit", to: "relay", label: "Direct SDI Submission" },
      { from: "trap", to: "normalizer", label: "Correction Loop" },
    ],
  },

  // 2. GYM MANAGEMENT SAAS (Multi-Tenant Operational Cloud)
  {
    id: "gym-saas",
    title: "OPERATIONAL SAAS PIPELINE // MULTI-TENANT ISOLATION BUS",
    accent: "#059669",
    secondary: "#10B981",
    status: "MULTI-GYM ISOLATION // ZERO DOWNTIME",
    nodes: [
      { id: "kiosk", name: "FRONT-DESK KIOSK", sub: "QR Check-in Pin", tech: "Vue.js", rx: 0.08, ry: 0.18, type: "ingress" },
      { id: "router", name: "TENANT ROUTER", sub: "Subdomain Isolation", tech: "Express Gateway", rx: 0.28, ry: 0.18, type: "gateway" },
      { id: "queue", name: "ATTENDANCE QUEUE", sub: "Burst FIFO Queue", tech: "Memory Bus", rx: 0.52, ry: 0.18, type: "queue" },
      { id: "billing", name: "SUBSCRIPTION CORE", sub: "Plan Lifecycle", tech: "State Machine", rx: 0.74, ry: 0.24, type: "service" },
      { id: "stripe", name: "PAYMENT BROKER", sub: "Recurring Webhooks", tech: "Stripe API", rx: 0.88, ry: 0.56, type: "cloud" },
      { id: "tenantdb", name: "TENANT DATA STORE", sub: "Isolated Gym Records", tech: "MongoDB Shards", rx: 0.66, ry: 0.80, type: "db" },
      { id: "metrics", name: "OWNER ANALYTICS", sub: "MRR & Churn Telemetry", tech: "Real-time Metrics", rx: 0.32, ry: 0.80, type: "service" },
      { id: "rbac", name: "AUTH BOUNDARY", sub: "Owner & Staff JWT", tech: "Security Token", rx: 0.28, ry: 0.48, type: "service" },
    ],
    edges: [
      { from: "kiosk", to: "router", label: "Check-in Event" },
      { from: "router", to: "rbac", label: "Validate Token" },
      { from: "router", to: "queue", label: "Queue Attendance" },
      { from: "queue", to: "tenantdb", label: "Record Entry" },
      { from: "router", to: "billing", label: "Plan Change" },
      { from: "billing", to: "stripe", label: "Process Invoice" },
      { from: "stripe", to: "billing", label: "Webhook Confirmed" },
      { from: "billing", to: "tenantdb", label: "Update Status" },
      { from: "tenantdb", to: "metrics", label: "Aggregate MRR" },
    ],
  },

  // 3. ALTHEA AI MULTI-TENANT RAG SYSTEM (AI Knowledge Retrieval)
  {
    id: "ai-chatbot",
    title: "AI RAG PIPELINE // TENANT EMBEDDING & SEMANTIC RETRIEVAL",
    accent: "#7C3AED",
    secondary: "#A855F7",
    status: "ZERO HALLUCINATION // TENANT VECTOR ISOLATION",
    nodes: [
      { id: "docs", name: "DOCUMENT INGESTION", sub: "Tenant PDF & Docs", tech: "Document Parser", rx: 0.08, ry: 0.18, type: "ingress" },
      { id: "chunker", name: "SEMANTIC CHUNKER", sub: "Sliding Token Window", tech: "Tokenizer", rx: 0.28, ry: 0.18, type: "service" },
      { id: "embed", name: "EMBEDDING ENGINE", sub: "1536-Dim Vectors", tech: "OpenAI Embed", rx: 0.50, ry: 0.18, type: "service" },
      { id: "vdb", name: "ISOLATED VECTOR DB", sub: "Tenant Vector Index", tech: "Vector Store", rx: 0.74, ry: 0.22, type: "db" },
      { id: "query", name: "USER RAG QUERY", sub: "Client Question Stream", tech: "WebSocket", rx: 0.08, ry: 0.60, type: "ingress" },
      { id: "cosine", name: "SEMANTIC SEARCH", sub: "Cosine Top-K Chunks", tech: "Dense Retrieval", rx: 0.36, ry: 0.60, type: "service" },
      { id: "redis", name: "QUERY CACHE", sub: "Deduplicated Cache", tech: "Redis In-Memory", rx: 0.60, ry: 0.60, type: "cache" },
      { id: "prompt", name: "GROUNDED PROMPT", sub: "Context Assembly", tech: "Prompt Engine", rx: 0.76, ry: 0.80, type: "service" },
      { id: "llm", name: "STREAMING LLM", sub: "Hallucination-Free", tech: "OpenAI Model", rx: 0.90, ry: 0.52, type: "cloud" },
    ],
    edges: [
      { from: "docs", to: "chunker", label: "Raw Text" },
      { from: "chunker", to: "embed", label: "Tokenized Chunks" },
      { from: "embed", to: "vdb", label: "Vector Upsert" },
      { from: "query", to: "cosine", label: "Query Vector" },
      { from: "cosine", to: "vdb", label: "Similarity Scan" },
      { from: "vdb", to: "redis", label: "Cache Chunks" },
      { from: "redis", to: "prompt", label: "Inject Context" },
      { from: "prompt", to: "llm", label: "Grounded Prompt" },
    ],
  },

  // 4. WORLD MEDIA (High-Performance Edge Web App)
  {
    id: "worldmedia",
    title: "EDGE WEB ARCHITECTURE // NEXT.JS ISR & ASSET PIPELINE",
    accent: "#0284C7",
    secondary: "#38BDF8",
    status: "LIGHTHOUSE 90+ // ZERO LAYOUT SHIFT (CLS)",
    nodes: [
      { id: "traffic", name: "GLOBAL TRAFFIC", sub: "Anycast Edge Ingress", tech: "Cloudflare", rx: 0.08, ry: 0.20, type: "ingress" },
      { id: "edge", name: "VERCEL CDN", sub: "Sub-50ms Routing", tech: "Edge Functions", rx: 0.28, ry: 0.20, type: "gateway" },
      { id: "isr", name: "NEXT.JS ISR ENGINE", sub: "Static Regeneration", tech: "Next.js / TS", rx: 0.50, ry: 0.20, type: "service" },
      { id: "sharp", name: "MEDIA OPTIMIZER", sub: "WebP / AVIF Responsive", tech: "Sharp Engine", rx: 0.74, ry: 0.24, type: "service" },
      { id: "seo", name: "METADATA INJECTOR", sub: "Schema.org & OpenGraph", tech: "SEO Pipeline", rx: 0.88, ry: 0.56, type: "worker" },
      { id: "perf", name: "LIGHTHOUSE BUDGET", sub: "Core Web Vitals Guard", tech: "Perf Gate", rx: 0.66, ry: 0.80, type: "service" },
      { id: "delivery", name: "SUB-100MS DELIVERY", sub: "Instant First Paint", tech: "Edge Cache", rx: 0.28, ry: 0.80, type: "cloud" },
      { id: "deploy", name: "DEPLOYMENT PIPELINE", sub: "Git Commit CI/CD", tech: "GitHub Actions", rx: 0.46, ry: 0.50, type: "worker" },
    ],
    edges: [
      { from: "traffic", to: "edge", label: "Anycast Route" },
      { from: "edge", to: "isr", label: "Static ISR Cache" },
      { from: "isr", to: "sharp", label: "Optimize Assets" },
      { from: "sharp", to: "seo", label: "Inject Metadata" },
      { from: "seo", to: "perf", label: "Audit Budgets" },
      { from: "perf", to: "delivery", label: "Edge Stream" },
      { from: "deploy", to: "isr", label: "Deploy Artifacts" },
      { from: "edge", to: "delivery", label: "Hit Cache" },
    ],
  },
];

interface AnimatedPacket {
  edgeIdx: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

// Robust cross-browser rounded rectangle helper
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | [number, number, number, number]
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  const rad = typeof r === "number" ? [r, r, r, r] : r;
  const [tl, tr, br, bl] = rad;
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h);
  ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl);
  ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
}

// ----------------------------------------------------------------------------
// BOLD ARCHITECTURAL VECTOR DIAGRAMS (100% UNIFIED DEEP BOOK-BLACK INK)
// No colored strokes. Clean, authoritative, technical schematic drawings.
// ----------------------------------------------------------------------------

// 1. Stacked Server Rack Unit (Exact match to reference photo!)
function drawServerRack(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  time: number
) {
  ctx.save();
  ctx.strokeStyle = INK_COLOR;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const trayW = 34 * scale;
  const trayH = 9 * scale;
  const spacing = 11.5 * scale;
  const startY = cy - spacing - 2 * scale;

  // Outer vertical mounting rails
  ctx.beginPath();
  ctx.moveTo(cx - trayW / 2 - 2.5 * scale, startY - 2 * scale);
  ctx.lineTo(cx - trayW / 2 - 2.5 * scale, startY + spacing * 2 + trayH + 2 * scale);
  ctx.moveTo(cx + trayW / 2 + 2.5 * scale, startY - 2 * scale);
  ctx.lineTo(cx + trayW / 2 + 2.5 * scale, startY + spacing * 2 + trayH + 2 * scale);
  ctx.stroke();

  // 3 Stacked horizontal blade trays
  for (let i = 0; i < 3; i++) {
    const ty = startY + i * spacing;
    const tx = cx - trayW / 2;

    // Chassis Blade Box
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    drawRoundRect(ctx, tx, ty, trayW, trayH, 2.5 * scale);
    ctx.fill();
    ctx.stroke();

    // 2 Circular status indicator LEDs on left (Deep black / hollow)
    const led1X = tx + 5.5 * scale;
    const led2X = tx + 10.5 * scale;
    const ledY = ty + trayH / 2;

    const isBlinking = Math.sin(time * 0.005 + i * 2.2) > 0.15;

    ctx.beginPath();
    ctx.arc(led1X, ledY, 1.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = isBlinking ? INK_COLOR : "#FFFFFF";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(led2X, ledY, 1.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = INK_COLOR;
    ctx.fill();

    // 3 Vertical cooling vent slots on right
    ctx.beginPath();
    const slotStartX = tx + trayW - 12 * scale;
    for (let s = 0; s < 3; s++) {
      const sx = slotStartX + s * 3.5 * scale;
      ctx.moveTo(sx, ty + 2.5 * scale);
      ctx.lineTo(sx, ty + trayH - 2.5 * scale);
    }
    ctx.lineWidth = 1.4 * scale;
    ctx.stroke();
    ctx.lineWidth = 2.2 * scale;
  }

  // Bottom pedestal mount & bus line connector (matches user's image)
  const bottomTrayY = startY + 2 * spacing + trayH;
  ctx.beginPath();
  ctx.moveTo(cx, bottomTrayY);
  ctx.lineTo(cx, bottomTrayY + 4 * scale);
  ctx.stroke();

  // Small junction block
  ctx.fillStyle = INK_COLOR;
  ctx.fillRect(cx - 3 * scale, bottomTrayY + 4 * scale, 6 * scale, 3.5 * scale);

  // Horizontal bus branch
  ctx.beginPath();
  ctx.moveTo(cx - 12 * scale, bottomTrayY + 7.5 * scale);
  ctx.lineTo(cx + 12 * scale, bottomTrayY + 7.5 * scale);
  ctx.stroke();

  ctx.restore();
}

// 2. Database Cylinder Drum (3-tier storage platters)
function drawDatabaseCylinder(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  time: number
) {
  ctx.save();
  ctx.strokeStyle = INK_COLOR;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const w = 30 * scale;
  const h = 36 * scale;
  const rx = w / 2;
  const ry = 5.5 * scale;
  const topY = cy - h / 2 + ry;
  const botY = cy + h / 2 - ry;

  // Solid white cylinder fill
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(cx, topY, rx, ry, 0, 0, Math.PI * 2);
  ctx.rect(cx - rx, topY, w, botY - topY);
  ctx.ellipse(cx, botY, rx, ry, 0, 0, Math.PI);
  ctx.fill();

  // Top Ellipse & Spindle Center
  ctx.beginPath();
  ctx.ellipse(cx, topY, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, topY, 1.8 * scale, 0, Math.PI * 2);
  ctx.fillStyle = INK_COLOR;
  ctx.fill();

  // Side Walls & Bottom Curve
  ctx.beginPath();
  ctx.moveTo(cx - rx, topY);
  ctx.lineTo(cx - rx, botY);
  ctx.moveTo(cx + rx, topY);
  ctx.lineTo(cx + rx, botY);
  ctx.ellipse(cx, botY, rx, ry, 0, 0, Math.PI);
  ctx.stroke();

  // 2 Horizontal Partition Platters
  const mid1Y = topY + (botY - topY) * 0.35;
  const mid2Y = topY + (botY - topY) * 0.70;

  ctx.beginPath();
  ctx.ellipse(cx, mid1Y, rx, ry, 0, 0, Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cx, mid2Y, rx, ry, 0, 0, Math.PI);
  ctx.stroke();

  // Tier Activity LEDs (Deep black / hollow)
  const activeTier = Math.floor((time * 0.003) % 3);
  [topY + 4 * scale, mid1Y + 4 * scale, mid2Y + 4 * scale].forEach((yPos, idx) => {
    ctx.beginPath();
    ctx.arc(cx - 5 * scale, yPos, 1.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = idx === activeTier ? INK_COLOR : "#FFFFFF";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + 5 * scale, yPos, 1.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = INK_COLOR;
    ctx.fill();
  });

  ctx.restore();
}

// 3. Network Gateway & Switch Router
function drawGatewayRouter(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  time: number
) {
  ctx.save();
  ctx.strokeStyle = INK_COLOR;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const rw = 36 * scale;
  const rh = 20 * scale;
  const rx = cx - rw / 2;
  const ry = cy - rh / 2 + 4 * scale;

  // Dual Top Antennas
  ctx.beginPath();
  ctx.moveTo(cx - 9 * scale, ry);
  ctx.lineTo(cx - 13 * scale, ry - 9 * scale);
  ctx.moveTo(cx + 9 * scale, ry);
  ctx.lineTo(cx + 13 * scale, ry - 9 * scale);
  ctx.stroke();

  // Radiating Signal Arcs
  const pulse = (time * 0.0035) % 1;
  ctx.beginPath();
  ctx.arc(cx, ry - 6 * scale, (5 + pulse * 6) * scale, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.lineWidth = 1.4 * scale;
  ctx.stroke();
  ctx.lineWidth = 2.2 * scale;

  // Router Chassis Box
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  drawRoundRect(ctx, rx, ry, rw, rh, 3 * scale);
  ctx.fill();
  ctx.stroke();

  // Ethernet Port Jacks
  const portW = 4.2 * scale;
  const portH = 5.5 * scale;
  const portY = ry + rh - portH - 3 * scale;
  for (let p = 0; p < 4; p++) {
    const px = rx + 4.5 * scale + p * 7.5 * scale;
    ctx.strokeRect(px, portY, portW, portH);
  }

  // Activity LEDs above ports
  for (let p = 0; p < 4; p++) {
    const px = rx + 6.5 * scale + p * 7.5 * scale;
    ctx.beginPath();
    ctx.arc(px, ry + 5 * scale, 1.4 * scale, 0, Math.PI * 2);
    ctx.fillStyle = p % 2 === 0 ? INK_COLOR : "#FFFFFF";
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// 4. Client Display & Developer Workstation
function drawClientTerminal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.strokeStyle = INK_COLOR;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const mw = 36 * scale;
  const mh = 24 * scale;
  const mx = cx - mw / 2;
  const my = cy - mh / 2 - 3 * scale;

  // Monitor Stand & Base Plate
  ctx.beginPath();
  ctx.moveTo(cx, my + mh);
  ctx.lineTo(cx, my + mh + 6 * scale);
  ctx.moveTo(cx - 10 * scale, my + mh + 6 * scale);
  ctx.lineTo(cx + 10 * scale, my + mh + 6 * scale);
  ctx.stroke();

  // Screen Bezel
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  drawRoundRect(ctx, mx, my, mw, mh, 3 * scale);
  ctx.fill();
  ctx.stroke();

  // Screen Header Window Bar
  ctx.beginPath();
  ctx.moveTo(mx, my + 6.5 * scale);
  ctx.lineTo(mx + mw, my + 6.5 * scale);
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();

  // 3 Window Controls
  ctx.fillStyle = INK_COLOR;
  for (let d = 0; d < 3; d++) {
    ctx.beginPath();
    ctx.arc(mx + 4.5 * scale + d * 3.5 * scale, my + 3.2 * scale, 1.0 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Code Prompt `>_`
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(mx + 5.5 * scale, my + 11.5 * scale);
  ctx.lineTo(mx + 10.5 * scale, my + 15 * scale);
  ctx.lineTo(mx + 5.5 * scale, my + 18.5 * scale);
  ctx.stroke();

  // Terminal Cursor
  ctx.beginPath();
  ctx.moveTo(mx + 14 * scale, my + 18.5 * scale);
  ctx.lineTo(mx + 21 * scale, my + 18.5 * scale);
  ctx.stroke();

  ctx.restore();
}

// 5. In-Memory Cache / RAM Chip
function drawCacheMemory(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.strokeStyle = INK_COLOR;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const size = 26 * scale;
  const x = cx - size / 2;
  const y = cy - size / 2;

  // External Connector Pins (4 pins per side)
  const pinLen = 3.5 * scale;
  ctx.beginPath();
  for (let p = 0; p < 4; p++) {
    const offset = (4.5 + p * 5.5) * scale;
    // Left
    ctx.moveTo(x, y + offset);
    ctx.lineTo(x - pinLen, y + offset);
    // Right
    ctx.moveTo(x + size, y + offset);
    ctx.lineTo(x + size + pinLen, y + offset);
    // Top
    ctx.moveTo(x + offset, y);
    ctx.lineTo(x + offset, y - pinLen);
    // Bottom
    ctx.moveTo(x + offset, y + size);
    ctx.lineTo(x + offset, y + size + pinLen);
  }
  ctx.stroke();

  // Chip Package
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  drawRoundRect(ctx, x, y, size, size, 2.5 * scale);
  ctx.fill();
  ctx.stroke();

  // Pin 1 Index Dot
  ctx.beginPath();
  ctx.arc(x + 4.5 * scale, y + 4.5 * scale, 1.4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = INK_COLOR;
  ctx.fill();

  // Speed Flash Lightning Symbol
  ctx.lineWidth = 1.6 * scale;
  ctx.beginPath();
  ctx.moveTo(cx + 1.5 * scale, cy - 7 * scale);
  ctx.lineTo(cx - 3.5 * scale, cy);
  ctx.lineTo(cx + 1.5 * scale, cy);
  ctx.lineTo(cx - 1.5 * scale, cy + 7 * scale);
  ctx.stroke();

  ctx.restore();
}

// 6. Cloud Storage & S3 Vault
function drawCloudVault(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.strokeStyle = INK_COLOR;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Cloud Silhouette
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(cx - 15 * scale, cy + 7 * scale);
  ctx.lineTo(cx + 15 * scale, cy + 7 * scale);
  ctx.arc(cx + 15 * scale, cy + 1 * scale, 6 * scale, Math.PI * 0.5, -Math.PI * 0.2);
  ctx.arc(cx + 6 * scale, cy - 5 * scale, 9 * scale, -Math.PI * 0.1, -Math.PI * 0.8);
  ctx.arc(cx - 7 * scale, cy - 3 * scale, 7.5 * scale, -Math.PI * 0.3, -Math.PI * 0.95);
  ctx.arc(cx - 15 * scale, cy + 2 * scale, 5 * scale, -Math.PI * 0.7, Math.PI * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Internal Storage S3 Disk Slot
  ctx.beginPath();
  ctx.rect(cx - 6 * scale, cy - 1.5 * scale, 12 * scale, 5.5 * scale);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx - 2.5 * scale, cy + 1.2 * scale, 1.3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = INK_COLOR;
  ctx.fill();

  ctx.restore();
}

// 7. Queue Buffer (FIFO Message Bus Pipe)
function drawQueueBuffer(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.strokeStyle = INK_COLOR;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const qw = 36 * scale;
  const qh = 18 * scale;
  const qx = cx - qw / 2;
  const qy = cy - qh / 2;

  // Queue Channel
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  drawRoundRect(ctx, qx, qy, qw, qh, 4 * scale);
  ctx.fill();
  ctx.stroke();

  // 3 Segmented In-Flight Message Blocks
  const blockW = 6.5 * scale;
  const blockH = 10 * scale;
  const blockY = qy + (qh - blockH) / 2;
  for (let i = 0; i < 3; i++) {
    const bx = qx + (5 + i * 9.5) * scale;
    ctx.fillStyle = i === 2 ? INK_COLOR : "#FFFFFF";
    ctx.fillRect(bx, blockY, blockW, blockH);
    ctx.strokeRect(bx, blockY, blockW, blockH);
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// MAIN SYSTEM TOPOLOGY BACKGROUND COMPONENT
// ----------------------------------------------------------------------------

export default function SystemTopologyBackground({ activeIndex }: SystemTopologyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Smooth crossfade state between architectures
  const currentArchIndex = useRef(activeIndex);
  const targetArchIndex = useRef(activeIndex);
  const crossfadeAlpha = useRef(1.0); // 1.0 = fully target
  const rippleWaves = useRef<Array<{ x: number; y: number; r: number; maxR: number; color: string; alpha: number }>>([]);

  const currentArch = useMemo(
    () => PIPELINE_ARCHITECTURES[activeIndex % PIPELINE_ARCHITECTURES.length],
    [activeIndex]
  );

  // When activeIndex changes, trigger ripple wave & crossfade
  useEffect(() => {
    targetArchIndex.current = activeIndex % PIPELINE_ARCHITECTURES.length;
    crossfadeAlpha.current = 0.0;

    if (containerRef.current) {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const targetArch = PIPELINE_ARCHITECTURES[targetArchIndex.current];
      const startNode = targetArch.nodes[0];

      rippleWaves.current.push({
        x: startNode.rx * w,
        y: startNode.ry * h,
        r: 10,
        maxR: Math.max(w, h) * 0.6,
        color: INK_COLOR,
        alpha: 0.7,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      } else {
        mouseRef.current = { x: -1000, y: -1000 };
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Packets pool for each architecture
    const packetsByArch = PIPELINE_ARCHITECTURES.map((arch) =>
      arch.edges.map((_, i) => ({
        edgeIdx: i,
        progress: Math.random(),
        speed: 0.0035 + Math.random() * 0.002,
        size: 3.5,
        color: i % 2 === 0 ? arch.accent : arch.secondary,
      }))
    );

    // Main Draw Function for a specific Pipeline Architecture
    const drawArchitecture = (
      arch: PipelineArchitecture,
      packets: AnimatedPacket[],
      alpha: number,
      time: number
    ) => {
      if (alpha <= 0.01) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Dynamic responsive scale factor for clean diagram proportions
      const scale = Math.min(1.0, Math.max(0.75, width / 1280));

      // Map node screen positions with subtle magnetic mouse deflection
      const nodeScreenMap = new Map<string, { x: number; y: number; node: PipelineNode }>();

      arch.nodes.forEach((node) => {
        let x = node.rx * width;
        let y = node.ry * height;

        // Subtle interactive mouse deflection
        const dx = mouseRef.current.x - x;
        const dy = mouseRef.current.y - y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 200;

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 10;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
        }

        nodeScreenMap.set(node.id, { x, y, node });
      });

      // ----------------------------------------------------------------------
      // 1. Draw Connecting Bus Traces (BOLD INK LINES with Orthogonal Routing)
      // ----------------------------------------------------------------------
      arch.edges.forEach((edge) => {
        const from = nodeScreenMap.get(edge.from);
        const to = nodeScreenMap.get(edge.to);
        if (!from || !to) return;

        // Orthogonal midpoint routing
        const midX = (from.x + to.x) / 2;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(midX, from.y);
        ctx.lineTo(midX, to.y);
        ctx.lineTo(to.x, to.y);

        // BOLD SOLID DARK INK PIPELINE BUS (No colored strokes)
        ctx.strokeStyle = INK_COLOR;
        ctx.lineWidth = 2.4 * scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Directional Arrowhead along the line segment
        const arrowSize = 4.5 * scale;
        ctx.fillStyle = INK_COLOR;
        ctx.beginPath();

        if (Math.abs(to.y - from.y) > 20) {
          const dirY = to.y > from.y ? 1 : -1;
          const ay = (from.y + to.y) / 2;
          ctx.moveTo(midX, ay + dirY * arrowSize);
          ctx.lineTo(midX - arrowSize, ay - dirY * arrowSize);
          ctx.lineTo(midX + arrowSize, ay - dirY * arrowSize);
        } else {
          const dirX = to.x > from.x ? 1 : -1;
          const ax = midX;
          ctx.moveTo(ax + dirX * arrowSize, from.y);
          ctx.lineTo(ax - dirX * arrowSize, from.y - arrowSize);
          ctx.lineTo(ax - dirX * arrowSize, from.y + arrowSize);
        }
        ctx.closePath();
        ctx.fill();

        // Terminal Docking Ring Ports at endpoints
        [from, to].forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4 * scale, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.strokeStyle = INK_COLOR;
          ctx.lineWidth = 2.0 * scale;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.6 * scale, 0, Math.PI * 2);
          ctx.fillStyle = INK_COLOR;
          ctx.fill();
        });
      });

      // ----------------------------------------------------------------------
      // 2. Draw Moving Glowing Data Packets along the pipeline traces
      // ----------------------------------------------------------------------
      packets.forEach((p) => {
        const edge = arch.edges[p.edgeIdx];
        if (!edge) return;
        const from = nodeScreenMap.get(edge.from);
        const to = nodeScreenMap.get(edge.to);
        if (!from || !to) return;

        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const midX = (from.x + to.x) / 2;
        let px = from.x;
        let py = from.y;

        if (p.progress < 0.33) {
          const t = p.progress / 0.33;
          px = from.x + (midX - from.x) * t;
          py = from.y;
        } else if (p.progress < 0.66) {
          const t = (p.progress - 0.33) / 0.33;
          px = midX;
          py = from.y + (to.y - from.y) * t;
        } else {
          const t = (p.progress - 0.66) / 0.34;
          px = midX + (to.x - midX) * t;
          py = to.y;
        }

        // Radiant Outer Glow (diffuses through frosted glass)
        ctx.beginPath();
        ctx.arc(px, py, p.size + 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.35;
        ctx.fill();

        // Crisp Glowing Packet Core
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 1.0;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = alpha;
      });

      // ----------------------------------------------------------------------
      // 3. Render Vector Diagrams DIRECTLY on the Pipeline (No generic box cards)
      // ----------------------------------------------------------------------
      nodeScreenMap.forEach(({ x, y, node }) => {
        const diagramY = y - 6 * scale;

        // Render the exact component vector diagram directly on the line
        if (node.type === "db") {
          drawDatabaseCylinder(ctx, x, diagramY, scale, time);
        } else if (node.type === "gateway") {
          drawGatewayRouter(ctx, x, diagramY, scale, time);
        } else if (node.type === "ingress") {
          drawClientTerminal(ctx, x, diagramY, scale);
        } else if (node.type === "cache") {
          drawCacheMemory(ctx, x, diagramY, scale);
        } else if (node.type === "cloud") {
          drawCloudVault(ctx, x, diagramY, scale);
        } else if (node.type === "queue") {
          drawQueueBuffer(ctx, x, diagramY, scale);
        } else {
          // "service" and "worker": Render Stacked Server Rack Unit directly (matches user's image!)
          drawServerRack(ctx, x, diagramY, scale, time);
        }

        // --------------------------------------------------------------------
        // Docked Technical Label Plate Directly Beneath the Diagram
        // --------------------------------------------------------------------
        const nameText = node.name;
        const subText = `${node.tech} · ${node.sub}`;

        ctx.font = `bold ${Math.round(8.5 * scale)}px 'JetBrains Mono', monospace`;
        const nameW = ctx.measureText(nameText).width;
        ctx.font = `600 ${Math.round(7.2 * scale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
        const subW = ctx.measureText(subText).width;

        const plateW = Math.max(nameW, subW) + 16 * scale;
        const plateH = 25 * scale;
        const plateX = x - plateW / 2;
        const plateY = y + 21 * scale;

        // Opaque white label plate with clean dark ink border (NO different colored strokes)
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        drawRoundRect(ctx, plateX, plateY, plateW, plateH, 3 * scale);
        ctx.fill();

        ctx.strokeStyle = INK_COLOR;
        ctx.lineWidth = 1.4 * scale;
        ctx.stroke();

        // Node Title (Bold Dark Ink Monospace)
        ctx.fillStyle = INK_COLOR;
        ctx.font = `bold ${Math.round(8.5 * scale)}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.fillText(nameText, x, plateY + 10.5 * scale);

        // Subtitle / Technology
        ctx.fillStyle = INK_MUTED;
        ctx.font = `600 ${Math.round(7.2 * scale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(subText, x, plateY + 20 * scale);
        ctx.textAlign = "left"; // reset
      });

      ctx.restore();
    };

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 16;
      ctx.clearRect(0, 0, width, height);

      // Draw Subtle CAD Registration Grid Crosshairs
      ctx.save();
      ctx.strokeStyle = INK_FAINT;
      ctx.lineWidth = 1.0;
      const step = 56;
      for (let gx = step; gx < width; gx += step) {
        for (let gy = step; gy < height; gy += step) {
          ctx.beginPath();
          ctx.moveTo(gx - 3, gy);
          ctx.lineTo(gx + 3, gy);
          ctx.moveTo(gx, gy - 3);
          ctx.lineTo(gx, gy + 3);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Smooth Crossfade Progress (0 -> 1)
      if (crossfadeAlpha.current < 1.0) {
        crossfadeAlpha.current = Math.min(crossfadeAlpha.current + 0.045, 1.0);
        if (crossfadeAlpha.current >= 1.0) {
          currentArchIndex.current = targetArchIndex.current;
        }
      }

      // Draw Outgoing Architecture (if transitioning)
      if (crossfadeAlpha.current < 1.0 && currentArchIndex.current !== targetArchIndex.current) {
        const prevArch = PIPELINE_ARCHITECTURES[currentArchIndex.current];
        const prevPackets = packetsByArch[currentArchIndex.current];
        drawArchitecture(prevArch, prevPackets, 1.0 - crossfadeAlpha.current, time);
      }

      // Draw Incoming Target Architecture
      const activeArch = PIPELINE_ARCHITECTURES[targetArchIndex.current];
      const activePackets = packetsByArch[targetArchIndex.current];
      drawArchitecture(activeArch, activePackets, crossfadeAlpha.current, time);

      // 4. Draw Active Project Signal Wave Ripples in Dark Ink
      for (let i = rippleWaves.current.length - 1; i >= 0; i--) {
        const ripple = rippleWaves.current[i];
        ripple.r += 3.2;
        ripple.alpha *= 0.965;

        if (ripple.alpha > 0.02 && ripple.r < ripple.maxR) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
          ctx.strokeStyle = INK_COLOR;
          ctx.globalAlpha = ripple.alpha;
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        } else {
          rippleWaves.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 95% 75% at 50% 35%, #FFFFFF 0%, #F8FAFC 55%, #F1F5F9 100%)",
      }}
    >
      {/* 1. Subtle Architectural Blueprint Ambient Backdrop */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${currentArch.accent} 0%, transparent 70%)`,
        }}
      />

      {/* 2. Interactive Pipeline 2D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />

      {/* 3. Live Pipeline Status Header & Telemetry (Unified Dark Ink Typography) */}
      <div className="absolute inset-x-8 top-3 flex items-center justify-between text-[9px] font-mono tracking-widest uppercase transition-colors duration-500">
        <span className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: INK_COLOR }}
          />
          <span className="font-bold text-[#0B132B] font-mono tracking-wider">
            {currentArch.title}
          </span>
        </span>

        <span className="hidden md:inline font-mono text-[9px] font-bold text-[#0B132B]/75">
          {currentArch.status}
        </span>

        <span
          className="px-2.5 py-0.5 rounded-full font-mono font-bold border-2 text-[8px] bg-white shadow-xs"
          style={{
            borderColor: INK_COLOR,
            color: INK_COLOR,
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
            style={{ backgroundColor: INK_COLOR }}
          />
          LIVE ARCHITECTURE FLOW
        </span>
      </div>
    </div>
  );
}
