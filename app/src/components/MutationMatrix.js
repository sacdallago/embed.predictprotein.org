import React from "react";
import PropTypes from "prop-types";

class MutationMatrix extends React.Component {
  componentWillReceiveProps(newProps) {
    var data = newProps.data;
    var layout = {
      title: "Variation prediction",
      showlegend: false,
      autosize: true,
      width: 800,
      height: 600,
      margin: {
        autoexpand: true,
      },
      dragmode: "pan",
      selectdirection: "h",
      modebar: {
        remove: ["zoom", "zoomin", "zoomout", "autoscale", "reset", "lasso"],
      },
      xaxis: {
        tickmode: "linear",
        automargin: false,
        dividerwidth: 4,
        autorange: false,

        showgrid: true,
        spikedash: 'solid',
        spikethickness: 10,

        zeroline: false,
        showline: true,
      },
      /*
      xaxis: {
        tickmode: "linear",
        autorange: false,
        dividerwidth: 3,
        automargin: true
      },
      */
      yaxis: {
        tickmode: "linear",
        fixedrange: true,
        showline: true,
      },
    };

    var config = {
      toImageButtonOptions: {
        format: "svg", // one of png, svg, jpeg, webp
        filename: "variation",
        scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
      },
      scrollZoom: false,
      //staticPlot: true,
      displayModeBar: true,
      editable: false,
      showLink: false,
      displaylogo: false,
    };

    var x_labels = data.x_axis.map(
      (e, index) => index + 1 + " " + e
    );

    this.fig = new window.Plotly.newPlot(
      "gd",
      [
        {
          type: "scatter",
          mode: "markers",
          marker: {
            color: "#ffa700",
          },
          x: x_labels,
          y: data.x_axis,
        },
        {
          type: "heatmap",
          z: data.values,
          x: x_labels,
          colorscale: [
            [0, "#FFFFFFFF"],
            [1, "#000000"],
          ],
          y: data.y_axis,
          hoverongaps: false,
        },
      ],
      layout,
      config
    );
        
  }

  render() {
    return <div className="use-bootstrap" id={"gd"}>
<rect width="100" height="100" />
    </div>;
  }
}

MutationMatrix.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default MutationMatrix;
