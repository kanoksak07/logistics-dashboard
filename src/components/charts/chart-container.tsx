"use client";

import { useEffect, useRef, useState } from "react";

interface ChartContainerProps {
  height: number;
  children: (width: number, height: number) => React.ReactNode;
  className?: string;
}

export function ChartContainer({ height, children, className }: ChartContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    // Read initial width
    const measure = () => {
      if (ref.current) {
        const w = ref.current.getBoundingClientRect().width;
        if (w > 0) setWidth(Math.floor(w));
      }
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", height }} className={className}>
      {width > 0 && children(width, height)}
    </div>
  );
}
