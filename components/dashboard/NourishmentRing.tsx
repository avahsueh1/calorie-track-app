"use client";

import type { DailySummaryDisplay } from "../../types/wellness";
import { colors, formatNumber, sans, serif } from "./theme";

interface NourishmentRingProps {
  summary: Pick<DailySummaryDisplay, "eaten" | "tdee" | "remaining">;
}

const RING_SIZE = 240;
const RING_INNER = 188;
const STROKE_WIDTH = 15;
const RING_BASE = "#EDE7DF";
const RING_GRADIENT_START = "#E8B8A8";
const RING_GRADIENT_END = "#CE9482";
const PEACH_ACCENT = "#D9A389";

function RingSunriseBackdrop() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 -20px -4px",
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 72% 58% at 50% 62%, rgba(247, 239, 234, 0.92) 0%, rgba(247, 239, 234, 0) 72%),
            radial-gradient(ellipse 48% 40% at 28% 38%, rgba(244, 240, 250, 0.75) 0%, rgba(244, 240, 250, 0) 68%)
          `,
        }}
      />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 168 168"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.55,
        }}
      >
        <ellipse
          cx="84"
          cy="118"
          rx="72"
          ry="28"
          fill="url(#ring-arch-gradient)"
        />
        <defs>
          <radialGradient id="ring-arch-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F7EFEA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F4F0FA" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </>
  );
}

export function NourishmentRing({ summary }: NourishmentRingProps) {
  const ringPercent =
    summary.tdee > 0
      ? Math.min(Math.round((summary.eaten / summary.tdee) * 100), 100)
      : 0;

  const radius = (RING_SIZE - STROKE_WIDTH) / 2;
  const center = RING_SIZE / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ringPercent / 100;
  const dashOffset = circumference * (1 - progress);
  const showEndpoint = ringPercent > 2 && ringPercent < 100;
  const endpointAngle = -Math.PI / 2 + 2 * Math.PI * progress;
  const endpointX = center + radius * Math.cos(endpointAngle);
  const endpointY = center + radius * Math.sin(endpointAngle);

  const phaseMarkerAngles = [0.25, 0.5, 0.75];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${RING_SIZE}px`,
          height: `${RING_SIZE}px`,
        }}
      >
        <RingSunriseBackdrop />

        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          aria-hidden="true"
          style={{ display: "block", position: "relative", zIndex: 1 }}
        >
          <defs>
            <linearGradient
              id="nourishment-ring-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={RING_GRADIENT_START} />
              <stop offset="100%" stopColor={RING_GRADIENT_END} />
            </linearGradient>
          </defs>

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={RING_BASE}
            strokeWidth={STROKE_WIDTH}
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E8DDD4"
            strokeWidth={STROKE_WIDTH - 6}
            strokeDasharray="3 7"
            strokeLinecap="round"
            opacity={0.55}
            transform={`rotate(-90 ${center} ${center})`}
          />

          {ringPercent > 0 ? (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#nourishment-ring-gradient)"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${center} ${center})`}
            />
          ) : (
            <line
              x1={center}
              y1={center - radius + STROKE_WIDTH / 2}
              x2={center}
              y2={center - radius + STROKE_WIDTH / 2 + 10}
              stroke={PEACH_ACCENT}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          )}

          {phaseMarkerAngles.map((fraction) => {
            const angle = -Math.PI / 2 + 2 * Math.PI * fraction;
            const mx = center + radius * Math.cos(angle);
            const my = center + radius * Math.sin(angle);
            return (
              <circle
                key={fraction}
                cx={mx}
                cy={my}
                r={2}
                fill="#D9C8BC"
                opacity={0.85}
              />
            );
          })}

          {showEndpoint ? (
            <circle
              cx={endpointX}
              cy={endpointY}
              r={4}
              fill={RING_GRADIENT_END}
              stroke="#FFF8F4"
              strokeWidth={2}
            />
          ) : null}
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: `${RING_INNER}px`,
              height: `${RING_INNER}px`,
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "8px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: serif,
                fontSize: "2.5rem",
                fontWeight: 400,
                color: colors.text,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {formatNumber(summary.remaining)}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: colors.muted,
                fontFamily: sans,
                letterSpacing: "0.01em",
              }}
            >
              kcal left
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
