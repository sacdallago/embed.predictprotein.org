import * as d3 from "d3";

const CHART_DIMENSIONS = {
    width: undefined,
    chart_height: 500,
    zoom_height: 100,
    margin: { top: 30, bottom: 30, left: 20, right: 20 },
    padding: 0.05,
};

export class EffectPredictor {
    calc_dimensions() {
        let calcWidth =
            this.dimensions.width ?? this.containerRef.current.clientWidth;

        this.containerWidth =
            calcWidth -
            this.dimensions.margin.left -
            this.dimensions.margin.right;
        this.chartHeight =
            this.dimensions.chart_height -
            this.dimensions.margin.top -
            this.dimensions.margin.bottom;
    }

    constructor(containerRef, dimensions = CHART_DIMENSIONS) {
        this.containerWidth = 0;
        this.chartHeight = 0;
        this.colorScale = undefined;
        this.dimensions = dimensions;
        this.containerRef = containerRef;
        this.calc_dimensions();
        this.setup_canvas();
    }

    setup_canvas() {
        this.chart = d3
            .select(this.containerRef)
            .append("svg")
            .attr("width", this.dimensions.width)
            .attr("height", this.dimensions.chart_height)
            // create plot group
            .append("g")
            .attr(
                "transform",
                "translate(" +
                    this.dimensions.margin.left +
                    "," +
                    this.dimensions.margin.top +
                    ")"
            )
            .attr("viewBox", [0, 0, this.containerWidth, this.chartHeight]);

        this.chart
            .append("defs")
            .append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", this.containerWidth)
            .attr("height", this.chartHeight)
            .attr("x", 0)
            .attr("y", 0);

        this.dataCanvas = this.chart
            .append("g")
            .attr("clip-path", "url(#clip)");
    }

    setup_chart_axis(data) {
        this.colorScale = d3
            .scaleSequential()
            .interpolator(d3.interpolateReds)
            .domain([0, 100]);

        this.chart_yScale = d3
            .scaleBand()
            .range([this.chartHeight, 0])
            .domain(data.y_axis)
            .padding(this.dimensions.padding);

        this.chart_yAxis = d3.axisLeft(this.chart_yAxis).tickSize(0);

        var x_domain_len = Math.floor(
            this.containerWidth / this.chart_yScale.bandwidth()
        );

        this.data_square_dim = this.chart_yScale.bandwidth();

        this.chart_xScale = d3
            .scaleBand()
            .paddingInner(this.dimensions.padding)
            .paddingOuter(0.1)
            .range([0, this.containerWidth])
            .domain(d3.range(x_domain_len));

        this.chart_xAxis = d3
            .axisBottom(this.chart_xScale)
            .tickSize(0)
            .ticks()
            .tickFormat((index) => {
                var seq_idx = Math.round(index, 0);
                return `${seq_idx} - ${data.x_axis[seq_idx]}`;
            });
    }

    draw_axis() {
        this.chart
            .append("g")
            .attr("class", "y-axis")
            .style("font-size", "1em")
            .call(this.chart_yAxis)
            .select(".domain")
            .style("stroke-width", "3px");

        this.chart
            .append("g")
            .attr("class", "x-axis")
            .style("font-size", "1em")
            .attr("transform", `translate(0, ${this.chartHeight})`)
            .call(this.chart_xAxis)
            .select(".domain")
            .remove();
    }

    draw_chart(data) {
        this.dataCanvas
            .selectAll()
            .data(data.values, (d) => {
                return `${d.x}->${d.y}`;
            })
            .join("rect")
            .attr("x", function (d) {
                return this.chart_xScale(d.x);
            })
            .attr("y", function (d) {
                return this.chart_yScale(d.y);
            })
            .attr("width", this.data_square_dim)
            .attr("height", this.data_square_dim)
            .style("fill", function (d) {
                return this.colorScale(d.score);
            })
            .attr("class", "score")
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8);
    }

    draw(data) {
        this.setup_axis(data);
        this.draw_axis();
        this.draw_chart(data);
    }

    teardown() {
        this.chart.selectAll("*").remove();
    }
}
