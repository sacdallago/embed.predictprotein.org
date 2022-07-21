import React from "react";
import PropTypes from "prop-types";

class VariationPrediction extends React.Component {
  componentWillReceiveProps(newProps) {
    var receivedData = newProps;

    if(receivedData.data.predictedVariation != undefined) {

      let data = receivedData.data.predictedVariation

      var x_labels = data.x_axis.map(
          (e, index) => index + 1 + " " + e
      );

      var layout = {
        showlegend: false,
        autosize: false,
        width: 1296,
        height: 460,
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
          tickangle: 'auto',
          range: [0, (x_labels.length / (x_labels.length / 70))],

          showgrid: true,
          spikedash: 'solid',
          spikethickness: 10,

          zeroline: false,
          showline: true,
          title: 'Wild type position/residue',

        },

        yaxis: {
          tickmode: "linear",
          fixedrange: true,
          showline: true,
          title: 'Amino acid'
        },

        zaxis: {
          title: 'Effect score'
        }
      };

      var config = {
        toImageButtonOptions: {
          format: "svg", // one of png, svg, jpeg, webp
          filename: "variation_prediction_EMPP",
          scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
        },
        scrollZoom: false,
        //staticPlot: true,
        //displayModeBar: true,
        editable: false,
        showLink: false,
        displaylogo: false,
      };

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
              hovertemplate:
                  "%{yaxis.title.text}: %{y}<br>" +
                  "%{xaxis.title.text}: %{x}<br>" +
                  "effect score: %{z}<br>" +
                  "<extra></extra>"
            },
          ],
          layout,
          config
      );
    }
  }

  render() {
    return <div className="use-bootstrap" id={"gd"} style={{textAlign: 'center', float: 'inherit', position: 'relative'}}>
    </div>;
  }
}

VariationPrediction.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default VariationPrediction;
