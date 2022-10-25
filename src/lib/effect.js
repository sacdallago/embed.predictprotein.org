import * as d3 from "d3";

const CHART_DIMENSIONS = {
    width: undefined,
    chart_height: 500,
    panel_height: 75,
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
    panel_yScale;
    panel_xScale;
    panel;
    _data;

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

    data(data) {
        this._data = data;
        return this;
    }

    static invertBandScale(scale, value) {
        var eachBand = scale.step();
        var index = Math.round(value / eachBand);
        return scale.domain()[index];
    }

    constructor(containerRef, dimensions = CHART_DIMENSIONS) {
        this.sequence_view = [0, 0];
        this.containerWidth = 0;
        this.chartHeight = 0;
        this.colorScale = undefined;
        this.dimensions = dimensions;
        this.containerRef = containerRef;
        this.calc_dimensions();
        this.calc_sequence_view();
        this.setup_panel_canvas();
        this.setup_chart_canvas();
    }

    calc_sequence_view() {
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

    setup_chart_canvas() {
        this.chart = d3
            .select(this.containerRef)
            .append("svg")
            .attr("id", "effect-chart")
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

        this.chart_dataCanvas = this.chart
            .append("g")
            .attr("clip-path", "url(#clip)");
    }

    setup_panel_canvas() {
        this.panel = d3
            .select(this.containerRef)
            .append("svg")
            .attr("width", this.dimensions.width)
            .attr("height", this.dimensions.panel_height)
            .attr("id", "effect-panel");

        this.panel_dataCanvas = this.panel.append("g");
    }

    _setup_chart_axis() {
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

    _setup_panel_axis(data) {
        this.panel_yScale = d3
            .scaleBand()
            .range([this.dimensions.panel_height, 0])
            .domain(AAOrder);

        this.panel_xScale = d3
            .scaleBand()
            .range([0, this.dimensions.width])
            .domain(d3.range(data.x_axis.length));
    }

    _draw_chart_yAxis() {
        this.chart
            .append("g")
            .call(this.chart_yAxis)
            .attr("class", "y-axis")
            .style("font-size", "1em")
            .attr("text-anchor", "end")
            .select(".domain")
            .style("stroke-width", "3px");
    }

    _draw_chart_xAxis(data) {
        // Draw axis
        let xAxis = this.chart
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${this.chartHeight + 3})`);

        xAxis
            .append("g")
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

        xAxis
            .append("g")
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

    _draw_chart(data) {
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

    _draw_panel(data) {
        this.panel_dataCanvas
            .selectAll()
            .data(data.values, (d) => {
                return `${d.x}->${d.y}`;
            })
            .join("rect")
            .attr("x", (d) => {
                return this.panel_xScale(d.x);
            })
            .attr("y", (d) => {
                return this.panel_yScale(d.y);
            })
            .attr("width", this.panel_xScale.bandwidth())
            .attr("height", this.panel_yScale.bandwidth())
            .style("fill", (d) => {
                if (d.score > 0) return this.colorScale(d.score);
                else return "#ffffff";
            })
            .attr("class", "score")
            .style("opacity", 0.8);
    }

    _draw_brush() {
        var brush = d3
            .brushX()
            .extent([
                [0, 0],
                [this.dimensions.width, this.dimensions.panel_height],
            ])
            .on("brush", ({ selection }) => this.updateSelection(selection));

        var brush_rect = this.panel
            .append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, this.sequence_view.map(this.panel_xScale));

        brush_rect.selectAll(".handle").remove();
        brush_rect.selectAll(".overlay").remove();
    }

    updateSelection(selection) {
        var start = EffectPredictor.invertBandScale(
            this.panel_xScale,
            selection[0]
        );
        var end = EffectPredictor.invertBandScale(
            this.panel_xScale,
            selection[1]
        );
        this.sequence_view = [start, end + 1];
        this._update_chart_xAxis();
    }

    _update_chart_xAxis() {
        this.chart_xScale.domain(d3.range(...this.sequence_view));
    }

    draw() {
        if (this.data === undefined) return;
        this._setup_chart_axis();
        this._setup_panel_axis(this.data);
        this._draw_chart_yAxis();
        this._draw_brush();

        this._update_data();
    }

    _update_data() {
        if (this.data === undefined) return;
        this._update_chart_xAxis();
        this._draw_chart_xAxis(this.data);
        this._draw_panel(this.data);
        this._draw_chart(this.data);
    }

    teardown() {
        d3.select(this.containerRef).selectAll("*").remove();
    }
}
