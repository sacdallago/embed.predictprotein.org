import * as d3 from "d3";

const CHART_DIMENSIONS = {
    width: undefined,
    chart_height: 500,
    zoom_height: 100,
    margin: { top: 30, bottom: 30, left: 20, right: 20 },
    padding_inner: 0.05,
    padding_outer: 0.1,
};

const AAOrder = "ARNDCQEGHILKMFPSTWYV".split("").reverse();

export class EffectPredictor {
    sequence_view;
    containerWidth;
    chartHeight;
    colorScale;
    dimensions;
    containerRef;
    chart;
    chart_yAxis;
    chart_yScale;
    chart_xAxis;
    chart_xScale;

    calc_dimensions() {
        this.dimensions.width =
            this.dimensions.width ?? this.containerRef.clientWidth;

        this.containerWidth =
            this.dimensions.width -
            this.dimensions.margin.left -
            this.dimensions.margin.right;
        this.chartHeight =
            this.dimensions.chart_height -
            this.dimensions.margin.top -
            this.dimensions.margin.bottom;
    }

    static calc_x_domain_num(
        rectDim,
        containerWidth,
        paddingInner,
        paddingOuter
    ) {
        // Based on the formula: cW = 2xp_o*x + (n-1)*p_i*x + nx
        var x_domain_num =
            (containerWidth +
                paddingInner * rectDim -
                2 * paddingOuter * rectDim) /
            ((1 + paddingInner) * rectDim);
        return Math.floor(x_domain_num);
    }

    constructor(containerRef, dimensions = CHART_DIMENSIONS) {
        this.sequence_view = [0, 0];
        this.containerWidth = 0;
        this.chartHeight = 0;
        this.colorScale = undefined;
        this.dimensions = dimensions;
        this.containerRef = containerRef;
        this.calc_dimensions();
        this.setup_canvas();
        this.setup_sequence_view();
    }

    setup_sequence_view() {
        var view_starts_at = 0;

        var tmp_yscale = d3
            .scaleBand()
            .range([this.chartHeight, 0])
            .padding(this.dimensions.padding_inner)
            .domain(AAOrder);

        var max_domain = EffectPredictor.calc_x_domain_num(
            tmp_yscale.bandwidth(),
            this.containerWidth,
            this.dimensions.padding_inner,
            this.dimensions.padding_outer
        );
        this.sequence_view = [view_starts_at, max_domain];
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

        var defs = this.chart.append("defs");

        // Add clip path
        defs.append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", this.containerWidth)
            .attr("height", this.chartHeight)
            .attr("x", 0)
            .attr("y", 0);
        // Add hatch pattern; see https://stackoverflow.com/a/17777121
        defs.append("pattern")
            .attr("id", "diagonalHatch")
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", 4)
            .attr("height", 4)
            .append("path")
            .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
            .attr("stroke", "#000000")
            .attr("stroke-width", 1);

        this.dataCanvas = this.chart
            .append("g")
            .attr("clip-path", "url(#clip)");
    }

    setup_chart_axis() {
        this.colorScale = d3
            .scaleSequential()
            .interpolator(d3.interpolateReds)
            .domain([0, 100]);

        this.chart_yScale = d3
            .scaleBand()
            .range([this.chartHeight, 0])
            .padding(this.dimensions.padding_inner)
            .domain(AAOrder);

        this.chart_yAxis = d3.axisLeft(this.chart_yScale).tickSize(0);

        this.chart_xScale = d3
            .scaleBand()
            .paddingInner(this.dimensions.padding_inner)
            .paddingOuter(this.dimensions.padding_outer)
            .range([0, this.containerWidth])
            .domain(d3.range(...this.sequence_view));

        this.chart_xAxis = d3.axisBottom(this.chart_xScale).tickSize(0);
    }

    draw_axis(data) {
        this.chart
            .append("g")
            .call(this.chart_yAxis)
            .attr("class", "y-axis")
            .style("font-size", "1em")
            .select(".domain")
            .style("stroke-width", "3px");

        // Draw axis
        let axis = this.chart
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${this.chartHeight + 3})`);

        axis.append("g")
            .attr("class", "x-residue")
            .style("font-size", "1em")
            .call(
                this.chart_xAxis.tickFormat((index) => {
                    var seq_idx = Math.round(index, 0);
                    return `${data.x_axis[seq_idx]}`;
                })
            )
            .select(".domain")
            .remove();

        axis.append("g")
            .attr("class", "x-index")
            .style("font-size", "8px")
            .attr("transform", `translate(0, 16)`)
            .call(
                this.chart_xAxis.tickFormat((index) => {
                    var seq_idx = Math.round(index, 0);
                    return `${seq_idx + 1}`;
                })
            )
            .select(".domain")
            .remove();
    }

    draw_chart(data) {
        console.log(data);
        this.chart
            .selectAll()
            .data(
                data.values.filter(
                    (element) =>
                        this.sequence_view[0] <= element.x &&
                        element.x < this.sequence_view[1]
                ),
                (d) => {
                    return `${d.x}->${d.y}`;
                }
            )
            .join("rect")
            .attr("x", (d) => {
                return this.chart_xScale(d.x);
            })
            .attr("y", (d) => {
                return this.chart_yScale(d.y);
            })
            .attr("width", this.chart_xScale.bandwidth())
            .attr("height", this.chart_yScale.bandwidth())
            .style("fill", (d) => {
                if (d.score > 0) return this.colorScale(d.score);
                else return "url(#diagonalHatch)";
            })
            .attr("class", "score")
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8);
    }

    draw(data) {
        this.setup_chart_axis();
        this.draw_axis(data);
        this.draw_chart(data);
    }

    teardown() {
        d3.select(this.containerRef).selectAll("*").remove();
    }
}
