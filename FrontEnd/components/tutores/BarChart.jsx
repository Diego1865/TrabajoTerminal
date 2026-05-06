import { useMemo, useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 20, bottom: 10, left: 36 };
const colors = ["#6EE7B7", "#FDE68A", "#FCA5A5"];

export const BarChart = ({ width, height, data }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

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
          .attr("stroke", "#EDE9FE")
          .attr("stroke-dasharray", "4,3")
      )
      .call((g) =>
        g.selectAll(".tick text")
          .attr("fill", "#A78BFA")
          .attr("font-size", 11)
          .attr("font-family", "'Nunito', sans-serif")
          .attr("font-weight", 700)
          .attr("x", -8)
      );
  }, [yScale, width, totalAlumnos]);

  const bars = data.map((d, i) => {
    const x = xScale(d.name);
    const y = yScale(d.value);
    const barWidth = xScale.bandwidth();
    const barHeight = height - MARGIN.bottom - y;
    const porcentaje = totalAlumnos > 0 ? ((d.value / totalAlumnos) * 100).toFixed(1) : 0;

    return (
      <g key={d.name}>
        <rect
          x={x} y={y}
          width={barWidth} height={barHeight}
          fill={colors[i % colors.length]}
          rx={10} ry={10}
          style={{ cursor: "pointer", transition: "opacity 0.15s" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.8";
            setTooltip({ x: x + barWidth / 2, y, name: d.name, value: d.value, porcentaje });
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            setTooltip(null);
          }}
        />
        <text
          x={x + barWidth / 2} y={y - 8}
          textAnchor="middle" fontSize={13} fontWeight="900"
          fontFamily="'Nunito', sans-serif" fill="#4C1D95">
          {d.value}
        </text>
      </g>
    );
  });

  const tooltipWidth = 150;
  const tooltipHeight = 56;
  const tooltipX = tooltip
    ? Math.min(Math.max(tooltip.x - tooltipWidth / 2, MARGIN.left), width - tooltipWidth - MARGIN.right)
    : 0;
  const tooltipY = tooltip ? Math.max(tooltip.y - tooltipHeight - 10, 4) : 0;

  return (
    <svg ref={svgRef} width={width} height={height} style={{ overflow: "visible", fontFamily: "'Nunito', sans-serif" }}>
      {bars}
      {tooltip && (
        <g style={{ pointerEvents: "none" }}>
          <rect x={tooltipX + 3} y={tooltipY + 3} width={tooltipWidth} height={tooltipHeight}
            rx={12} fill="rgba(109,40,217,0.08)" />
          <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight}
            rx={12} fill="white" stroke="#DDD6FE" strokeWidth={2} />
          <text x={tooltipX + tooltipWidth / 2} y={tooltipY + 20}
            textAnchor="middle" fontSize={11} fontWeight="700" fill="#8B5CF6">
            {tooltip.name}
          </text>
          <text x={tooltipX + tooltipWidth / 2} y={tooltipY + 42}
            textAnchor="middle" fontSize={13} fontWeight="900" fill="#4C1D95">
            {tooltip.value} · {tooltip.porcentaje}%
          </text>
        </g>
      )}
    </svg>
  );
};