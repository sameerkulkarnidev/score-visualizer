import React, { useCallback, useEffect, useRef } from "react";
import { WorkerResults } from "../../types";

import * as d3 from "d3";

type Props = {
  /**
   * match data that need to be rendered
   */
  data: WorkerResults;

  /**
   * A boolean flag indicating whether the supplied data is still loading
   */
  isLoading?: boolean;
};

/**
 * A component which is responsible for rendering the line chart with the given data
 * @param props {Props}
 * @returns {JSX}
 */
export const LineChart = (props: Props) => {
  const {
    data: { matchList, dataByTimeline, dataByTeam, teams },
  } = props;

  /**
   * hold the reference to the SVG element that will be rendered. We will
   * use it for rendering the content, computing the viewport dimensions etc.
   */
  const svgRef = useRef<SVGSVGElement>(null);

  /**
   * A function that actully renders the line chart
   */
  const renderChart = useCallback(() => {
    // clear the chart before rendering it
    d3.select(svgRef.current).selectChildren().remove();

    //compute the dimensions of the available viewport and set the
    // appropriate margins
    const rect = svgRef.current?.getBoundingClientRect();
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = (rect?.width || 900) - margin.left - margin.right,
      height = (rect?.height || 600) - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set the X axis generator
    const x = d3
      .scaleTime()
      .domain([
        dataByTimeline.length ? dataByTimeline[0].timestamp : 0,
        dataByTimeline.length
          ? dataByTimeline[dataByTimeline.length - 1].timestamp
          : 1,
      ])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // set the Y axis generator
    const y = d3
      .scaleLinear()
      .domain([
        matchList.reduce((acc, val) => {
          return Math.min(acc, val.pts_h, val.pts_v);
        }, Number.MAX_SAFE_INTEGER),
        matchList.reduce((acc, val) => {
          return Math.max(acc, val.pts_h, val.pts_v);
        }, 0),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    const colorScale = d3.scaleSequential(d3.interpolateSinebow);

    // Add the lines for every selected option
    const p = svg
      .append("g")
      .selectAll("g")
      .data(Object.keys(dataByTeam).filter((p, i) => true))
      .enter();

    // draw the individual line
    p.append("path")
      .datum((d) => dataByTeam[d])
      .attr("fill", "none")
      .attr("stroke", (d, i) => {
        return colorScale(i / teams.length);
      })
      .attr("stroke-width", 1.5)
      .attr("d", (d) => {
        const lineGenerator = d3.line();

        const data: Array<[number, number]> = d.map((entry) => {
          return [x(entry.time), y(Number(entry.data.points))];
        });

        return lineGenerator(data);
      });

    // plot the points
    p.append("g")
      .selectAll("g")
      .data((d, i) => dataByTeam[d].map((e) => ({ ...e, name: d })))
      .enter()
      .append("circle")
      .attr("fill", "black")
      .attr("r", 3)
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(Number(d.data.points)))
      .attr("class", "cursor-pointer")
      .append("title")
      .text(
        (d) =>
          `${d.name} - ${d.data.points} \n${new Intl.DateTimeFormat(
            "en-US"
          ).format(new Date(d.time))}`
      );

    return svg;
  }, [dataByTeam, dataByTimeline, matchList, teams.length]);

  /**
   * A window resize event handler which will take care of updating the
   * chart whenever the browser window is resized
   */
  const onWindowResize = useCallback(() => {
    requestAnimationFrame(renderChart);
  }, [renderChart]);

  /**
   * Triggers the first render!
   */
  useEffect(() => {
    renderChart();
  }, [renderChart]);

  /**
   * Registers and clear the browser resize events
   */
  useEffect(() => {
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [onWindowResize]);

  return <svg className="w-full h-full" ref={svgRef}></svg>;
};
