"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Matter from "matter-js";
import { Icon } from "@iconify/react";
import { SLINGSHOT_TECH_STACK } from "@/src/app/data/slingshotIcons";
import { RotateCcw, MoveRight } from "lucide-react";

const WALL_THICKNESS = 140;

export type SlingshotTier = "compact" | "mobile" | "tablet" | "desktop";

export function getSlingshotTier(width: number): SlingshotTier {
  if (width < 420) return "compact";
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

// Generate dynamic organic string curve with natural catenary sag and aerodynamic bowing
function getCablePath(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  vx: number,
  vy: number,
  L: number
) {
  const dx = bx - ax;
  const dy = by - ay;
  const dist = Math.hypot(dx, dy);

  // Slack amount when ball is closer to anchor than string length L
  const slack = Math.max(0, L - dist);
  // Natural catenary droop (sags downwards in gravity direction)
  const sag = Math.min(180, Math.pow(slack, 0.92) * 0.62);

  // Inertial and aerodynamic flex (rope bows dynamically opposite to ball velocity)
  const flexX = Math.max(-50, Math.min(50, -vx * 0.45));
  const flexY = Math.max(-35, Math.min(35, -vy * 0.3));

  // Cubic Bézier curve with two control points for rich, organic string physics:
  // cp1: near anchor, hangs down with gravity + slack
  const cp1x = ax + dx * 0.28 + flexX * 0.7;
  const cp1y = ay + dy * 0.28 + sag * 0.85 + flexY * 0.6;

  // cp2: near ball shackle, connects smoothly into top of the ball
  const cp2x = bx - dx * 0.28 + flexX * 0.4;
  const cp2y = by - dy * 0.28 + sag * 0.85 + flexY * 0.4;

  return `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}`;
}

// Responsive configuration engine for mobile, tablet, and desktop viewports
export function getSlingshotConfig(width: number, height: number) {
  const isCompactMobile = width < 420;
  const isMobile = width < 640;
  const isTablet = width < 1024;

  const barY = isMobile ? 18 : 24;

  // Demolition ball radius
  // Mobile: 26-30px (52-60px diameter)
  // Tablet: 36px (72px diameter)
  // Desktop: 44px (88px diameter)
  const ballRadius = isCompactMobile ? 26 : isMobile ? 30 : isTablet ? 36 : 44;
  const ballTopOffset = Math.round(ballRadius * 0.86);

  // Stack badges dimensions
  // Mobile: 42-46px (4 cols x 46px = 184px, perfectly fits inside 360-390px screens)
  // Tablet: 60px (4 cols x 60px = 240px)
  // Desktop: 74px (4 cols x 74px = 296px)
  const itemSize = isCompactMobile ? 42 : isMobile ? 46 : isTablet ? 60 : 74;
  const gapX = isCompactMobile ? 4 : isMobile ? 6 : isTablet ? 8 : 10;
  const cols = 4;
  const rows = 7; // 4 columns x 7 rows = 28 items
  const totalStackWidth = cols * itemSize + (cols - 1) * gapX;

  // Ceiling Anchor
  // Mobile: anchored at ~24% of width (e.g. 88-95px on 375-390px screens)
  // Tablet: anchored at ~28% of width (e.g. 215px on 768px screens)
  // Desktop: anchored at ~32% of width (e.g. 360-460px)
  const anchorX = isMobile
    ? Math.max(68, Math.min(115, Math.round(width * 0.24)))
    : isTablet
    ? Math.max(160, Math.min(260, Math.round(width * 0.28)))
    : Math.max(260, Math.min(460, width * 0.32));
  const anchorY = barY;

  // Initial cocked ball position: touching ceiling, just right of left boundary
  const initialBallX = ballRadius + (isMobile ? 14 : 36);
  const initialBallY = barY + ballRadius + 2;

  // Cable length: spans from anchor down towards the floor level
  const floorLevel = height - (isMobile ? 16 : 20);
  const cableLength = Math.max(180, floorLevel - anchorY - ballRadius - 10);

  // Stack horizontal start position (startX)
  // On mobile & tablet: positioned cleanly on the right half with safe margin so it never overflows
  // On desktop: positioned slightly left of center as specifically requested
  let startX: number;
  if (isMobile) {
    const rightMargin = isCompactMobile ? 8 : 14;
    const idealLeft = width - totalStackWidth - rightMargin;
    const minLeft = anchorX + ballRadius * 2 + 16;
    startX = Math.max(minLeft, idealLeft);
  } else if (isTablet) {
    const rightMargin = 24;
    const idealLeft = width - totalStackWidth - rightMargin;
    const minLeft = anchorX + ballRadius * 2 + 36;
    startX = Math.max(minLeft, idealLeft);
  } else {
    // Desktop: Slightly to the left of the block as requested
    const targetLeft = Math.max(anchorX + 130, Math.min(width * 0.44, width - totalStackWidth - 80));
    startX = Math.max(anchorX + 90, targetLeft);
  }

  // Precompute systematic grid positions
  const positions = new Map<string, { x: number; y: number }>();
  SLINGSHOT_TECH_STACK.forEach((item, index) => {
    const col = Math.floor(index / rows) % cols;
    const row = index % rows; // 0 is bottom, 6 is top

    const x = startX + col * (itemSize + gapX) + itemSize / 2;
    // Each row rests flat on the row below it starting flush from floorLevel
    const y = floorLevel - itemSize / 2 - row * itemSize;

    positions.set(item.id, { x, y });
  });

  return {
    isCompactMobile,
    isMobile,
    isTablet,
    barY,
    ballRadius,
    ballTopOffset,
    itemSize,
    gapX,
    cols,
    rows,
    totalStackWidth,
    anchorX,
    anchorY,
    initialBallX,
    initialBallY,
    cableLength,
    floorLevel,
    startX,
    positions,
  };
}

export default function TechSlingshot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matter.js references
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const iconBodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const ballBodyRef = useRef<Matter.Body | null>(null);

  // DOM node references for direct 60/120fps transforms
  const ballDomRef = useRef<HTMLDivElement>(null);
  const cablePathRef = useRef<SVGPathElement>(null);
  const cableKnotRef = useRef<SVGCircleElement>(null);
  const iconDomRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Dimensions & Responsive Tier
  const [dimensions, setDimensions] = useState({ width: 1200, height: 750 });
  const arenaSizeRef = useRef({ width: 1200, height: 750 });
  const [tier, setTier] = useState<SlingshotTier>(() => {
    if (typeof window !== "undefined") {
      return getSlingshotTier(window.innerWidth);
    }
    return "desktop";
  });

  // Game/UI stats
  const [isScattered, setIsScattered] = useState(false);
  const isScatteredRef = useRef(false);
  const [scatterCount, setScatterCount] = useState(0);
  const [swingsCount, setSwingsCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const isResettingRef = useRef(false);

  // Canvas Sparks
  const sparksRef = useRef<Spark[]>([]);

  // Responsive config
  const config = useMemo(() => {
    return getSlingshotConfig(dimensions.width, dimensions.height);
  }, [dimensions.width, dimensions.height]);

  const configRef = useRef(config);
  configRef.current = config;

  // =========================================================================
  // UN-STRETCHABLE SWING PENDULUM STATE
  // =========================================================================
  const swingRef = useRef({
    theta: -1.46, // Cocked high touching the ceiling, just slight right from left boundary
    omega: 0,
    isDragging: false,
    isArmed: true, // Holds at ceiling position until released, dragged, or Swing Ball clicked
    x: 44 + 36,
    y: 24 + 44 + 2,
    vx: 0,
    vy: 0,
  });

  const prevBallPointerHistory = useRef<{ x: number; y: number; time: number }[]>([]);

  // Dragging state for individual tech badges
  const badgeDragRef = useRef<{
    id: string;
    body: Matter.Body;
    pointerId: number;
    offsetX: number;
    offsetY: number;
    history: { x: number; y: number; time: number }[];
  } | null>(null);

  // Trigger burst of sparks on impact
  const triggerImpactSparks = useCallback((x: number, y: number, color: string, count = 28) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 8 + 2.5;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        color,
        size: Math.random() * 3.5 + 1.8,
        alpha: 1,
        decay: Math.random() * 0.026 + 0.016,
      });
    }
  }, []);

  // =========================================================================
  // MATTER.JS ENGINE LIFECYCLE (Micro-Gravity: items roam & float freely)
  // Re-initializes seamlessly when crossing mobile/tablet/desktop tiers
  // =========================================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth || 1200;
    const height = container.clientHeight || window.innerHeight || 750;
    arenaSizeRef.current = { width, height };
    setDimensions({ width, height });

    const activeConf = getSlingshotConfig(width, height);

    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }

    // Micro-gravity (0.08) so items roam and float gracefully across the arena!
    const engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 0.08,
        scale: 0.001,
      },
      enableSleeping: true,
      positionIterations: 16,
      velocityIterations: 16,
    });
    engineRef.current = engine;
    const world = engine.world;

    // Viewport Boundaries with high liveliness and low friction
    const bounce = 0.88;
    const wallFriction = 0.03;

    const bottomWall = Matter.Bodies.rectangle(
      width / 2,
      height + WALL_THICKNESS / 2 - (activeConf.isMobile ? 16 : 20),
      width * 2,
      WALL_THICKNESS,
      {
        isStatic: true,
        restitution: bounce,
        friction: wallFriction,
        label: "wall-bottom",
      }
    );

    const topWall = Matter.Bodies.rectangle(
      width / 2,
      -WALL_THICKNESS / 2,
      width * 2,
      WALL_THICKNESS,
      {
        isStatic: true,
        restitution: bounce,
        friction: wallFriction,
        label: "wall-top",
      }
    );

    const leftWall = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height * 2,
      {
        isStatic: true,
        restitution: bounce,
        friction: wallFriction,
        label: "wall-left",
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      width + WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height * 2,
      {
        isStatic: true,
        restitution: bounce,
        friction: wallFriction,
        label: "wall-right",
      }
    );

    Matter.Composite.add(world, [bottomWall, topWall, leftWall, rightWall]);

    // Initial Pendulum State
    const ballX = activeConf.initialBallX;
    const ballY = activeConf.initialBallY;
    const initialTheta = Math.atan2(ballX - activeConf.anchorX, ballY - activeConf.anchorY);

    swingRef.current = {
      theta: initialTheta,
      omega: 0,
      isDragging: false,
      isArmed: true,
      x: ballX,
      y: ballY,
      vx: 0,
      vy: 0,
    };

    // Heavy Ball Matter.js physics body (Driver body for demolition impact)
    const ballBody = Matter.Bodies.circle(ballX, ballY, activeConf.ballRadius, {
      isStatic: true,
      restitution: 0.82,
      friction: 0.03,
      density: 0.08,
      label: "wrecking-ball",
    });
    ballBodyRef.current = ballBody;
    Matter.Composite.add(world, ballBody);

    // Initial DOM positions for Ball and Cable
    if (ballDomRef.current) {
      ballDomRef.current.style.transform = `translate3d(${ballX}px, ${ballY}px, 0px) translate(-50%, -50%) rotate(${initialTheta}rad)`;
    }
    if (cablePathRef.current) {
      cablePathRef.current.setAttribute(
        "d",
        getCablePath(
          activeConf.anchorX,
          activeConf.anchorY,
          ballX,
          ballY - activeConf.ballTopOffset,
          0,
          0,
          activeConf.cableLength
        )
      );
    }
    if (cableKnotRef.current) {
      cableKnotRef.current.setAttribute("cx", String(ballX));
      cableKnotRef.current.setAttribute("cy", String(ballY - activeConf.ballTopOffset));
    }

    // Create 28 Tech Stack Badges (Ultra-light bodies with near-zero air drag to float & roam!)
    const iconBodies = new Map<string, Matter.Body>();

    SLINGSHOT_TECH_STACK.forEach((item) => {
      const slot = activeConf.positions.get(item.id) || { x: width * 0.5, y: height * 0.5 };

      // Square chamfered body: very light density, minimal air drag, high bounce
      const body = Matter.Bodies.rectangle(slot.x, slot.y, activeConf.itemSize, activeConf.itemSize, {
        chamfer: { radius: activeConf.isMobile ? 6 : 8 },
        restitution: 0.88,
        friction: 0.03,
        frictionAir: 0.0018,
        density: 0.001,
        isStatic: false,
        label: `tech-${item.id}`,
      });

      // Put to sleep initially so it rests stably in formation without slipping
      Matter.Sleeping.set(body, true);

      iconBodies.set(item.id, body);

      const el = iconDomRefs.current.get(item.id);
      if (el) {
        el.style.transform = `translate3d(${slot.x}px, ${slot.y}px, 0px) translate(-50%, -50%) rotate(0rad)`;
      }
    });

    iconBodiesRef.current = iconBodies;
    Matter.Composite.add(world, Array.from(iconBodies.values()));

    // -------------------------------------------------------------------------
    // Main Physics Tick & Render Loop
    // -------------------------------------------------------------------------
    let lastTime = performance.now();

    const afterUpdateHandler = () => {
      const now = performance.now();
      const dtMs = Math.min(32, Math.max(8, now - lastTime));
      lastTime = now;
      const dt = dtMs / 16.666;

      const curConf = configRef.current;
      const anchor = { x: curConf.anchorX, y: curConf.anchorY };
      const L = curConf.cableLength;
      const swing = swingRef.current;

      // 1. Flexible String Swing Integration (Slack freefall + Taut pendulum)
      if (!swing.isDragging && !swing.isArmed && !isResettingRef.current) {
        const curDistToAnchor = Math.hypot(swing.x - anchor.x, swing.y - anchor.y);
        const isSlack = curDistToAnchor < L - 1.5;

        if (isSlack) {
          // String is slack: Ball falls and moves in free 2D trajectory under gravity
          const g = curConf.isMobile ? 0.38 : 0.42;
          swing.vy += g * dt;
          swing.vx *= Math.pow(0.9994, dt);
          swing.vy *= Math.pow(0.9994, dt);

          let nextX = swing.x + swing.vx * dt;
          let nextY = swing.y + swing.vy * dt;

          const newDist = Math.hypot(nextX - anchor.x, nextY - anchor.y);
          if (newDist >= L) {
            // String snaps taut! Convert velocity smoothly into pendulum swing
            const theta = Math.atan2(nextX - anchor.x, nextY - anchor.y);
            swing.theta = theta;
            const nx = Math.sin(theta);
            const ny = Math.cos(theta);

            // Tangential velocity preserved
            const vTan = swing.vx * ny - swing.vy * nx;
            swing.omega = vTan / L;
            swing.vx = L * ny * swing.omega;
            swing.vy = -L * nx * swing.omega;
            nextX = anchor.x + nx * L;
            nextY = anchor.y + ny * L;
          } else {
            swing.theta = Math.atan2(nextX - anchor.x, nextY - anchor.y);
            swing.omega = (swing.vx * (nextY - anchor.y) - swing.vy * (nextX - anchor.x)) / (newDist * newDist || 1);
          }

          swing.x = nextX;
          swing.y = nextY;
        } else {
          // String is taut: Pure harmonic pendulum physics along the circular arc
          const gravityFactor = 0.0035;
          const damping = 0.0008;

          const alpha = -gravityFactor * Math.sin(swing.theta) - damping * swing.omega;
          swing.omega += alpha * dt;
          swing.omega *= Math.pow(0.9996, dt);
          swing.theta += swing.omega * dt;

          const curX = anchor.x + L * Math.sin(swing.theta);
          const curY = anchor.y + L * Math.cos(swing.theta);

          swing.vx = L * Math.cos(swing.theta) * swing.omega;
          swing.vy = -L * Math.sin(swing.theta) * swing.omega;
          swing.x = curX;
          swing.y = curY;
        }

        // Sync Matter.js ball body position & velocity
        if (ballBody) {
          Matter.Body.setPosition(ballBody, { x: swing.x, y: swing.y });
          Matter.Body.setVelocity(ballBody, { x: swing.vx, y: swing.vy });
        }
      }

      // Update ball and flexible SVG string in DOM
      if (ballDomRef.current) {
        ballDomRef.current.style.transform = `translate3d(${swing.x}px, ${swing.y}px, 0px) translate(-50%, -50%) rotate(${swing.theta}rad)`;
      }
      if (cablePathRef.current) {
        cablePathRef.current.setAttribute(
          "d",
          getCablePath(
            curConf.anchorX,
            curConf.anchorY,
            swing.x,
            swing.y - curConf.ballTopOffset,
            swing.vx,
            swing.vy,
            curConf.cableLength
          )
        );
      }
      if (cableKnotRef.current) {
        cableKnotRef.current.setAttribute("cx", String(swing.x));
        cableKnotRef.current.setAttribute("cy", String(swing.y - curConf.ballTopOffset));
      }

      // 2. Collision: Smooth demolition impact into the Tech Stack
      if (!isResettingRef.current) {
        const ballSpeed = Math.hypot(swing.vx, swing.vy);
        const hitDistance = curConf.ballRadius + curConf.itemSize * 0.62;

        if (ballSpeed > 0.6) {
          for (const body of iconBodies.values()) {
            const dx = body.position.x - swing.x;
            const dy = body.position.y - swing.y;
            const dist = Math.hypot(dx, dy);

            if (dist < hitDistance) {
              // Wake up ALL stack bodies so they roam freely!
              iconBodies.forEach((b) => {
                Matter.Sleeping.set(b, false);
              });

              isScatteredRef.current = true;
              setIsScattered(true);

              // Proportional blast radius for mobile vs desktop
              const blastRadius = curConf.isMobile ? 210 : curConf.isTablet ? 290 : 380;
              const pushPowerX = curConf.isMobile ? 11 : 16;
              const pushPowerY = curConf.isMobile ? 9 : 14;

              iconBodies.forEach((other) => {
                const odx = other.position.x - swing.x;
                const ody = other.position.y - swing.y;
                const odist = Math.hypot(odx, ody);
                if (odist < blastRadius) {
                  const factor = Math.pow((blastRadius - odist) / blastRadius, 1.35);
                  const onx = odx / (odist || 1);
                  const ony = ody / (odist || 1);

                  // Fluid velocity impulse: forward and floating upward
                  const pushX = onx * factor * pushPowerX + swing.vx * 0.65;
                  const pushY = ony * factor * pushPowerY + swing.vy * 0.45 - (curConf.isMobile ? 3.5 : 5);

                  Matter.Body.setVelocity(other, {
                    x: other.velocity.x * 0.45 + pushX + (Math.random() - 0.5) * 3,
                    y: other.velocity.y * 0.45 + pushY + (Math.random() - 0.5) * 3,
                  });
                  Matter.Body.setAngularVelocity(other, (Math.random() - 0.5) * 0.28);
                }
              });

              // Smooth ball resistance
              swing.omega *= 0.97;

              // Spark burst
              triggerImpactSparks(
                body.position.x,
                body.position.y,
                "#38BDF8",
                curConf.isMobile ? 20 : 32
              );
              setScatterCount((prev) => prev + 1);
              break;
            }
          }
        }
      }

      // 3. Render Tech Badges transforms directly to DOM (Matter.js -> DOM)
      if (!isResettingRef.current) {
        iconBodies.forEach((body, id) => {
          if (badgeDragRef.current?.id === id) return;
          const el = iconDomRefs.current.get(id);
          if (!el) return;

          const { x, y } = body.position;
          const angle = body.angle;
          el.style.transform = `translate3d(${x}px, ${y}px, 0px) translate(-50%, -50%) rotate(${angle}rad)`;

          // Arena boundary safety respawn
          if (y > height + 200 || x < -150 || x > width + 150) {
            Matter.Body.setPosition(body, {
              x: Math.max(60, Math.min(width - 60, x)),
              y: 50,
            });
            Matter.Body.setVelocity(body, { x: 0, y: 1 });
          }
        });
      }

      // 4. Render Sparks Overlay on Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const sparks = sparksRef.current;
          if (sparks.length > 0) {
            ctx.save();
            for (let i = sparks.length - 1; i >= 0; i--) {
              const p = sparks[i];
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.vy += 0.12 * dt;
              p.alpha -= p.decay * dt;

              if (p.alpha <= 0) {
                sparks.splice(i, 1);
                continue;
              }

              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 6;
              ctx.fill();
            }
            ctx.restore();
          }
        }
      }
    };

    Matter.Events.on(engine, "afterUpdate", afterUpdateHandler);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Responsive ResizeObserver tracking full viewport changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth <= 100 || newHeight <= 100) continue;

        arenaSizeRef.current = { width: newWidth, height: newHeight };
        setDimensions({ width: newWidth, height: newHeight });

        const newTier = getSlingshotTier(newWidth);
        if (newTier !== tier) {
          setTier(newTier);
        }

        if (canvasRef.current) {
          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;
        }

        // Reposition boundary walls for full width/height
        const currentConf = getSlingshotConfig(newWidth, newHeight);
        Matter.Body.setPosition(bottomWall, {
          x: newWidth / 2,
          y: newHeight + WALL_THICKNESS / 2 - (currentConf.isMobile ? 16 : 20),
        });
        Matter.Body.setPosition(topWall, {
          x: newWidth / 2,
          y: -WALL_THICKNESS / 2,
        });
        Matter.Body.setPosition(leftWall, {
          x: -WALL_THICKNESS / 2,
          y: newHeight / 2,
        });
        Matter.Body.setPosition(rightWall, {
          x: newWidth + WALL_THICKNESS / 2,
          y: newHeight / 2,
        });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      Matter.Events.off(engine, "afterUpdate", afterUpdateHandler);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [triggerImpactSparks, tier]);

  // =========================================================================
  // UN-STRETCHABLE BALL POINTER DRAGGING (Strict fixed-length pendulum arc!)
  // =========================================================================

  const updateBallDrag = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const curConf = configRef.current;
    const rect = container.getBoundingClientRect();
    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;

    const anchor = { x: curConf.anchorX, y: curConf.anchorY };
    const L = curConf.cableLength;

    // Vector from anchor to pointer
    const dx = pointerX - anchor.x;
    const dy = Math.max(16, pointerY - anchor.y);
    const pDist = Math.hypot(dx, dy);

    let targetX = pointerX;
    let targetY = pointerY;

    if (pDist > L) {
      const nx = dx / (pDist || 1);
      const ny = dy / (pDist || 1);
      const clampedL = L + Math.min(4, (pDist - L) * 0.05);
      targetX = anchor.x + nx * clampedL;
      targetY = anchor.y + ny * clampedL;
    } else {
      targetY = Math.max(anchor.y + 14, pointerY);
    }

    // Keep ball within arena boundaries
    targetX = Math.max(curConf.ballRadius + 10, Math.min(arenaSizeRef.current.width - curConf.ballRadius - 10, targetX));
    targetY = Math.min(arenaSizeRef.current.height - (curConf.isMobile ? 14 : 20) - curConf.ballRadius, targetY);

    const angle = Math.atan2(targetX - anchor.x, targetY - anchor.y);

    const swing = swingRef.current;
    swing.theta = angle;
    swing.omega = 0;
    swing.x = targetX;
    swing.y = targetY;
    swing.vx = 0;
    swing.vy = 0;

    if (ballBodyRef.current) {
      Matter.Body.setPosition(ballBodyRef.current, { x: swing.x, y: swing.y });
      Matter.Body.setVelocity(ballBodyRef.current, { x: 0, y: 0 });
    }

    if (ballDomRef.current) {
      ballDomRef.current.style.transform = `translate3d(${swing.x}px, ${swing.y}px, 0px) translate(-50%, -50%) rotate(${angle}rad)`;
    }
    if (cablePathRef.current) {
      cablePathRef.current.setAttribute(
        "d",
        getCablePath(anchor.x, anchor.y, swing.x, swing.y - curConf.ballTopOffset, 0, 0, L)
      );
    }
    if (cableKnotRef.current) {
      cableKnotRef.current.setAttribute("cx", String(swing.x));
      cableKnotRef.current.setAttribute("cy", String(swing.y - curConf.ballTopOffset));
    }

    const now = performance.now();
    prevBallPointerHistory.current.push({ x: targetX, y: targetY, time: now });
    prevBallPointerHistory.current = prevBallPointerHistory.current.filter((p) => now - p.time <= 140);
  }, []);

  const finishBallDrag = useCallback(() => {
    const swing = swingRef.current;
    if (!swing.isDragging) return;

    swing.isDragging = false;
    swing.isArmed = false;

    // Calculate flick velocity from 2D pointer drag history
    const history = prevBallPointerHistory.current;
    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const dt = Math.max(1, last.time - first.time);
      const vx = ((last.x - first.x) / dt) * 16;
      const vy = ((last.y - first.y) / dt) * 16;

      const maxSpeed = 38;
      const speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        swing.vx = (vx / speed) * maxSpeed;
        swing.vy = (vy / speed) * maxSpeed;
      } else {
        swing.vx = vx;
        swing.vy = vy;
      }
    } else {
      // Natural release without drag history: pure freefall under gravity
      swing.vx = 0;
      swing.vy = 0;
    }

    setSwingsCount((c) => c + 1);
  }, []);

  // Window-level listeners for smooth dragging anywhere on the screen
  useEffect(() => {
    const onWindowPointerMove = (e: PointerEvent) => {
      if (swingRef.current.isDragging) {
        updateBallDrag(e.clientX, e.clientY);
      }
    };

    const onWindowPointerUp = () => {
      if (swingRef.current.isDragging) {
        finishBallDrag();
      }
    };

    window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
  }, [updateBallDrag, finishBallDrag]);

  // Ball Pointer Down
  const handleBallPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const swing = swingRef.current;
    swing.isDragging = true;
    swing.isArmed = false;
    swing.omega = 0;
    swing.vx = 0;
    swing.vy = 0;
    prevBallPointerHistory.current = [{ x: swing.x, y: swing.y, time: performance.now() }];
  };

  // Ball Pointer Up
  const handleBallPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    finishBallDrag();
  };

  // Trigger Swing from High-Left Ceiling Peak (Pure Natural Free Fall!)
  const triggerSwing = () => {
    const curConf = configRef.current;
    const anchor = { x: curConf.anchorX, y: curConf.anchorY };
    const L = curConf.cableLength;
    const swing = swingRef.current;
    const targetPos = { x: curConf.initialBallX, y: curConf.initialBallY };

    // Reset cleanly to ceiling position if armed or settled
    if (swing.isArmed || Math.hypot(swing.vx, swing.vy) < 0.5) {
      swing.x = targetPos.x;
      swing.y = targetPos.y;
    }

    const theta = Math.atan2(swing.x - anchor.x, swing.y - anchor.y);
    swing.theta = theta;

    // Pure free fall under gravity: Zero initial impulse or jerk!
    swing.omega = 0;
    swing.vx = 0;
    swing.vy = 0;
    swing.isDragging = false;
    swing.isArmed = false;

    if (ballBodyRef.current) {
      Matter.Body.setPosition(ballBodyRef.current, { x: swing.x, y: swing.y });
      Matter.Body.setVelocity(ballBodyRef.current, { x: 0, y: 0 });
    }

    if (cablePathRef.current) {
      cablePathRef.current.setAttribute(
        "d",
        getCablePath(anchor.x, anchor.y, swing.x, swing.y - curConf.ballTopOffset, 0, 0, L)
      );
    }

    setSwingsCount((c) => c + 1);
  };

  // =========================================================================
  // INDIVIDUAL TECH BADGES DRAGGING & FLINGING (Floaty & roaming!)
  // =========================================================================

  const handleBadgePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    const body = iconBodiesRef.current.get(id);
    if (!body) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    // Wake this body so it moves freely
    Matter.Sleeping.set(body, false);

    Matter.Body.setVelocity(body, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(body, 0);
    Matter.Body.setStatic(body, true);

    badgeDragRef.current = {
      id,
      body,
      pointerId: e.pointerId,
      offsetX: pointerX - body.position.x,
      offsetY: pointerY - body.position.y,
      history: [{ x: pointerX, y: pointerY, time: performance.now() }],
    };
  };

  const handleBadgePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = badgeDragRef.current;
    if (!drag || !containerRef.current) return;

    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    const targetX = pointerX - drag.offsetX;
    const targetY = pointerY - drag.offsetY;

    Matter.Body.setPosition(drag.body, { x: targetX, y: targetY });

    const el = iconDomRefs.current.get(drag.id);
    if (el) {
      el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0px) translate(-50%, -50%) rotate(${drag.body.angle}rad)`;
    }

    const now = performance.now();
    drag.history.push({ x: pointerX, y: pointerY, time: now });
    drag.history = drag.history.filter((p) => now - p.time <= 120);
  };

  const handleBadgePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = badgeDragRef.current;
    if (!drag) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Restore dynamic freedom
    Matter.Body.setStatic(drag.body, false);
    Matter.Sleeping.set(drag.body, false);

    if (drag.history.length >= 2) {
      const first = drag.history[0];
      const last = drag.history[drag.history.length - 1];
      const dt = Math.max(1, last.time - first.time);

      let vx = ((last.x - first.x) / dt) * 16 * 1.35;
      let vy = ((last.y - first.y) / dt) * 16 * 1.35;

      const maxVelocity = 28;
      vx = Math.max(-maxVelocity, Math.min(maxVelocity, vx));
      vy = Math.max(-maxVelocity, Math.min(maxVelocity, vy));

      if (Math.abs(vx) < 1.2 && Math.abs(vy) < 1.2) {
        vx = (Math.random() - 0.5) * 5;
        vy = -(Math.random() * 5 + 5);
      }

      Matter.Body.setVelocity(drag.body, { x: vx, y: vy });
      Matter.Body.setAngularVelocity(drag.body, (vx / 20) * 0.12);
    } else {
      Matter.Body.setVelocity(drag.body, {
        x: (Math.random() - 0.5) * 5,
        y: -(Math.random() * 5 + 5),
      });
      Matter.Body.setAngularVelocity(drag.body, (Math.random() - 0.5) * 0.1);
    }

    badgeDragRef.current = null;
  };

  // =========================================================================
  // REBUILD STACK & RESET FORMATION
  // =========================================================================

  const handleResetFormation = useCallback(() => {
    if (isResettingRef.current) return;
    setIsResetting(true);
    isResettingRef.current = true;

    const startTime = performance.now();
    const duration = 650;

    const curConf = configRef.current;
    const anchor = { x: curConf.anchorX, y: curConf.anchorY };
    const L = curConf.cableLength;
    const startBallPos = { x: swingRef.current.x, y: swingRef.current.y };
    const targetBallPos = { x: curConf.initialBallX, y: curConf.initialBallY };
    const targetTheta = Math.atan2(targetBallPos.x - anchor.x, targetBallPos.y - anchor.y);

    // Snapshot start positions
    const startBadgeStates = new Map<string, { x: number; y: number; angle: number }>();
    iconBodiesRef.current.forEach((body, id) => {
      startBadgeStates.set(id, {
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
      });
      Matter.Body.setStatic(body, true);
    });

    const startSwingTheta = swingRef.current.theta;

    const animateReset = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      // Animate badges back to systematic formation
      iconBodiesRef.current.forEach((body, id) => {
        const start = startBadgeStates.get(id);
        const target = curConf.positions.get(id);
        if (!start || !target) return;

        const curX = start.x + (target.x - start.x) * ease;
        const curY = start.y + (target.y - start.y) * ease;
        const curAngle = start.angle * (1 - ease);

        Matter.Body.setPosition(body, { x: curX, y: curY });
        Matter.Body.setAngle(body, curAngle);
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);

        const el = iconDomRefs.current.get(id);
        if (el) {
          el.style.transform = `translate3d(${curX}px, ${curY}px, 0px) translate(-50%, -50%) rotate(${curAngle}rad)`;
        }
      });

      // Animate swing back to touching ceiling, just slight right from left boundary
      const ballX = startBallPos.x + (targetBallPos.x - startBallPos.x) * ease;
      const ballY = startBallPos.y + (targetBallPos.y - startBallPos.y) * ease;
      const curTheta = startSwingTheta + (targetTheta - startSwingTheta) * ease;

      const swing = swingRef.current;
      swing.theta = curTheta;
      swing.omega = 0;
      swing.x = ballX;
      swing.y = ballY;
      swing.vx = 0;
      swing.vy = 0;

      if (ballBodyRef.current) {
        Matter.Body.setPosition(ballBodyRef.current, { x: ballX, y: ballY });
      }

      if (ballDomRef.current) {
        ballDomRef.current.style.transform = `translate3d(${ballX}px, ${ballY}px, 0px) translate(-50%, -50%) rotate(${curTheta}rad)`;
      }
      if (cablePathRef.current) {
        cablePathRef.current.setAttribute(
          "d",
          getCablePath(anchor.x, anchor.y, ballX, ballY - curConf.ballTopOffset, 0, 0, L)
        );
      }
      if (cableKnotRef.current) {
        cableKnotRef.current.setAttribute("cx", String(ballX));
        cableKnotRef.current.setAttribute("cy", String(ballY - curConf.ballTopOffset));
      }

      if (progress < 1) {
        requestAnimationFrame(animateReset);
      } else {
        // Finalize state: Keep dynamic, put to sleep in neat grid until hit or dragged!
        iconBodiesRef.current.forEach((body, id) => {
          const target = curConf.positions.get(id);
          if (target) {
            Matter.Body.setPosition(body, target);
            Matter.Body.setAngle(body, 0);
          }
          Matter.Body.setStatic(body, false);
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
          Matter.Sleeping.set(body, true);
        });

        swing.isArmed = true;
        swing.isDragging = false;
        swing.x = targetBallPos.x;
        swing.y = targetBallPos.y;
        swing.theta = targetTheta;
        swing.vx = 0;
        swing.vy = 0;
        swing.omega = 0;

        isScatteredRef.current = false;
        setIsScattered(false);
        setScatterCount(0);
        setIsResetting(false);
        isResettingRef.current = false;

        triggerImpactSparks(
          curConf.startX + curConf.totalStackWidth / 2,
          curConf.floorLevel - (curConf.rows * curConf.itemSize) / 2,
          "#10B981",
          curConf.isMobile ? 18 : 28
        );
      }
    };

    requestAnimationFrame(animateReset);
  }, [triggerImpactSparks]);

  return (
    <section
      id="playground"
      className="w-full border-t border-slate-200/80 bg-white dark:bg-transparent transition-colors duration-700 pt-10 sm:pt-14 md:pt-16 pb-0 overflow-x-hidden"
    >
      {/* Section Heading (Cleanly ABOVE the system arena, outside the box) */}
      <div className="container-narrow px-4 sm:px-6 md:px-12 mb-4 sm:mb-6 md:mb-8">
        <span className="text-xs sm:text-sm uppercase tracking-widest text-slate-400 font-medium font-mono">
          The Arsenal
        </span>
        <h2 className="heading-2 mt-1.5 sm:mt-2 text-current text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
          NOT JUST LOGOS — <span style={{ color: "rgb(71, 36, 0)" }}>PRESSURE TESTED</span>
        </h2>
        <p className="body-large max-w-2xl mt-1.5 sm:mt-2 text-current/60 text-sm sm:text-base md:text-lg">
          Every tool in this stack was forged through real production constraints.
          Pull or swing the heavy ball on the left to test the stack under pressure.
        </p>
      </div>

      {/* Responsive Physics Arena System Box */}
      <div
        ref={containerRef}
        className="relative w-full h-[76vh] min-h-[520px] max-h-[720px] sm:h-screen sm:min-h-[680px] sm:max-h-none overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-slate-50/40 select-none touch-none border-y border-slate-200/90 shadow-[inset_0_2px_14px_rgba(0,0,0,0.02)]"
      >
        {/* Subtle Blueprint Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: config.isMobile ? "28px 28px" : "36px 36px",
          }}
        />

        {/* The 3 Action Buttons INSIDE the box at Top Right (Responsive for Mobile & Desktop) */}
        <div className="absolute top-2.5 right-2.5 sm:top-5 sm:right-6 md:top-8 md:right-8 z-40 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md max-w-[calc(100%-20px)]">
          {/* Status Indicator Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-50/90 border border-slate-200/70 text-xs font-medium text-slate-700">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isScattered ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span className="font-mono text-[10px] sm:text-xs">
              <span className="hidden sm:inline">
                {isScattered ? `Demolished (${scatterCount} hits)` : "Systematic Formation"}
              </span>
              <span className="sm:hidden">
                {isScattered ? `Hits: ${scatterCount}` : "Ready"}
              </span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-[10px] sm:text-xs">Swings: {swingsCount}</span>
          </div>

          {/* Swing Ball Button */}
          <button
            type="button"
            onClick={triggerSwing}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 text-[11px] sm:text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Release the heavy swing ball from high left to smash into the stack"
          >
            <MoveRight className="w-3.5 h-3.5 shrink-0" />
            <span>Swing</span>
          </button>

          {/* Rebuild Stack Button */}
          <button
            type="button"
            onClick={handleResetFormation}
            disabled={isResetting}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-semibold transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${isResetting ? "animate-spin" : ""}`} />
            <span>Rebuild</span>
          </button>
        </div>

        {/* Canvas Overlay for Impact Sparks */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-35"
        />

        {/* SVG Layer: Top Horizontal Bar, Mounting Grommet, and Un-stretchable Swing Cable */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Chrome / Polished Steel Rod Gradient */}
            <linearGradient id="swing-bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="35%" stopColor="#475569" />
              <stop offset="70%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Rod highlight reflection */}
            <linearGradient id="swing-bar-light" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="75%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Braided Steel Cable Gradient */}
            <linearGradient id="swing-cable-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Wall mount bracket end-caps spanning full width */}
          <rect
            x={4}
            y={config.anchorY - 7}
            width={config.isMobile ? 10 : 12}
            height={config.isMobile ? 16 : 20}
            rx={2}
            fill="#475569"
          />
          <rect
            x={dimensions.width - (config.isMobile ? 14 : 16)}
            y={config.anchorY - 7}
            width={config.isMobile ? 10 : 12}
            height={config.isMobile ? 16 : 20}
            rx={2}
            fill="#475569"
          />

          {/* The Horizontal Hanging Bar Rod */}
          <rect
            x={config.isMobile ? 10 : 12}
            y={config.anchorY - 4}
            width={Math.max(10, dimensions.width - (config.isMobile ? 20 : 24))}
            height={config.isMobile ? 7 : 8}
            rx={config.isMobile ? 3.5 : 4}
            fill="url(#swing-bar-grad)"
          />
          <line
            x1={config.isMobile ? 14 : 18}
            y1={config.anchorY - 2}
            x2={dimensions.width - (config.isMobile ? 14 : 18)}
            y2={config.anchorY - 2}
            stroke="url(#swing-bar-light)"
            strokeWidth="1.2"
          />

          {/* Anchor Grommet & Bearing on the top rod */}
          <circle
            cx={config.anchorX}
            cy={config.anchorY + 3}
            r={config.isMobile ? "6" : "8"}
            fill="#1E293B"
            stroke="#64748B"
            strokeWidth={config.isMobile ? "2" : "2.5"}
          />
          <circle
            cx={config.anchorX}
            cy={config.anchorY + 3}
            r={config.isMobile ? "2.5" : "3.5"}
            fill="#F8FAFC"
          />

          {/* Flexible Realistic Physics Cable / Hanging String */}
          <path
            ref={cablePathRef}
            d={getCablePath(
              config.anchorX,
              config.anchorY + 3,
              swingRef.current.x,
              swingRef.current.y - config.ballTopOffset,
              swingRef.current.vx,
              swingRef.current.vy,
              config.cableLength
            )}
            fill="none"
            stroke="url(#swing-cable-grad)"
            strokeWidth={config.isMobile ? "2.5" : "3.5"}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.25))",
            }}
          />

          {/* Fastener Ring / Shackle connecting to the ball */}
          <circle
            ref={cableKnotRef}
            cx={swingRef.current.x}
            cy={swingRef.current.y - config.ballTopOffset}
            r={config.isMobile ? "3.5" : "5"}
            fill="#0284C7"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
        </svg>

        {/* Heavy Ball on the Un-stretchable Swing (Proportionally scaled for mobile & desktop) */}
        <div
          ref={ballDomRef}
          onPointerDown={handleBallPointerDown}
          onPointerUp={handleBallPointerUp}
          onPointerCancel={handleBallPointerUp}
          style={{
            width: `${config.ballRadius * 2}px`,
            height: `${config.ballRadius * 2}px`,
            touchAction: "none",
          }}
          className="absolute top-0 left-0 rounded-full cursor-grab active:cursor-grabbing z-30 flex items-center justify-center will-change-transform select-none group"
          title="Grab & swing this heavy ball into the stack!"
        >
          {/* Outer Polished Demolition Shell */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 border-[2.5px] md:border-[3px] border-slate-300 shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_16px_rgba(56,189,248,0.3)] flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 overflow-hidden">
            {/* Radial Bolted Texture */}
            <div className="absolute inset-1 rounded-full border border-dashed border-slate-500/60 pointer-events-none" />

            {/* Centered Next.js Tech Emblem */}
            <div
              className="rounded-full bg-white flex items-center justify-center shadow-inner z-10 border border-slate-300"
              style={{
                width: `${Math.round(config.ballRadius * 1.08)}px`,
                height: `${Math.round(config.ballRadius * 1.08)}px`,
              }}
            >
              <Icon
                icon="devicon:nextjs"
                className="shrink-0 select-none pointer-events-none drop-shadow-sm text-black"
                style={{
                  width: `${Math.round(config.ballRadius * 0.62)}px`,
                  height: `${Math.round(config.ballRadius * 0.62)}px`,
                }}
              />
            </div>

            {/* 3D Specular Sheen */}
            <div className="absolute top-1.5 left-2 w-5 h-3 md:w-6 md:h-4 rounded-full bg-white/45 rotate-[-30deg] blur-[1px] pointer-events-none" />
          </div>
        </div>

        {/* Dynamic Square Tech Stack Badges (Proportionately configured for mobile & desktop) */}
        {SLINGSHOT_TECH_STACK.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) iconDomRefs.current.set(item.id, el);
              else iconDomRefs.current.delete(item.id);
            }}
            onPointerDown={(e) => handleBadgePointerDown(e, item.id)}
            onPointerMove={handleBadgePointerMove}
            onPointerUp={handleBadgePointerUp}
            onPointerCancel={handleBadgePointerUp}
            style={{
              width: `${config.itemSize}px`,
              height: `${config.itemSize}px`,
              touchAction: "none",
            }}
            className={`absolute top-0 left-0 cursor-grab active:cursor-grabbing z-25 flex items-center justify-center will-change-transform select-none group ${
              config.isMobile ? "rounded-xl" : "rounded-2xl"
            }`}
            title={`Drag and toss ${item.name}`}
          >
            <div
              className={`w-full h-full bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center transition-all duration-150 group-hover:shadow-md group-hover:scale-105 active:scale-95 ${
                config.isMobile
                  ? "rounded-xl p-1"
                  : config.isTablet
                  ? "rounded-xl p-1.5"
                  : "rounded-2xl p-2.5"
              }`}
              style={{
                boxShadow: `0 3px 14px ${item.glowColor}`,
              }}
            >
              <Icon
                icon={item.icon}
                className={`${
                  config.isCompactMobile
                    ? "w-4 h-4"
                    : config.isMobile
                    ? "w-5 h-5"
                    : config.isTablet
                    ? "w-6 h-6"
                    : "w-8 h-8 md:w-9 md:h-9"
                } shrink-0 select-none pointer-events-none drop-shadow-sm`}
              />
              <span
                className={`${
                  config.isCompactMobile
                    ? "text-[7.5px]"
                    : config.isMobile
                    ? "text-[8.5px]"
                    : config.isTablet
                    ? "text-[9.5px]"
                    : "text-[10px] md:text-[11px]"
                } font-bold text-slate-800 tracking-tight whitespace-nowrap truncate max-w-full pointer-events-none ${
                  config.isMobile ? "mt-0.5 leading-none" : "mt-1"
                }`}
              >
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
