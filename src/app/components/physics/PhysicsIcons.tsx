"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { Icon } from "@iconify/react";

export interface PhysicsIconItem {
  id: string;
  icon: string;
  label?: string;
  shape?: "pure" | "circle" | "square" | "rectangle" | "pill";
  size?: number; // Size of icon in px
  radius?: number; // Physics body radius in px for circular items
  width?: number; // Width of container in px for square/rectangle
  height?: number; // Height of container in px for square/rectangle
  color?: string;
  bg?: string;
  borderColor?: string;
  className?: string;
}

export interface PhysicsIconsProps {
  items: PhysicsIconItem[];
  gravity?: number;
  bounce?: number;
  friction?: number;
  frictionAir?: number;
  className?: string;
  itemClassName?: string;
  throwPower?: number;
  disabled?: boolean;
  showHint?: boolean;
  hintText?: string;
}

export default function PhysicsIcons({
  items,
  gravity = 0.9,
  bounce = 0.72,
  friction = 0.06,
  frictionAir = 0.014,
  className = "",
  itemClassName = "",
  throwPower = 1.2,
  disabled = false,
  showHint = true,
  hintText = "Interactive · Drag & Toss Icons",
}: PhysicsIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Matter.js references
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const wallsRef = useRef<{
    left: Matter.Body;
    right: Matter.Body;
    bottom: Matter.Body;
  } | null>(null);

  // Drag interaction state
  const dragRef = useRef<{
    id: string;
    body: Matter.Body;
    pointerId: number;
    offsetX: number;
    offsetY: number;
    history: { x: number; y: number; time: number }[];
  } | null>(null);

  // Reduced motion detection
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Main Matter.js initialization and lifecycle
  useEffect(() => {
    if (!mounted || reducedMotion || disabled || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Create Matter.js Engine
    const engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: gravity * 0.9,
        scale: 0.001,
      },
    });
    engineRef.current = engine;

    const world = engine.world;
    const WALL_THICKNESS = 140;
    const WALL_SPAN = Math.max(3000, width + 1000);

    // Boundary walls:
    // Left, Right, Bottom
    const bottomWall = Matter.Bodies.rectangle(
      width / 2,
      height + WALL_THICKNESS / 2 - 10,
      WALL_SPAN,
      WALL_THICKNESS,
      {
        isStatic: true,
        restitution: bounce,
        friction,
        label: "wall-bottom",
      }
    );

    const leftWall = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      height / 2 - 500,
      WALL_THICKNESS,
      height + 1600,
      {
        isStatic: true,
        restitution: bounce,
        friction,
        label: "wall-left",
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      width + WALL_THICKNESS / 2,
      height / 2 - 500,
      WALL_THICKNESS,
      height + 1600,
      {
        isStatic: true,
        restitution: bounce,
        friction,
        label: "wall-right",
      }
    );

    wallsRef.current = { left: leftWall, right: rightWall, bottom: bottomWall };
    Matter.Composite.add(world, [bottomWall, leftWall, rightWall]);

    // Create physics bodies
    const bodies = new Map<string, Matter.Body>();
    const cols = Math.max(3, Math.floor(width / 130));

    items.forEach((item, index) => {
      const shape = item.shape || (item.label ? "pill" : "circle");
      const isPill = shape === "pill" && !!item.label;
      const el = itemRefs.current.get(item.id);

      let body: Matter.Body;

      // Distribute spawn positions horizontally across upper area
      const col = index % cols;
      const row = Math.floor(index / cols);
      const spacingX = (width - 60) / Math.max(1, cols);
      const spawnX = Math.max(
        50,
        Math.min(
          width - 50,
          35 + col * spacingX + (Math.random() - 0.5) * 24
        )
      );
      const spawnY = -40 - row * 70 + (Math.random() - 0.5) * 20;

      if (isPill) {
        const itemW = el?.offsetWidth || 116;
        const itemH = el?.offsetHeight || 38;
        body = Matter.Bodies.rectangle(spawnX, spawnY, itemW, itemH, {
          chamfer: { radius: Math.min(itemW, itemH) / 2 },
          restitution: bounce,
          friction,
          frictionAir,
          density: 0.002,
          angle: (Math.random() - 0.5) * 0.35,
          label: `icon-${item.id}`,
        });
      } else if (shape === "circle") {
        const radius = item.radius || (item.size ? Math.round(item.size / 2) : 54);
        body = Matter.Bodies.circle(spawnX, spawnY, radius, {
          restitution: bounce,
          friction,
          frictionAir,
          density: 0.0024,
          angle: (Math.random() - 0.5) * 0.5,
          label: `icon-${item.id}`,
        });
      } else if (shape === "square") {
        const size = item.width || item.height || item.size || 104;
        body = Matter.Bodies.rectangle(spawnX, spawnY, size, size, {
          chamfer: { radius: 20 },
          restitution: bounce,
          friction,
          frictionAir,
          density: 0.0024,
          angle: (Math.random() - 0.5) * 0.4,
          label: `icon-${item.id}`,
        });
      } else if (shape === "rectangle") {
        const itemW = item.width || 116;
        const itemH = item.height || 72;
        body = Matter.Bodies.rectangle(spawnX, spawnY, itemW, itemH, {
          chamfer: { radius: 18 },
          restitution: bounce,
          friction,
          frictionAir,
          density: 0.0024,
          angle: (Math.random() - 0.5) * 0.35,
          label: `icon-${item.id}`,
        });
      } else {
        const radius = 54;
        body = Matter.Bodies.circle(spawnX, spawnY, radius, {
          restitution: bounce,
          friction,
          frictionAir,
          density: 0.0024,
          label: `icon-${item.id}`,
        });
      }

      // Initial playful nudge
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1.6,
        y: Math.random() * 2 + 1.2,
      });

      bodies.set(item.id, body);
    });

    bodiesRef.current = bodies;
    Matter.Composite.add(world, Array.from(bodies.values()));

    // High performance render loop: direct DOM transform updates
    let isFirstUpdate = true;
    const afterUpdateHandler = () => {
      bodies.forEach((body, id) => {
        if (dragRef.current?.id === id) return;

        const el = itemRefs.current.get(id);
        if (!el) return;

        const { x, y } = body.position;
        const angle = body.angle;

        el.style.transform = `translate3d(${x}px, ${y}px, 0px) translate(-50%, -50%) rotate(${angle}rad)`;

        if (isFirstUpdate) {
          el.style.opacity = "1";
        }

        // Respawn if escaped
        if (y > height + 250) {
          Matter.Body.setPosition(body, {
            x: Math.max(50, Math.min(width - 50, x)),
            y: 30,
          });
          Matter.Body.setVelocity(body, { x: 0, y: 1 });
        }
      });
      isFirstUpdate = false;
    };

    Matter.Events.on(engine, "afterUpdate", afterUpdateHandler);

    // Start physics runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth <= 50 || newHeight <= 50) continue;

        if (wallsRef.current) {
          Matter.Body.setPosition(wallsRef.current.bottom, {
            x: newWidth / 2,
            y: newHeight + WALL_THICKNESS / 2 - 10,
          });
          Matter.Body.setPosition(wallsRef.current.left, {
            x: -WALL_THICKNESS / 2,
            y: newHeight / 2 - 500,
          });
          Matter.Body.setPosition(wallsRef.current.right, {
            x: newWidth + WALL_THICKNESS / 2,
            y: newHeight / 2 - 500,
          });
        }

        bodies.forEach((body) => {
          if (body.position.x > newWidth - 30) {
            Matter.Body.setPosition(body, {
              x: newWidth - 40,
              y: body.position.y,
            });
          }
        });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      Matter.Events.off(engine, "afterUpdate", afterUpdateHandler);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      Matter.Composite.clear(world, false, true);
      engineRef.current = null;
      runnerRef.current = null;
      bodiesRef.current.clear();
      wallsRef.current = null;
    };
  }, [mounted, reducedMotion, disabled, gravity, bounce, friction, frictionAir, items]);

  // Pointer event handlers for grabbing, dragging & throwing with zero jump
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, id: string) => {
      if (disabled || reducedMotion || !containerRef.current) return;

      const body = bodiesRef.current.get(id);
      if (!body) return;

      e.preventDefault();
      e.stopPropagation();

      const targetEl = e.currentTarget;
      targetEl.setPointerCapture(e.pointerId);

      const rect = containerRef.current.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      dragRef.current = {
        id,
        body,
        pointerId: e.pointerId,
        offsetX: pointerX - body.position.x,
        offsetY: pointerY - body.position.y,
        history: [{ x: pointerX, y: pointerY, time: performance.now() }],
      };

      setHasInteracted(true);

      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      Matter.Body.setStatic(body, true);
    },
    [disabled, reducedMotion]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || !containerRef.current) return;

      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      const newX = pointerX - drag.offsetX;
      const newY = pointerY - drag.offsetY;

      Matter.Body.setPosition(drag.body, { x: newX, y: newY });

      const el = itemRefs.current.get(drag.id);
      if (el) {
        el.style.transform = `translate3d(${newX}px, ${newY}px, 0px) translate(-50%, -50%) rotate(${drag.body.angle}rad)`;
      }

      const now = performance.now();
      drag.history.push({ x: pointerX, y: pointerY, time: now });
      drag.history = drag.history.filter((p) => now - p.time <= 120);
    },
    []
  );

  const handlePointerUpOrCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}

      Matter.Body.setStatic(drag.body, false);

      if (drag.history.length >= 2) {
        const first = drag.history[0];
        const last = drag.history[drag.history.length - 1];
        const dt = Math.max(1, last.time - first.time);

        let vx = ((last.x - first.x) / dt) * 16 * throwPower;
        let vy = ((last.y - first.y) / dt) * 16 * throwPower;

        const maxVelocity = 28;
        vx = Math.max(-maxVelocity, Math.min(maxVelocity, vx));
        vy = Math.max(-maxVelocity, Math.min(maxVelocity, vy));

        if (Math.abs(vx) < 1.2 && Math.abs(vy) < 1.2) {
          vx = (Math.random() - 0.5) * 5;
          vy = -(Math.random() * 6 + 7);
        }

        Matter.Body.setVelocity(drag.body, { x: vx, y: vy });
        Matter.Body.setAngularVelocity(drag.body, (vx / 20) * 0.12);
      } else {
        Matter.Body.setVelocity(drag.body, {
          x: (Math.random() - 0.5) * 5,
          y: -(Math.random() * 6 + 7),
        });
        Matter.Body.setAngularVelocity(drag.body, (Math.random() - 0.5) * 0.1);
      }

      dragRef.current = null;
    },
    [throwPower]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const body = bodiesRef.current.get(id);
        if (body) {
          Matter.Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 6,
            y: -10,
          });
          Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
        }
      }
    },
    []
  );

  if (reducedMotion) {
    return (
      <div
        className={`flex flex-wrap items-center justify-center gap-4 p-4 ${className}`}
        aria-label="Technology and engineering stack"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-center p-2 rounded-2xl bg-white/80 border border-slate-200 shadow-sm"
            title={item.label || item.id}
          >
            <Icon
              icon={item.icon}
              width={item.size || 52}
              height={item.height || item.size || 52}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      aria-label="Interactive floating technology icons. Drag and toss them around!"
    >
      {/* Interactive hint badge */}
      {showHint && !hasInteracted && (
        <div className="absolute top-4 right-4 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-sm pointer-events-none transition-opacity duration-300">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span>{hintText}</span>
        </div>
      )}

      {items.map((item) => {
        const shape = item.shape || (item.label ? "pill" : "circle");
        const isPill = shape === "pill" && !!item.label;
        const radius = item.radius || (item.size ? Math.round(item.size / 2) : 38);
        const w = shape === "circle" ? radius * 2 : item.width || item.size || 76;
        const h = shape === "circle" ? radius * 2 : item.height || item.size || 76;

        return (
          <div
            key={item.id}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(item.id, el);
              } else {
                itemRefs.current.delete(item.id);
              }
            }}
            onPointerDown={(e) => handlePointerDown(e, item.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrCancel}
            onPointerCancel={handlePointerUpOrCancel}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            tabIndex={0}
            role="button"
            aria-label={`${item.label || item.id} icon. Drag or press Space to toss.`}
            className={`absolute top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing will-change-transform touch-none select-none opacity-0 ${
              isPill
                ? "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                : "flex items-center justify-center bg-transparent border-0 outline-none p-0"
            } ${itemClassName} ${item.className || ""}`}
            style={
              isPill
                ? {
                    borderColor: item.borderColor || "rgba(226, 232, 240, 0.9)",
                    boxShadow: "0 4px 12px -2px rgba(15, 23, 42, 0.08)",
                  }
                : {
                    width: `${w}px`,
                    height: `${h}px`,
                  }
            }
          >
            {isPill ? (
              <>
                <div
                  className="flex items-center justify-center rounded-full p-0.5 shrink-0 pointer-events-none"
                  style={{ backgroundColor: item.bg || "transparent" }}
                >
                  <Icon
                    icon={item.icon}
                    width={item.size || 20}
                    height={item.size || 20}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-800 whitespace-nowrap tracking-tight pointer-events-none">
                  {item.label}
                </span>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full pointer-events-none">
                <Icon
                  icon={item.icon}
                  width={item.width || item.size || 108}
                  height={item.height || item.size || 108}
                  className="shrink-0 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] select-none pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
