import { useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "../../Estilo/donut-chart.module.css";

const MARGIN_X = 120;
const MARGIN_Y = 80;
const INFLEXION_PADDING = 20;
const colors = ["#a3e635", "#fbbf24", "#f87171"];

export const DonutChart = ({ width, height, data, onSliceClick }) => {
  const ref = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const totalAlumnos = useMemo(() => d3.sum(data, (d) => d.value), [data]);

  const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;
  const innerRadius = radius * 0.45;

  const pie = useMemo(() => {
    return d3.pie().value((d) => d.value)(data);
  }, [data]);

  const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius);
  const arcLabel = d3
    .arc()
    .innerRadius(radius + INFLEXION_PADDING)
    .outerRadius(radius + INFLEXION_PADDING);

  const arcHover = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(radius + 8);

  const categorias = ["excelencia", "regular", "riesgo"];

  const shapes = pie.map((grp, i) => {
    const slicePath = arcGenerator({
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    });
    const slicePathHover = arcHover({
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    });
    const centroid = arcGenerator.centroid({
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    });
    const inflexionPoint = arcLabel.centroid({
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    });

    const isRightLabel = inflexionPoint[0] > 0;
    const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 0.35 : -0.35);
    const textAnchor = isRightLabel ? "start" : "end";
    const label = `${grp.data.name} (${grp.value})`;
    const porcentaje = totalAlumnos > 0
      ? ((grp.value / totalAlumnos) * 100).toFixed(1)
      : 0;

    return (
      <g
        key={i}
        className={styles.slice}
        style={{ cursor: "pointer" }}
        onClick={() => onSliceClick?.(categorias[i])} 
        onMouseEnter={(e) => {
          ref.current?.classList.add(styles.hasHighlight);
          e.currentTarget.querySelector("path").setAttribute("d", slicePathHover);
          const cx = centroid[0] + width / 2;
          const cy = centroid[1] + height / 2;
          setTooltip({ x: cx, y: cy, name: grp.data.name, value: grp.value, porcentaje });
        }}
        onMouseLeave={(e) => {
          ref.current?.classList.remove(styles.hasHighlight);
          e.currentTarget.querySelector("path").setAttribute("d", slicePath);
          setTooltip(null);
        }}
      >
        <path d={slicePath} fill={colors[i % colors.length]} />
        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
        <line x1={centroid[0]} y1={centroid[1]} x2={inflexionPoint[0]} y2={inflexionPoint[1]} stroke="black" />
        <line x1={inflexionPoint[0]} y1={inflexionPoint[1]} x2={labelPosX} y2={inflexionPoint[1]} stroke="black" />
        <text
          x={labelPosX + (isRightLabel ? 2 : -2)}
          y={inflexionPoint[1]}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={14}
        >
          {label}
        </text>
      </g>
    );
  });

  const tooltipWidth = 150;
  const tooltipHeight = 52;
  const tooltipX = tooltip
    ? Math.min(Math.max(tooltip.x - tooltipWidth / 2, 4), width - tooltipWidth - 4)
    : 0;
  const tooltipY = tooltip ? Math.max(tooltip.y - tooltipHeight - 12, 4) : 0;

  return (
    <svg width={width} height={height} overflow="visible">
      <g
        transform={`translate(${width / 2}, ${height / 2})`}
        className={styles.container}
        ref={ref}
      >
        {shapes}
      </g>
      {tooltip && (
        <g style={{ pointerEvents: "none" }}>
          <rect x={tooltipX + 2} y={tooltipY + 2} width={tooltipWidth} height={tooltipHeight} rx={8} fill="rgba(0,0,0,0.08)" />
          <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} rx={8} fill="white" stroke="#e5e7eb" strokeWidth={1} />
          <text x={tooltipX + tooltipWidth / 2} y={tooltipY + 18} textAnchor="middle" fontSize={11} fill="#6b7280">
            {tooltip.name}
          </text>
          <text x={tooltipX + tooltipWidth / 2} y={tooltipY + 38} textAnchor="middle" fontSize={13} fontWeight="700" fill="#111827">
            {tooltip.value} alumnos · {tooltip.porcentaje}%
          </text>
        </g>
      )}
    </svg>
  );
};