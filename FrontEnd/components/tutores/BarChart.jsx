import { useMemo, useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 20, bottom: 10, left: 36 };
const colors = ["#a3e635", "#fbbf24", "#f87171"];

export const BarChart = ({ width, height, data }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  // tooltip: { x, y, name, value } | null

  const totalAlumnos = useMemo(() => d3.sum(data, (d) => d.value), [data]);

  const { xScale, yScale } = useMemo(() => {
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([MARGIN.left, width - MARGIN.right])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, totalAlumnos])
      .range([height - MARGIN.bottom, MARGIN.top]);

    return { xScale, yScale };
  }, [data, width, height, totalAlumnos]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.select(".y-axis").remove();

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues([
        ...d3.range(0, totalAlumnos, Math.ceil(totalAlumnos / 4)),
        totalAlumnos,
      ])
      .tickFormat(d3.format("d"))
      .tickSize(-(width - MARGIN.left - MARGIN.right));

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${MARGIN.left}, 0)`)
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line")
          .attr("stroke", "#e5e7eb")
          .attr("stroke-dasharray", "4,3")
      )
      .call((g) =>
        g.selectAll(".tick text")
          .attr("fill", "#d1d5db")
          .attr("font-size", 11)
          .attr("x", -8)
      );
  }, [yScale, width, totalAlumnos]);

  const bars = data.map((d, i) => {
    const x = xScale(d.name);
    const y = yScale(d.value);
    const barWidth = xScale.bandwidth();
    const barHeight = height - MARGIN.bottom - y;
    const porcentaje = totalAlumnos > 0
      ? ((d.value / totalAlumnos) * 100).toFixed(1)
      : 0;

    return (
      <g key={d.name}>
        <rect
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill={colors[i % colors.length]}
          rx={8}
          ry={8}
          style={{ cursor: "pointer", transition: "opacity 0.15s" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.8";
            setTooltip({
              x: x + barWidth / 2,
              y: y,
              name: d.name,
              value: d.value,
              porcentaje,
            });
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            setTooltip(null);
          }}
        />
        {/* Valor encima */}
        <text
          x={x + barWidth / 2}
          y={y - 8}
          textAnchor="middle"
          fontSize={13}
          fontWeight="700"
          fill="#374151"
        >
          {d.value}
        </text>
      </g>
    );
  });

  // Posición del tooltip para que no se salga del SVG
  const tooltipWidth = 140;
  const tooltipHeight = 52;
  const tooltipX = tooltip
    ? Math.min(
        Math.max(tooltip.x - tooltipWidth / 2, MARGIN.left),
        width - tooltipWidth - MARGIN.right
      )
    : 0;
  const tooltipY = tooltip ? Math.max(tooltip.y - tooltipHeight - 10, 4) : 0;

  return (
    <svg ref={svgRef} width={width} height={height} style={{ overflow: "visible" }}>
      {bars}

      {/* Tooltip */}
      {tooltip && (
        <g style={{ pointerEvents: "none" }}>
          {/* Sombra */}
          <rect
            x={tooltipX + 2}
            y={tooltipY + 2}
            width={tooltipWidth}
            height={tooltipHeight}
            rx={8}
            fill="rgba(0,0,0,0.08)"
          />
          {/* Fondo */}
          <rect
            x={tooltipX}
            y={tooltipY}
            width={tooltipWidth}
            height={tooltipHeight}
            rx={8}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          {/* Nombre */}
          <text
            x={tooltipX + tooltipWidth / 2}
            y={tooltipY + 18}
            textAnchor="middle"
            fontSize={11}
            fill="#6b7280"
          >
            {tooltip.name}
          </text>
          {/* Valor y porcentaje */}
          <text
            x={tooltipX + tooltipWidth / 2}
            y={tooltipY + 38}
            textAnchor="middle"
            fontSize={13}
            fontWeight="700"
            fill="#111827"
          >
            {tooltip.value} alumnos · {tooltip.porcentaje}%
          </text>
        </g>
      )}
    </svg>
  );
};