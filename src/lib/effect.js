import { d3 } from "./d3provider";

const CHART_DIMENSIONS = {
    width: undefined,
    chart_height: 500,
    panel_height: 75,
    colorbar: { width: 15, margin: 25 },
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
    tooltip;
    _data;
    _chartData;

    _calc_dimensions() {
        this.dimensions.width =
            this.dimensions.width ?? this.containerRef.clientWidth;

        this.containerWidth =
            this.dimensions.width -
            this.dimensions.margin.left -
            this.dimensions.colorbar.width -
            this.dimensions.colorbar.margin -
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

    static data_range(x_value_lower, x_value_upper, y_length, max_len = 0) {
        var lower = x_value_lower * y_length;
        var upper = x_value_upper * y_length;
        return [lower, upper];
    }

    data(data) {
        this._data = data;
        this._data.values.sort((a, b) => {
            if (a.x === b.x && a.y <= b.y) return -1;
            if (a.x === b.x && a.y > b.y) return 1;
            if (a.x > b.x) return 1;
            if (a.x < b.x) return -1;
            return -1;
        });
        this._chartData = this._data.values.slice(
            ...EffectPredictor.data_range(
                ...this.sequence_view,
                data.y_axis.length
            )
        );
        return this;
    }

    static invertBandScale(scale, value) {
        var eachBand = scale.step();
        var index = Math.floor(value / eachBand);
        index = Math.min(scale.domain().length - 1, index);
        return scale.domain()[index];
    }

    constructor(containerRef, dimensions = CHART_DIMENSIONS) {
        this.sequence_view = [0, 0];
        this.containerWidth = 0;
        this.chartHeight = 0;
        this.colorScale = undefined;
        this.dimensions = dimensions;
        this.containerRef = containerRef;
        this._calc_dimensions();
        this._calc_sequence_view();
        this._setup_chart_axis();
        this._setup_panel_canvas();
        this._setup_chart_canvas();
        this._setup_color_bar();
        this._setup_tooltip();
        this.update_chart_x = this._setup_chart_xAxis();
        this.update_chart_y = this._setup_chart_yAxis();
    }

    _calc_sequence_view() {
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

    _setup_chart_canvas() {
        this.chart = d3
            .select(this.containerRef)
            .append("svg")
            .attr("id", "effect-chart")
            .attr(
                "width",
                this.dimensions.width -
                    this.dimensions.colorbar.width -
                    this.dimensions.colorbar.margin
            )
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

    _setup_panel_canvas() {
        this.panel = d3
            .select(this.containerRef)
            .append("svg")
            .attr("width", this.dimensions.width)
            .attr("height", this.dimensions.panel_height)
            .attr("id", "effect-panel");

        this.panel_dataCanvas = this.panel.append("g");
    }

    _setup_tooltip() {
        // create a tooltip
        this.tooltip = d3
            .select(this.containerRef)
            .append("div")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "absolute");
    }

    _setup_color_bar() {
        this.colorbar = d3
            .select(this.containerRef)
            .append("svg")
            .attr("id", "effect-colorbar")
            .attr(
                "width",
                this.dimensions.colorbar.width + this.dimensions.colorbar.margin
            )
            .attr("height", this.dimensions.chart_height);

        var defs = this.colorbar.append("defs");

        defs.append("pattern")
            .attr("id", "diagonalHatch")
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", 4)
            .attr("height", 4)
            .append("path")
            .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
            .attr("stroke", "#000000")
            .attr("stroke-width", 1);

        var plot = this.colorbar
            .append("g")
            .attr("transform", `translate(0, ${this.dimensions.margin.top})`);

        var bar_height =
            this.dimensions.chart_height -
            this.dimensions.colorbar.width -
            this.dimensions.margin.bottom -
            this.dimensions.margin.top;

        plot.append("rect")
            .attr("y", bar_height + 5)
            .attr("width", this.dimensions.colorbar.width)
            .attr("height", this.dimensions.colorbar.width)
            .style("fill", "url(#diagonalHatch)");
        plot.append("text")
            .attr("y", bar_height + this.dimensions.colorbar.width / 1.2 + 5)
            .attr("x", this.dimensions.colorbar.width + 4)
            .text("wt")
            .style("font-size", "0.7em");

        // See https://github.com/ttdtrang/d3-colorbar/blob/master/src/colorbar.js
        var nBars = 100;
        var barData = [];
        var trueDL = bar_height / nBars;
        for (var i = 0; i < nBars; i++) {
            barData.push(i);
        }

        var linearScale = d3
            .scaleLinear()
            .domain([0, 100])
            .range([0, bar_height]);

        var axis = d3.axisRight(linearScale).tickSize(0).ticks(4);

        var ax = plot
            .append("g")
            .attr("class", "colorbar axis")
            .attr(
                "transform",
                "translate(" + this.dimensions.colorbar.width + ", 0)"
            )
            .call(axis)
            .style("font-size", "0.7em");

        ax.select(".domain").remove();

        var bars = plot
            .selectAll("rect")
            .data(barData)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", (d) => d * trueDL)
            .attr("width", this.dimensions.colorbar.width)
            .attr("height", trueDL)
            .style("stroke-width", "0px")
            .style("fill", (d) => this.colorScale(d));
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

    _setup_chart_yAxis() {
        var ax = this.chart
            .append("g")
            .attr("class", "y-axis")
            .style("font-size", "1em")
            .attr("text-anchor", "end");

        var instance = this;

        function update() {
            ax.call(instance.chart_yAxis)
                .select(".domain")
                .style("stroke-width", "3px");
        }
        return update;
    }

    _setup_chart_xAxis() {
        let xAxis = this.chart
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${this.chartHeight + 3})`);

        var x_residue = xAxis
            .append("g")
            .attr("class", "x-residue")
            .style("font-size", "1em");

        var x_index = xAxis
            .append("g")
            .attr("class", "x-index")
            .style("font-size", "8px")
            .attr("transform", `translate(0, 16)`);

        var instance = this;

        function update() {
            x_residue
                .call(
                    instance.chart_xAxis.tickFormat((index) => {
                        var seq_idx = Math.round(index, 0);
                        return `${this._data.x_axis[seq_idx]}`;
                    })
                )
                .select(".domain")
                .remove();

            x_index
                .call(
                    instance.chart_xAxis.tickFormat((index) => {
                        var seq_idx = Math.round(index, 0);
                        return `${seq_idx + 1}`;
                    })
                )
                .select(".domain")
                .remove();
        }

        return update;
    }

    get_tooltip_handler() {
        var instance = this;

        // Three function that change the tooltip when user hover / move / leave a cell
        var _mouseover = function (event, d) {
            instance.tooltip.style("opacity", 1);
            d3.select(this).style("stroke", "white").style("opacity", 1);
        };
        var _mousemove = function (event, d) {
            let score_text =
                d.score > -1 ? "predicted effect: " + d.score : "wild type";

            instance.tooltip
                .html(
                    instance._data.x_axis[d.x] +
                        (d.x + 1) +
                        "" +
                        d.y +
                        "<br>" +
                        score_text
                )
                .style("left", event.pageX + 70 + "px")
                .style("top", event.pageY + "px");
        };
        var _mouseleave = function (event, d) {
            instance.tooltip.style("opacity", 0);
            d3.select(this).style("stroke", "none").style("opacity", 0.8);
        };

        return [_mouseleave, _mousemove, _mouseover];
    }

    _draw_chart() {
        const [_mouseleave, _mousemove, _mouseover] =
            this.get_tooltip_handler();

        this.chart_dataCanvas
            .selectAll("rect")
            .data(this._chartData, (d) => {
                return `${d.x}->${d.y}`;
            })
            .join(
                (enter) => {
                    return enter
                        .append("rect")
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
                        .style("opacity", 0.8)
                        .on("mouseover", _mouseover)
                        .on("mousemove", _mousemove)
                        .on("mouseleave", _mouseleave);
                },
                (update) =>
                    update
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
                        }),
                (exit) => exit.remove()
            );
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
        this._chartData = this._data.values.slice(
            ...EffectPredictor.data_range(
                ...this.sequence_view,
                this._data.y_axis.length
            )
        );
        this._draw_chart();
    }

    _update_chart_xAxis() {
        this.chart_xScale.domain(d3.range(...this.sequence_view));
        this.update_chart_x();
    }

    draw() {
        if (this._data === undefined) return;
        this.update_chart_x();
        this.update_chart_y();
        this._setup_panel_axis(this._data);
        this._draw_brush();

        this._update_chart_xAxis();
        this._draw_panel(this._data);
        this._draw_chart();
    }

    teardown() {
        d3.select(this.containerRef).selectAll("*").remove();
    }
}
