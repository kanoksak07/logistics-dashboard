"use client";

interface CostDonutProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#1B4332", "#40916C", "#74C69D", "#B7E4C7"];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
  const s1 = polarToCartesian(cx, cy, outerR, startAngle);
  const e1 = polarToCartesian(cx, cy, outerR, endAngle);
  const s2 = polarToCartesian(cx, cy, innerR, endAngle);
  const e2 = polarToCartesian(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

export function CostDonut({ data }: CostDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 110;
  const cy = 90;
  const outerR = 72;
  const innerR = 46;
  const gap = 2; // degrees gap between slices

  let current = 0;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 360;
    const start = current + gap / 2;
    const end = current + sweep - gap / 2;
    current += sweep;
    return { ...d, start, end, color: COLORS[i % COLORS.length] };
  });

  return (
    <div style={{ height: 220 }} className="flex items-center">
      {/* SVG donut */}
      <svg width={220} height={180} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path key={i} d={arcPath(cx, cy, outerR, innerR, s.start, s.end)} fill={s.color} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={11} fill="#6B7280">ต้นทุน</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={13} fontWeight="600" fill="#1A1A1A">
          {(total / 1000).toFixed(1)}K
        </text>
        <text x={cx} y={cy + 25} textAnchor="middle" fontSize={10} fill="#9CA3AF">บาท</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2 ml-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <div>
              <div className="text-xs text-[#374151] leading-tight">{d.name}</div>
              <div className="text-xs text-[#9CA3AF]">{((d.value / total) * 100).toFixed(0)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
