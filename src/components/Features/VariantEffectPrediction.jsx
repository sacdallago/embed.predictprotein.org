import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import * as d3 from "d3";
import { useFeatures } from "../../hooks/useFeatures";

const CHART_DIMENSIONS = {
    width: undefined,
    height: 500,
    margin: { top: 30, bottom: 30, left: 20, right: 20 },
    padding: 0.05,
};

function zoomableBand(){

    var band = 


}

function setupD3Heatmap(svgRef, dimensions = CHART_DIMENSIONS) {
    let calcWidth = dimensions.width ?? svgRef.current.clientWidth;

    let containerWidth =
        calcWidth - dimensions.margin.left - dimensions.margin.right;
    let containerHeight =
        dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const extent = [
        [dimensions.margin.left, dimensions.margin.top],
        [containerWidth, containerHeight],
    ];

    var svg = d3
        .select(svgRef.current)
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        // create plot group
        .append("g")
        .attr(
            "transform",
            "translate(" +
                dimensions.margin.left +
                "," +
                dimensions.margin.top +
                ")"
        )
        .attr("viewBox", [0, 0, containerWidth, containerHeight]);

    // Add a clipPath: everything out of this area won't be drawn.
    svg.append("defs")
        .append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .attr("x", 0)
        .attr("y", 0);

    var dataCanvas = svg.append("g").attr("clip-path", "url(#clip)");

    const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateReds)
        .domain([0, 100]);

    const draw_data = (data) => {
        svg.call(
            d3
                .zoom()
                .scaleExtent([0.25, 1])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", zoomX)
        );

        // Build Y scales and axis:
        var y = d3
            .scaleBand()
            .range([containerHeight, 0])
            .domain(data.y_axis)
            .padding(dimensions.padding);

        var max_x_range = Math.floor(containerWidth / y.bandwidth());

        var x = d3
            .scaleBand()
            .padding(dimensions.padding)
            .range([0, containerWidth])
            .domain(d3.range(max_x_range + 1));

        var xAxis = d3
            .axisBottom(x)
            .tickSize(0)
            .ticks()
            .tickFormat((index) => {
                var seq_idx = Math.round(index, 0);
                return `${seq_idx} - ${data.x_axis[seq_idx]}`;
            });

        function zoomX(event) {
            x.range(
                [dimensions.margin.left, containerWidth].map((d) =>
                    event.transform.applyX(d)
                )
            );
            svg.selectAll(".scores rect")
                .attr("x", (d) => x(d.name))
                .attr("width", x.bandwidth());
            svg.selectAll(".x-axis").call(xAxis);
        }

        svg.append("g")
            .attr("class", "y-axis")
            .style("font-size", "1em")
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain")
            .style("stroke-width", "3px");

        svg.append("g")
            .attr("class", "x-axis")

            .style("font-size", "1em")
            .attr("transform", `translate(0, ${containerHeight})`)
            .call(xAxis)
            .select(".domain")
            .remove();

        dataCanvas
            .selectAll()
            .data(data.values, (d) => {
                return `${d.x}->${d.y}`;
            })
            .join("rect")
            .attr("x", function (d) {
                return x(d.x);
            })
            .attr("y", function (d) {
                return y(d.y);
            })
            .attr("width", y.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) {
                return colorScale(d.score);
            })
            .attr("class", "score")
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8);
    };

    return draw_data;
}

function teardownD3Heatmap(svgRef) {
    var svg = d3.select(svgRef.current);
    var content = svg.selectAll("*");
    content.remove();
}

export default function VariantEffectPrediction() {
    const { isSuccess, isLoading, isError, data } = useFeatures();

    if (isLoading) return <VariantEffectPredictionLoading />;
    if (isError) return <VariantEffectPredictionError />;
    if (isSuccess)
        return <VariantEffectPredictionLoaded data={data.predictedVariation} />;
}
function VariantEffectPredictionLoading() {}
function VariantEffectPredictionError() {}

function VariantEffectPredictionLoaded({ data }) {
    const svgRef = useRef(null);
    const [effectData, setEffectData] = useState(undefined);

    // Cleanup data and prepare for d3
    useEffect(() => {
        let tmpData = {};
        tmpData.x_axis = data.x_axis;
        tmpData.y_axis = data.y_axis;
        var values = [];
        for (
            var residue_idx = 0;
            residue_idx < data.values[0].length;
            residue_idx++
        ) {
            values.push(
                // eslint-disable-next-line no-loop-func
                ...data.values.map((row, yIdx) => {
                    return {
                        x: residue_idx,
                        y: data.y_axis[yIdx],
                        score: row[residue_idx],
                    };
                })
            );
        }
        tmpData.values = values;
        setEffectData(tmpData);
    }, [data]);

    // Draw chart
    useLayoutEffect(() => {
        const draw_data = setupD3Heatmap(svgRef);

        if (effectData) draw_data(effectData);
        return () => teardownD3Heatmap(svgRef);
    }, [effectData, svgRef]);

    return <svg className="w-100" ref={svgRef} />;
}
