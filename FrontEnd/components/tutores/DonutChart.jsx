import { useMemo, useRef } from "react";
import * as d3 from "d3";
import styles from "../../Estilo/donut-chart.module.css";

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20;

const colors = ["#a3e635", "#fbbf24", "#f87171"];

export const DonutChart = ({ width, height, data }) => {
  const ref = useRef(null);

  const radius =
    Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;

  const innerRadius = radius / 2;

  // Generador de pie
  const pie = useMemo(() => {
    return d3.pie().value((d) => d.value)(data);
  }, [data]);

  // Generador de arco CORRECTO
  const arcGenerator = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);

  // Generador para etiquetas
  const arcLabel = d3
    .arc()
    .innerRadius(radius + INFLEXION_PADDING)
    .outerRadius(radius + INFLEXION_PADDING);

  const shapes = pie.map((grp, i) => {
    const slicePath = arcGenerator({
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
    const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";

    const label = `${grp.data.name} (${grp.value})`;

    return (
      <g
        key={i}
        className={styles.slice}
        onMouseEnter={() => {
          ref.current?.classList.add(styles.hasHighlight);
        }}
        onMouseLeave={() => {
          ref.current?.classList.remove(styles.hasHighlight);
        }}
      >
        {/* Color protegido */}
        <path d={slicePath} fill={colors[i % colors.length]} />

        <circle cx={centroid[0]} cy={centroid[1]} r={2} />

        <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={inflexionPoint[0]}
          y2={inflexionPoint[1]}
          stroke="black"
        />

        <line
          x1={inflexionPoint[0]}
          y1={inflexionPoint[1]}
          x2={labelPosX}
          y2={inflexionPoint[1]}
          stroke="black"
        />

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

  return (
    <svg width={width} height={height}>
      <g
        transform={`translate(${width / 2}, ${height / 2})`}
        className={styles.container}
        ref={ref}
      >
        {shapes}
      </g>
    </svg>
  );
};