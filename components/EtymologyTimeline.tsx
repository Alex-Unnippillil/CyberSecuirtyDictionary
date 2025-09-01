import React from "react";

interface TimelineEvent {
  date: string;
  label: string;
}

interface EtymologyTimelineProps {
  originLanguage: string;
  events: TimelineEvent[];
  width?: number;
  height?: number;
}

const EtymologyTimeline: React.FC<EtymologyTimelineProps> = ({
  originLanguage,
  events,
  width = 600,
  height = 120,
}) => {
  const timelineY = height / 2;
  const xStart = 50;
  const xEnd = width - 50;
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const step = sorted.length > 0 ? (xEnd - xStart) / sorted.length : 0;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <line
        x1={xStart}
        y1={timelineY}
        x2={xEnd}
        y2={timelineY}
        stroke="#999"
        strokeWidth={2}
      />
      <circle cx={xStart} cy={timelineY} r={5} fill="#555" />
      <text x={xStart} y={timelineY - 10} textAnchor="start" fontSize={12}>
        {originLanguage}
      </text>
      {sorted.map((evt, i) => {
        const x = xStart + (i + 1) * step;
        return (
          <g key={i}>
            <circle cx={x} cy={timelineY} r={5} fill="#0055aa" />
            <text x={x} y={timelineY + 20} textAnchor="middle" fontSize={12}>
              {evt.date}
            </text>
            <text x={x} y={timelineY + 35} textAnchor="middle" fontSize={10}>
              {evt.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default EtymologyTimeline;
