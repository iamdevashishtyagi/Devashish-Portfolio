"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Matter from "matter-js";
import { Icon } from "@iconify/react";
import { SLINGSHOT_TECH_STACK } from "@/src/app/data/slingshotIcons";
import { RotateCcw, Crosshair, Sparkles, MoveRight } from "lucide-react";

// Top mounting rod vertical position
const BAR_Y = 24;
const BALL_RADIUS = 44; // Demolition ball (88px diameter)
const BALL_TOP_OFFSET = 38; // Distance from ball center to string attachment knot
const WALL_THICKNESS = 140;

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

// Order 28 tech stack items systematically into 4 columns of 7 items
// Positioned a little more to the left of the block with increased box size
function getSystematicGridPositions(width: number, height: number, anchorX: number) {
  const isSmall = width < 768;
  const isMedium = width < 1024;
  // Increased box size for prominent visual impact and tactile interaction
  const size = isSmall ? 64 : isMedium ? 70 : 76;
  const gapX = isSmall ? 8 : 10;
  const cols = 4;
  const rows = 7; // 4 columns x 7 rows = 28 items

  const totalWidth = cols * size + (cols - 1) * gapX;

  // Positioned a little more toward the left-center of the arena
  const targetLeft = Math.max(anchorX + 130, Math.min(width * 0.44, width - totalWidth - (isSmall ? 20 : 100)));
  const startX = Math.max(anchorX + 90, targetLeft);
  const floorY = height - 20;

  const positions = new Map<string, { x: number; y: number }>();

  SLINGSHOT_TECH_STACK.forEach((item, index) => {
    const col = Math.floor(index / rows) % cols;
    const row = index % rows; // 0 is bottom, 6 is top

    const x = startX + col * (size + gapX) + size / 2;
    // Each row rests flat on the row below it starting flush from floorY
    const y = floorY - size / 2 - row * size;

    positions.set(item.id, { x, y });
  });

  return { positions, size, floorY, startX, cols, rows };
}

export default function TechSlingshot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matter.js references
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const iconBodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const ballBodyRef = useRef<Matter.Body | null>(null);

  // DOM node references for direct buttery 60/120fps transforms
  const ballDomRef = useRef<HTMLDivElement>(null);
  const cablePathRef = useRef<SVGPathElement>(null);
  const cableKnotRef = useRef<SVGCircleElement>(null);
  const iconDomRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Dimensions (Full Viewport)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 750 });
  const arenaSizeRef = useRef({ width: 1200, height: 750 });

  // Game/UI stats
  const [isScattered, setIsScattered] = useState(false);
  const isScatteredRef = useRef(false);
  const [scatterCount, setScatterCount] = useState(0);
  const [swingsCount, setSwingsCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const isResettingRef = useRef(false);

  // Canvas Sparks
  const sparksRef = useRef<Spark[]>([]);

  // =========================================================================
  // UN-STRETCHABLE SWING PENDULUM STATE
  // =========================================================================
  const swingRef = useRef({
    theta: -0.85, // Cocked high to the left ready to swing
    omega: 0,
    isDragging: false,
    isArmed: true, // Holds at left peak until released or clicked
    x: 0,
    y: 0,
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

  // Top Mounting Pivot Anchor
  const ceilingAnchor = useMemo(() => {
    const x = Math.max(240, Math.min(460, dimensions.width * 0.32));
    const y = BAR_Y;
    return { x, y };
  }, [dimensions.width]);

  const ceilingAnchorRef = useRef(ceilingAnchor);
  ceilingAnchorRef.current = ceilingAnchor;

  // Un-stretchable Cable Length (fixed radius)
  const cableLength = useMemo(() => {
    const floorLevel = dimensions.height - 20;
    return Math.max(280, floorLevel - BAR_Y - BALL_RADIUS - 12);
  }, [dimensions.height]);

  const cableLengthRef = useRef(cableLength);
  cableLengthRef.current = cableLength;

  // Safe cocked high-left angle so ball stays comfortably inside the left wall
  const cockedPeakTheta = useMemo(() => {
    const ax = ceilingAnchor.x;
    const L = cableLength;
    const targetX = BALL_RADIUS + 32;
    const rawSin = (targetX - ax) / L;
    const clampedSin = Math.max(-0.94, Math.min(-0.50, rawSin));
    return Math.asin(clampedSin);
  }, [ceilingAnchor.x, cableLength]);

  const cockedPeakThetaRef = useRef(cockedPeakTheta);
  cockedPeakThetaRef.current = cockedPeakTheta;

  // Systematic Grid Slots
  const { positions: systematicPositions, size: iconSize, floorY } = useMemo(() => {
    return getSystematicGridPositions(dimensions.width, dimensions.height, ceilingAnchor.x);
  }, [dimensions.width, dimensions.height, ceilingAnchor.x]);

  const systematicPositionsRef = useRef(systematicPositions);
  systematicPositionsRef.current = systematicPositions;

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
        size: Math.random() * 4 + 2,
        alpha: 1,
        decay: Math.random() * 0.026 + 0.016,
      });
    }
  }, []);

  // =========================================================================
  // MATTER.JS ENGINE LIFECYCLE (Micro-Gravity: items are ultra-light & roam around)
  // =========================================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth || 1200;
    const height = container.clientHeight || window.innerHeight || 750;
    arenaSizeRef.current = { width, height };
    setDimensions({ width, height });

    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }

    // Micro-gravity (0.08) so items roam and float gracefully across the arena!
    const engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 0.08, // Very light gravity: badges float, drift, and roam around freely!
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
      height + WALL_THICKNESS / 2 - 20,
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
    const anchorX = Math.max(240, Math.min(460, width * 0.32));
    const anchorY = BAR_Y;
    const initialL = Math.max(280, height - 20 - BAR_Y - BALL_RADIUS - 12);
    
    const targetLeftX = BALL_RADIUS + 32;
    const initialTheta = Math.asin(Math.max(-0.94, Math.min(-0.50, (targetLeftX - anchorX) / initialL)));
    
    const ballX = anchorX + initialL * Math.sin(initialTheta);
    const ballY = anchorY + initialL * Math.cos(initialTheta);

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
    const ballBody = Matter.Bodies.circle(ballX, ballY, BALL_RADIUS, {
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
        getCablePath(anchorX, anchorY, ballX, ballY - BALL_TOP_OFFSET, 0, 0, initialL)
      );
    }
    if (cableKnotRef.current) {
      cableKnotRef.current.setAttribute("cx", String(ballX));
      cableKnotRef.current.setAttribute("cy", String(ballY - BALL_TOP_OFFSET));
    }

    // Create 28 Tech Stack Badges (Ultra-light bodies with near-zero air drag to float & roam!)
    const { positions: slots, size: itemSize } = getSystematicGridPositions(width, height, anchorX);
    const iconBodies = new Map<string, Matter.Body>();

    SLINGSHOT_TECH_STACK.forEach((item) => {
      const slot = slots.get(item.id) || { x: width * 0.50, y: height * 0.5 };

      // Square chamfered body: very light density, minimal air drag, high bounce
      const body = Matter.Bodies.rectangle(slot.x, slot.y, itemSize, itemSize, {
        chamfer: { radius: 8 },
        restitution: 0.88, // Very springy & bouncy!
        friction: 0.03, // Glides smoothly across surfaces
        frictionAir: 0.0018, // Near zero air drag so badges float and roam endlessly!
        density: 0.001, // Ultra-light mass
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

      const anchor = ceilingAnchorRef.current;
      const L = cableLengthRef.current;
      const swing = swingRef.current;

      // 1. Flexible String Swing Integration (Slack freefall + Taut pendulum)
      if (!swing.isDragging && !swing.isArmed && !isResettingRef.current) {
        const curDistToAnchor = Math.hypot(swing.x - anchor.x, swing.y - anchor.y);
        const isSlack = curDistToAnchor < L - 1.5;

        if (isSlack) {
          // String is slack: Ball falls and moves in free 2D trajectory under gravity
          const g = 0.42;
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
          getCablePath(anchor.x, anchor.y, swing.x, swing.y - BALL_TOP_OFFSET, swing.vx, swing.vy, L)
        );
      }
      if (cableKnotRef.current) {
        cableKnotRef.current.setAttribute("cx", String(swing.x));
        cableKnotRef.current.setAttribute("cy", String(swing.y - BALL_TOP_OFFSET));
      }

      // 2. Collision: Smooth demolition impact into the Tech Stack
      if (!isResettingRef.current) {
        const ballSpeed = Math.hypot(swing.vx, swing.vy);
        const hitDistance = BALL_RADIUS + itemSize * 0.62;

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

              // Smooth momentum wave with cubic falloff across a 380px blast radius
              const blastRadius = 380;
              iconBodies.forEach((other) => {
                const odx = other.position.x - swing.x;
                const ody = other.position.y - swing.y;
                const odist = Math.hypot(odx, ody);
                if (odist < blastRadius) {
                  const factor = Math.pow((blastRadius - odist) / blastRadius, 1.35);
                  const onx = odx / (odist || 1);
                  const ony = ody / (odist || 1);

                  // Fluid velocity impulse: forward and floating upward
                  const pushX = onx * factor * 16 + swing.vx * 0.65;
                  const pushY = ony * factor * 14 + swing.vy * 0.45 - 5;

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
              triggerImpactSparks(body.position.x, body.position.y, "#38BDF8", 32);
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
              x: Math.max(80, Math.min(width - 80, x)),
              y: 60,
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

        if (canvasRef.current) {
          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;
        }

        // Reposition boundary walls for full width/height
        Matter.Body.setPosition(bottomWall, {
          x: newWidth / 2,
          y: newHeight + WALL_THICKNESS / 2 - 20,
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
  }, [triggerImpactSparks]);

  // =========================================================================
  // UN-STRETCHABLE BALL POINTER DRAGGING (Strict fixed-length pendulum arc!)
  // =========================================================================

  const updateBallDrag = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;

    const anchor = ceilingAnchorRef.current;
    const L = cableLengthRef.current;

    // Vector from anchor to pointer
    const dx = pointerX - anchor.x;
    const dy = Math.max(16, pointerY - anchor.y);
    const pDist = Math.hypot(dx, dy);

    let targetX = pointerX;
    let targetY = pointerY;

    // String physics:
    // If pulled farther than string length L, clamp distance firmly to L (un-stretchable string)
    // If pointer is inside L, the ball moves freely with pointer and the string sags loosely!
    if (pDist > L) {
      const nx = dx / (pDist || 1);
      const ny = dy / (pDist || 1);
      const clampedL = L + Math.min(4, (pDist - L) * 0.05);
      targetX = anchor.x + nx * clampedL;
      targetY = anchor.y + ny * clampedL;
    } else {
      targetY = Math.max(anchor.y + 16, pointerY);
    }

    // Keep ball within arena boundaries
    targetX = Math.max(BALL_RADIUS + 12, Math.min(arenaSizeRef.current.width - BALL_RADIUS - 12, targetX));
    targetY = Math.min(arenaSizeRef.current.height - 20 - BALL_RADIUS, targetY);

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
        getCablePath(anchor.x, anchor.y, swing.x, swing.y - BALL_TOP_OFFSET, 0, 0, L)
      );
    }
    if (cableKnotRef.current) {
      cableKnotRef.current.setAttribute("cx", String(swing.x));
      cableKnotRef.current.setAttribute("cy", String(swing.y - BALL_TOP_OFFSET));
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
      // Natural release
      if (swing.x < ceilingAnchorRef.current.x - 40) {
        swing.vx = 4.0; // Confident forward swing toward the stack
        swing.vy = 1.0;
      }
    }

    setSwingsCount((c) => c + 1);
    triggerImpactSparks(swing.x, swing.y, "#38BDF8", 12);
  }, [triggerImpactSparks]);

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

  // Trigger Swing from High-Left Peak (Button Action)
  const triggerSwing = () => {
    const anchor = ceilingAnchorRef.current;
    const L = cableLengthRef.current;
    const swing = swingRef.current;
    const peakTheta = cockedPeakThetaRef.current;

    swing.theta = peakTheta;
    swing.omega = 0.028; // Snappy forward impulse toward the stack!
    swing.isDragging = false;
    swing.isArmed = false;
    swing.x = anchor.x + L * Math.sin(peakTheta);
    swing.y = anchor.y + L * Math.cos(peakTheta);
    swing.vx = 4.6;
    swing.vy = 1.0;

    if (ballBodyRef.current) {
      Matter.Body.setPosition(ballBodyRef.current, { x: swing.x, y: swing.y });
    }

    if (cablePathRef.current) {
      cablePathRef.current.setAttribute(
        "d",
        getCablePath(anchor.x, anchor.y, swing.x, swing.y - BALL_TOP_OFFSET, swing.vx, swing.vy, L)
      );
    }

    setSwingsCount((c) => c + 1);
    triggerImpactSparks(swing.x, swing.y, "#38BDF8", 16);
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

    // Restore full dynamic freedom with low gravity & floaty roaming!
    Matter.Body.setStatic(drag.body, false);
    Matter.Sleeping.set(drag.body, false);

    // Exact throw calculation from PhysicsIcons.tsx with floaty power
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

    const anchor = ceilingAnchorRef.current;
    const L = cableLengthRef.current;
    const initialCockedTheta = cockedPeakThetaRef.current;

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

      // Animate badges back to systematic 4 columns
      iconBodiesRef.current.forEach((body, id) => {
        const start = startBadgeStates.get(id);
        const target = systematicPositionsRef.current.get(id);
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

      // Animate swing back to cocked high-left peak
      const curTheta = startSwingTheta + (initialCockedTheta - startSwingTheta) * ease;
      const ballX = anchor.x + L * Math.sin(curTheta);
      const ballY = anchor.y + L * Math.cos(curTheta);

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
          getCablePath(anchor.x, anchor.y, ballX, ballY - BALL_TOP_OFFSET, 0, 0, L)
        );
      }
      if (cableKnotRef.current) {
        cableKnotRef.current.setAttribute("cx", String(ballX));
        cableKnotRef.current.setAttribute("cy", String(ballY - BALL_TOP_OFFSET));
      }

      if (progress < 1) {
        requestAnimationFrame(animateReset);
      } else {
        // Finalize state: Keep dynamic, put to sleep in neat grid until hit or dragged!
        iconBodiesRef.current.forEach((body, id) => {
          const target = systematicPositionsRef.current.get(id);
          if (target) {
            Matter.Body.setPosition(body, target);
            Matter.Body.setAngle(body, 0);
          }
          Matter.Body.setStatic(body, false); // Dynamic!
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
          Matter.Sleeping.set(body, true); // Stable in formation until touched or struck!
        });

        swing.isArmed = true; // Cocked and ready
        swing.isDragging = false;

        isScatteredRef.current = false;
        setIsScattered(false);
        setScatterCount(0);
        setIsResetting(false);
        isResettingRef.current = false;

        triggerImpactSparks(
          arenaSizeRef.current.width * 0.44,
          arenaSizeRef.current.height * 0.6,
          "#10B981",
          28
        );
      }
    };

    requestAnimationFrame(animateReset);
  }, [triggerImpactSparks]);

  return (
    <section
      id="playground"
      className="w-full border-t border-slate-200/80 bg-white dark:bg-transparent transition-colors duration-700 pt-12 md:pt-16 pb-0 overflow-x-hidden"
    >
      {/* Section Heading (Cleanly ABOVE the system arena, outside the box) */}
      <div className="container-narrow px-6 md:px-12 mb-6 md:mb-8">
        <span className="text-sm uppercase tracking-widest text-slate-400 font-medium font-mono">
          The Arsenal
        </span>
        <h2 className="heading-2 mt-2 text-current text-2xl md:text-3xl font-extrabold tracking-tight">
          NOT JUST LOGOS — <span style={{ color: "rgb(71, 36, 0)" }}>PRESSURE TESTED</span>
        </h2>
        <p className="body-large max-w-2xl mt-2 text-current/60 text-base md:text-lg">
          Every tool in this stack was forged through real production constraints.
          Pull the unstretchable swing high to the left and release to test the stack under pressure.
        </p>
      </div>

      {/* Full-width & Full-height Viewport Physics Arena System Box */}
      <div
        ref={containerRef}
        className="relative w-full h-screen min-h-[700px] overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-slate-50/40 select-none touch-none border-y border-slate-200/90 shadow-[inset_0_2px_14px_rgba(0,0,0,0.02)]"
      >
        {/* Subtle Full-Viewport Blueprint Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* The 3 Action Buttons INSIDE the box at Top Right */}
        <div className="absolute top-4 right-4 md:top-10 md:right-8 z-40 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md">
          {/* Status Indicator Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50/90 border border-slate-200/70 text-xs font-medium text-slate-700">
            <span className={`w-2 h-2 rounded-full ${isScattered ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
            <span className="font-mono text-[11px] sm:text-xs">
              {isScattered ? `Demolished (${scatterCount} hits)` : "Systematic Formation"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-[11px] sm:text-xs">Swings: {swingsCount}</span>
          </div>

          {/* Swing Ball Button */}
          <button
            type="button"
            onClick={triggerSwing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Release the heavy swing ball from high left to smash into the stack"
          >
            <MoveRight className="w-3.5 h-3.5" />
            <span>Swing Ball</span>
          </button>

          {/* Rebuild Stack Button */}
          <button
            type="button"
            onClick={handleResetFormation}
            disabled={isResetting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
            <span>Rebuild Stack</span>
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

            {/* Un-stretchable Braided Steel Cable Gradient */}
            <linearGradient id="swing-cable-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Wall mount bracket end-caps spanning full width */}
          <rect
            x={4}
            y={BAR_Y - 7}
            width={12}
            height={20}
            rx={2}
            fill="#475569"
          />
          <rect
            x={dimensions.width - 16}
            y={BAR_Y - 7}
            width={12}
            height={20}
            rx={2}
            fill="#475569"
          />

          {/* The Horizontal Hanging Bar Rod */}
          <rect
            x={12}
            y={BAR_Y - 4}
            width={Math.max(10, dimensions.width - 24)}
            height={8}
            rx={4}
            fill="url(#swing-bar-grad)"
          />
          <line
            x1={18}
            y1={BAR_Y - 2}
            x2={dimensions.width - 18}
            y2={BAR_Y - 2}
            stroke="url(#swing-bar-light)"
            strokeWidth="1.2"
          />

          {/* Anchor Grommet & Bearing on the top rod */}
          <circle
            cx={ceilingAnchor.x}
            cy={BAR_Y + 3}
            r="8"
            fill="#1E293B"
            stroke="#64748B"
            strokeWidth="2.5"
          />
          <circle
            cx={ceilingAnchor.x}
            cy={BAR_Y + 3}
            r="3.5"
            fill="#F8FAFC"
          />

          {/* Flexible Realistic Physics Cable / Hanging String */}
          <path
            ref={cablePathRef}
            d={getCablePath(
              ceilingAnchor.x,
              BAR_Y + 3,
              swingRef.current.x,
              swingRef.current.y - BALL_TOP_OFFSET,
              swingRef.current.vx,
              swingRef.current.vy,
              cableLength
            )}
            fill="none"
            stroke="url(#swing-cable-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.25))",
            }}
          />

          {/* Fastener Ring / Shackle connecting to the ball */}
          <circle
            ref={cableKnotRef}
            cx={swingRef.current.x}
            cy={swingRef.current.y - BALL_TOP_OFFSET}
            r="5"
            fill="#0284C7"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
        </svg>

        {/* Heavy Ball on the Un-stretchable Swing (88px diameter) */}
        <div
          ref={ballDomRef}
          onPointerDown={handleBallPointerDown}
          onPointerUp={handleBallPointerUp}
          onPointerCancel={handleBallPointerUp}
          style={{
            width: `${BALL_RADIUS * 2}px`,
            height: `${BALL_RADIUS * 2}px`,
            touchAction: "none",
          }}
          className="absolute top-0 left-0 rounded-full cursor-grab active:cursor-grabbing z-30 flex items-center justify-center will-change-transform select-none group"
          title="Grab & swing this heavy ball into the stack!"
        >
          {/* Outer Polished Demolition Shell */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 border-[3px] border-slate-300 shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(56,189,248,0.35)] flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 overflow-hidden">
            {/* Radial Bolted Texture */}
            <div className="absolute inset-1 rounded-full border border-dashed border-slate-500/60 pointer-events-none" />

            {/* Centered Next.js Tech Emblem */}
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner z-10 border border-slate-300">
              <Icon
                icon="devicon:nextjs"
                className="w-7 h-7 shrink-0 select-none pointer-events-none drop-shadow-sm text-black"
              />
            </div>

            {/* 3D Specular Sheen */}
            <div className="absolute top-2 left-3 w-6 h-4 rounded-full bg-white/45 rotate-[-30deg] blur-[1px] pointer-events-none" />
          </div>
        </div>

        {/* Dynamic Square Tech Stack Badges (Increased size, floaty roaming physics) */}
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
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              touchAction: "none",
            }}
            className="absolute top-0 left-0 rounded-2xl cursor-grab active:cursor-grabbing z-25 flex items-center justify-center will-change-transform select-none group"
            title={`Drag and toss ${item.name}`}
          >
            <div
              className="w-full h-full rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center p-2.5 transition-all duration-150 group-hover:shadow-md group-hover:scale-105 active:scale-95"
              style={{
                boxShadow: `0 3px 14px ${item.glowColor}`,
              }}
            >
              <Icon
                icon={item.icon}
                className="w-8 h-8 md:w-9 md:h-9 shrink-0 select-none pointer-events-none drop-shadow-sm"
              />
              <span className="text-[10px] md:text-[11px] font-bold text-slate-800 tracking-tight whitespace-nowrap truncate max-w-full pointer-events-none mt-1">
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
