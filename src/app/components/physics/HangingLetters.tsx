"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface LetterConfig {
  char: string;
  restLength: number;
  color: string;
  glowColor: string;
}

// 9 Letters: D E V A S H I S H with vivid, colorful palette
const LETTERS: LetterConfig[] = [
  { char: "D", restLength: 100, color: "#EF4444", glowColor: "rgba(239, 68, 68, 0.5)" },   // Red
  { char: "E", restLength: 160, color: "#EAB308", glowColor: "rgba(234, 179, 8, 0.5)" },   // Yellow
  { char: "V", restLength: 225, color: "#2563EB", glowColor: "rgba(37, 99, 235, 0.5)" },   // Blue
  { char: "A", restLength: 290, color: "#10B981", glowColor: "rgba(16, 185, 129, 0.5)" },  // Green
  { char: "S", restLength: 200, color: "#F97316", glowColor: "rgba(249, 115, 22, 0.5)" },  // Orange
  { char: "H", restLength: 260, color: "#8B5CF6", glowColor: "rgba(139, 92, 246, 0.5)" },  // Purple
  { char: "I", restLength: 130, color: "#06B6D4", glowColor: "rgba(6, 182, 212, 0.5)" },   // Cyan
  { char: "S", restLength: 185, color: "#EC4899", glowColor: "rgba(236, 72, 153, 0.5)" },  // Pink
  { char: "H", restLength: 245, color: "#14B8A6", glowColor: "rgba(20, 184, 166, 0.5)" },  // Teal
];

const BAR_Y = 16; // Top mounting rod vertical position (pure bar at the top)
const LETTER_TOP_OFFSET = 18; // Distance from letter center to string attachment point

interface LetterState {
  char: string;
  color: string;
  glowColor: string;
  anchorX: number;
  anchorY: number;
  restLength: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  isDragging: boolean;
}

export default function HangingLetters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lettersRef = useRef<LetterState[]>([]);
  const isInteractingRef = useRef<boolean>(false);
  const dragTargetRef = useRef<number | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevPointerPos = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 440, height: 390 });
  const [, setRenderTrigger] = useState(0);

  // Initialize or re-layout letters when container dimensions change
  const setupLetters = useCallback((width: number, height: number) => {
    const paddingX = Math.max(20, width * 0.065);
    const usableWidth = width - paddingX * 2;
    const step = usableWidth / (LETTERS.length - 1);

    // Scale resting lengths to fit container
    const heightScale = Math.min(1.06, Math.max(0.72, (height - 40) / 360));

    const newLetters: LetterState[] = LETTERS.map((item, index) => {
      const anchorX = paddingX + index * step;
      const anchorY = BAR_Y;
      const scaledRestLength = Math.round(item.restLength * heightScale);
      const existing = lettersRef.current[index];

      return {
        char: item.char,
        color: item.color,
        glowColor: item.glowColor,
        anchorX,
        anchorY,
        restLength: scaledRestLength,
        x: existing ? existing.x : anchorX,
        y: existing ? existing.y : anchorY + scaledRestLength,
        vx: existing ? existing.vx : 0,
        vy: existing ? existing.vy : 0,
        angle: existing ? existing.angle : 0,
        vAngle: existing ? existing.vAngle : 0,
        isDragging: false,
      };
    });

    lettersRef.current = newLetters;
  }, []);

  // ResizeObserver to keep letter anchors responsive
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
          setupLetters(width, height);
          wakeSimulation();
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [setupLetters]);

  // Rubber Physics Simulation loop
  const stepPhysics = useCallback(() => {
    let totalKineticEnergy = 0;
    const letters = lettersRef.current;

    for (let i = 0; i < letters.length; i++) {
      const l = letters[i];

      if (l.isDragging) {
        // While dragging, compute natural tilt angle toward anchor
        const dx = l.x - l.anchorX;
        const dy = Math.max(12, l.y - l.anchorY);
        const targetAngle = Math.atan2(dx, dy) * (180 / Math.PI);
        l.angle += (Math.max(-55, Math.min(55, targetAngle)) - l.angle) * 0.28;
        totalKineticEnergy += 8;
        continue;
      }

      // Distance from anchor
      const dx = l.x - l.anchorX;
      const dy = l.y - l.anchorY;
      const dist = Math.hypot(dx, dy);
      const normX = dx / Math.max(0.1, dist);
      const normY = dy / Math.max(0.1, dist);

      let ax = 0;
      let ay = 0;

      // Realistic Rubber Band Tension Model:
      // Tension pulls back toward anchor with progressive elasticity
      if (dist > l.restLength) {
        const stretch = dist - l.restLength;
        const tensionForce = Math.min(26, 0.072 * stretch + 0.00016 * stretch * stretch);
        ax += -tensionForce * normX;
        ay += -tensionForce * normY;
      }

      // Gravity pulls downward
      ay += 0.44;

      // Pendulum centering toward vertical axis under anchor
      const pendulumTorque = -(l.x - l.anchorX) * 0.016;
      ax += pendulumTorque;

      // High elastic rebound damping (juicy rubber recoil)
      const damping = 0.935;
      l.vx = (l.vx + ax) * damping;
      l.vy = (l.vy + ay) * damping;

      // Cap maximum velocity for smooth physical recoil on extreme stretches
      const speed = Math.hypot(l.vx, l.vy);
      const maxSpeed = 34;
      if (speed > maxSpeed) {
        l.vx = (l.vx / speed) * maxSpeed;
        l.vy = (l.vy / speed) * maxSpeed;
      }

      l.x += l.vx;
      l.y += l.vy;

      // Bounce gently if snapping upward into the top mounting rod
      if (l.y < l.anchorY + 8) {
        l.y = l.anchorY + 8;
        if (l.vy < 0) {
          l.vy = -l.vy * 0.38;
        }
      }

      // Angular sway simulation (letter swings with pendulum motion)
      const curDx = l.x - l.anchorX;
      const curDy = Math.max(12, l.y - l.anchorY);
      const targetAngle = Math.atan2(curDx, curDy) * (180 / Math.PI);
      const clampedAngle = Math.max(-50, Math.min(50, targetAngle));
      const angleAccel = (clampedAngle - l.angle) * 0.14;

      l.vAngle = Math.max(-18, Math.min(18, (l.vAngle + angleAccel) * 0.90));
      l.angle += l.vAngle;

      // Kinetic energy measure to sleep when settled
      const restY = l.anchorY + l.restLength;
      const energy = l.vx * l.vx + l.vy * l.vy + (l.x - l.anchorX) * (l.x - l.anchorX) + (l.y - restY) * (l.y - restY) + Math.abs(l.angle);
      totalKineticEnergy += energy;
    }

    // Force re-render for smooth 60/120fps animation
    setRenderTrigger((prev) => (prev + 1) % 100000);

    // Keep loop active until settled or while user is interacting
    if (totalKineticEnergy > 0.05 || isInteractingRef.current) {
      animFrameRef.current = requestAnimationFrame(stepPhysics);
    } else {
      // Clean rest settle
      for (const l of letters) {
        l.x = l.anchorX;
        l.y = l.anchorY + l.restLength;
        l.vx = 0;
        l.vy = 0;
        l.angle = 0;
        l.vAngle = 0;
      }
      animFrameRef.current = null;
    }
  }, []);

  const wakeSimulation = useCallback(() => {
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(stepPhysics);
    }
  }, [stepPhysics]);

  // Update dragged letter position governed purely by rubber stretch allowance, NO boundary box
  const updateDragPosition = useCallback((clientX: number, clientY: number) => {
    if (dragTargetRef.current === null) return;
    const letter = lettersRef.current[dragTargetRef.current];
    if (!letter) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;

    const now = performance.now();
    const dt = Math.max(1, now - prevPointerPos.current.time);
    prevPointerPos.current = { x: pointerX, y: pointerY, time: now };

    const rawX = pointerX + dragOffsetRef.current.x;
    const rawY = pointerY + dragOffsetRef.current.y;

    const anchorX = letter.anchorX;
    const anchorY = letter.anchorY;

    // Vector from anchor to drag target
    const dx = rawX - anchorX;
    // Keep letter below the mounting bar
    const dy = Math.max(8, rawY - anchorY);
    const dist = Math.hypot(dx, dy);

    // Full stretchable physical allowance of the rubber string:
    // Generous elastic range (at least 580px or ~3.8x rest length)
    // Completely unconstrained by any container boundary box!
    const maxStretchAllowance = Math.max(580, letter.restLength * 3.8);

    if (dist <= maxStretchAllowance) {
      // Free stretch within full allowance in any direction (down, left, right, diagonally)
      letter.x = rawX;
      letter.y = anchorY + dy;
    } else {
      // Smooth physical rubber resistance when stretching past the elastic allowance
      const excess = dist - maxStretchAllowance;
      const softenedDist = maxStretchAllowance + Math.pow(excess, 0.72) * 2.4;
      const scale = softenedDist / dist;
      letter.x = anchorX + dx * scale;
      letter.y = anchorY + dy * scale;
    }

    if (!animFrameRef.current) {
      wakeSimulation();
    }
  }, [wakeSimulation]);

  // Finish dragging and apply flick impulse
  const finishDrag = useCallback((clientX?: number, clientY?: number) => {
    if (dragTargetRef.current === null) return;
    const index = dragTargetRef.current;
    const letter = lettersRef.current[index];

    if (letter) {
      letter.isDragging = false;
      const now = performance.now();
      const dt = Math.max(1, now - prevPointerPos.current.time);

      if (clientX !== undefined && clientY !== undefined && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const curPx = clientX - rect.left;
        const curPy = clientY - rect.top;
        const flickVx = ((curPx - prevPointerPos.current.x) / dt) * 12;
        const flickVy = ((curPy - prevPointerPos.current.y) / dt) * 12;

        letter.vx = Math.max(-24, Math.min(24, flickVx));
        letter.vy = Math.max(-24, Math.min(24, flickVy));
      }
    }

    dragTargetRef.current = null;
    isInteractingRef.current = false;
    wakeSimulation();
  }, [wakeSimulation]);

  // Window-level listeners while dragging to allow seamless stretching across the entire screen
  useEffect(() => {
    const onWindowPointerMove = (e: PointerEvent) => {
      if (dragTargetRef.current === null) return;
      updateDragPosition(e.clientX, e.clientY);
    };

    const onWindowPointerUp = (e: PointerEvent) => {
      if (dragTargetRef.current === null) return;
      finishDrag(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
  }, [updateDragPosition, finishDrag]);

  // Pointer Down on bare letter (Grab)
  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const letter = lettersRef.current[index];
    if (!letter) return;

    dragTargetRef.current = index;
    isInteractingRef.current = true;
    letter.isDragging = true;
    letter.vx = 0;
    letter.vy = 0;

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      dragOffsetRef.current = {
        x: letter.x - pointerX,
        y: letter.y - pointerY,
      };
      prevPointerPos.current = { x: pointerX, y: pointerY, time: performance.now() };
    }

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback
    }

    wakeSimulation();
  };

  // Pointer Move on container (Hover strumming or active drag fallback)
  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (dragTargetRef.current !== null) {
      updateDragPosition(e.clientX, e.clientY);
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const now = performance.now();
    const dt = Math.max(1, now - prevPointerPos.current.time);
    const pointerVx = ((pointerX - prevPointerPos.current.x) / dt) * 16;
    const pointerVy = ((pointerY - prevPointerPos.current.y) / dt) * 16;

    prevPointerPos.current = { x: pointerX, y: pointerY, time: now };

    // Hover strumming (swiping past letters twangs them like rubber bands)
    let touchedAny = false;
    for (let i = 0; i < lettersRef.current.length; i++) {
      const l = lettersRef.current[i];
      const distToLetter = Math.hypot(l.x - pointerX, l.y - pointerY);

      if (distToLetter < 38) {
        const impulseX = Math.max(-14, Math.min(14, pointerVx * 0.45));
        const impulseY = Math.max(-8, Math.min(12, pointerVy * 0.35));
        l.vx += impulseX;
        l.vy += Math.abs(impulseY);
        touchedAny = true;
      }
    }

    if (touchedAny) {
      wakeSimulation();
    }
  };

  // Pointer Up (Rubber snap-back)
  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Safe ignore
    }
    finishDrag(e.clientX, e.clientY);
  };

  // Keyboard accessibility
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const letter = lettersRef.current[index];
    if (!letter) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      letter.vy += 20;
      wakeSimulation();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      letter.vy -= 18;
      wakeSimulation();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      letter.vx -= 16;
      wakeSimulation();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      letter.vx += 16;
      wakeSimulation();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      letter.vy += 26;
      wakeSimulation();
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none bg-transparent">
      {/* Main Interactive Hanging Letters Apparatus Container (Only the Bar and Hanging Letters, No extra tags/buttons) */}
      <div
        ref={containerRef}
        onPointerMove={handleContainerPointerMove}
        className="relative w-full h-[380px] sm:h-[400px] md:h-[420px] touch-none bg-transparent overflow-visible"
        aria-label="Interactive hanging letters for DEVASHISH. Grab and pull to stretch."
      >
        {/* SVG Layer: Top Horizontal Bar, Mounting Notches, and Elastic Rubber Strings */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Top rod subtle metallic gradient */}
            <linearGradient id="hanging-bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="40%" stopColor="#1E293B" />
              <stop offset="80%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Rod highlight reflection */}
            <linearGradient id="hanging-bar-light" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.65)" />
              <stop offset="75%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Wall mount bracket end-caps */}
          <rect
            x={4}
            y={BAR_Y - 7}
            width={10}
            height={18}
            rx={2}
            fill="#334155"
          />
          <rect
            x={dimensions.width - 14}
            y={BAR_Y - 7}
            width={10}
            height={18}
            rx={2}
            fill="#334155"
          />

          {/* The Horizontal Hanging Bar Rod */}
          <rect
            x={10}
            y={BAR_Y - 4}
            width={Math.max(10, dimensions.width - 20)}
            height={8}
            rx={4}
            fill="url(#hanging-bar-grad)"
          />
          {/* Light reflection on the top rod */}
          <line
            x1={16}
            y1={BAR_Y - 2}
            x2={dimensions.width - 16}
            y2={BAR_Y - 2}
            stroke="url(#hanging-bar-light)"
            strokeWidth="1.2"
          />

          {/* Flexible Rubber Strings and Anchors */}
          {lettersRef.current.map((letter, index) => {
            const anchorX = letter.anchorX;
            const anchorY = BAR_Y + 4;
            // String connects directly to the top edge of the letter glyph
            const targetX = letter.x;
            const targetY = letter.y - LETTER_TOP_OFFSET;

            // Distance & stretch calculation
            const dx = targetX - anchorX;
            const dy = targetY - anchorY;
            const dist = Math.hypot(dx, dy);
            const stretchRatio = dist / letter.restLength;

            // Rubber flexibility:
            // When slack, rubber sags downward; when moving, bows with velocity
            const sag = Math.max(0, (1 - stretchRatio) * 28);
            const velocityFlexX = -letter.vx * 0.35;
            const velocityFlexY = -letter.vy * 0.2;

            const midX = (anchorX + targetX) / 2 + velocityFlexX;
            const midY = (anchorY + targetY) / 2 + sag + velocityFlexY;

            // Curved elastic string path
            const pathData = `M ${anchorX} ${anchorY} Q ${midX} ${midY} ${targetX} ${targetY}`;

            // Rubber band dynamic thickness:
            // Stretched rubber thins out (~1.15px); slack rubber thickens (~2.8px)
            const strokeWidth = Math.max(1.15, Math.min(2.8, 2.2 / Math.sqrt(Math.max(0.45, stretchRatio))));

            // Rubber string color
            const strokeColor = letter.isDragging
              ? letter.color
              : stretchRatio > 1.25
              ? "#1E293B"
              : "#64748B";

            return (
              <g key={`rubber-string-${index}`}>
                {/* Anchor Grommet on the top bar */}
                <circle
                  cx={anchorX}
                  cy={BAR_Y + 3}
                  r="3"
                  fill="#0F172A"
                  stroke="#64748B"
                  strokeWidth="1"
                />

                {/* The Flexible Rubber String */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  className="transition-[stroke] duration-100"
                />

                {/* Tiny rubber knot tying onto the top of the bare letter in letter's color */}
                <circle
                  cx={targetX}
                  cy={targetY}
                  r="2.5"
                  fill={letter.color}
                />
              </g>
            );
          })}
        </svg>

        {/* Direct Hanging Letters (NO circle! Bare colorful typographic glyphs hanging directly from strings) */}
        {lettersRef.current.map((letter, index) => {
          const isDragged = letter.isDragging;

          return (
            <div
              key={`letter-direct-${index}`}
              tabIndex={0}
              role="button"
              aria-label={`Letter ${letter.char}. Pull or grab to stretch rubber string.`}
              onPointerDown={(e) => handlePointerDown(index, e)}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={(e) => handleKeyDown(index, e)}
              style={{
                transform: `translate3d(${letter.x - 22}px, ${letter.y - 24}px, 0px) rotate(${letter.angle}deg) scale(${isDragged ? 1.25 : 1})`,
                touchAction: "none",
                zIndex: isDragged ? 50 : 20,
              }}
              className="absolute top-0 left-0 w-11 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing select-none will-change-transform group"
            >
              {/* Bare Letter Glyph hanging directly on string with its unique vibrant color */}
              <span
                className="font-medieval-sharp text-3xl sm:text-4xl md:text-[42px] font-extrabold uppercase leading-none select-none pointer-events-none transition-all duration-150 group-hover:scale-110"
                style={{
                  fontFamily: "var(--font-medieval-sharp), serif",
                  lineHeight: 1,
                  color: letter.color,
                  filter: isDragged
                    ? `drop-shadow(0 8px 18px ${letter.glowColor})`
                    : `drop-shadow(0 2px 5px rgba(0,0,0,0.12))`,
                }}
              >
                {letter.char}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
