"use client";

import { useEffect, useRef, useState } from "react";

import { formatMetricValue } from "@/lib/utils/format";

type CountUpProps = {
  value: number;
  format: "currency" | "percent" | "integer";
};

export function CountUp({ value, format }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      window.requestAnimationFrame(() => setDisplayValue(value));
      previousValueRef.current = value;
      return;
    }

    const startValue = previousValueRef.current;
    const duration = 500;
    const startedAt = performance.now();
    let frameId = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(startValue + (value - startValue) * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        previousValueRef.current = value;
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [value]);

  return <>{formatMetricValue(displayValue, format)}</>;
}
