import React from "react";
import PropTypes from "prop-types";

class FeatureViewer extends React.Component {
  componentDidMount() {
    console.log("comp did mount");
    if (this.props.data !== null) {
      this.ft = new window.FeatureViewer(this.props.data.sequence, "#fv1", {
        showAxis: true,
        showSequence: true,
        brushActive: true, //zoom
        toolbar: true, //current zoom & mouse position
        bubbleHelp: true,
        zoomMax: 50, //define the maximum range of the zoom
      });
    }
  }

  findIndexes = (string, letters) => {
    let result = {};

    for (let j = 0; j < letters.length; j++) {
      let indices = [];
      for (let i = 0; i < string.length; i++) {
        if (string[i] === letters[j]) indices.push(i + 1);
      }
      result[letters[j]] = indices;
    }

    return result;
  };

  findRanges = (array) => {
    array.sort((e, i) => e - i);

    let ranges = [{ x: array[0], y: array[0] }];

    for (let i = 1; i < array.length; i++) {
      let currentRange = ranges[ranges.length - 1];

      if (array[i] <= currentRange.y + 1) {
        currentRange.y = array[i];
      } else {
        ranges.push({ x: array[i], y: array[i] });
      }
    }
    return ranges;
  };

  componentWillReceiveProps(newProps) {
    if (newProps.data !== null) {
      this.ft && this.ft.clearInstance();
      delete this.ft;
      document.getElementById("fv1").innerHTML = "";
      this.ft = new window.FeatureViewer(newProps.data.sequence, "#fv1", {
        showAxis: true,
        showSequence: true,
        brushActive: true, //zoom
        toolbar: true, //current zoom & mouse position
        bubbleHelp: false,
        zoomMax: 50, //define the maximum range of the zoom
      });

      this.ft.onFeatureSelected(function (d) {
        console.log("start");
        console.log(d.detail.start);
        console.log("end");
        console.log(d.detail.end);
      });

      if (newProps.data.predictedDisorder) {
        let disorder = this.findIndexes(newProps.data.predictedDisorder, ["X"]);

        this.ft.addFeature({
          data: this.findRanges(disorder["X"]),
          name: "Disorder",
          color: "#0F8292",
          type: "rect",
          height: 20,
        });
      }

      if (newProps.data.predictedBindingMetal) {
        let bindingMetal = this.findIndexes(newProps.data.predictedBindingMetal, ["M"]);

        this.ft.addFeature({
          data: this.findRanges(bindingMetal["M"]),
          name: "Metal",
          color: "#4940e6",
          type: "rect",
          height: 20,
        });
      }
      
      if (newProps.data.predictedBindingNucleicAcids) {
        let bindingNucleicAcids = this.findIndexes(newProps.data.predictedBindingNucleicAcids, ["N"]);

        this.ft.addFeature({
          data: this.findRanges(bindingNucleicAcids["N"]),
          name: "Nucleic Acids",
          color: "#d44515",
          type: "rect",
          height: 20,
        });
      }

      if (newProps.data.predictedBindingSmallMolecules) {
        let bindingSmallMolecules = this.findIndexes(newProps.data.predictedBindingSmallMolecules, ["S"]);

        this.ft.addFeature({
          data: this.findRanges(bindingSmallMolecules["S"]),
          name: "Small Molecules",
          color: "#389428",
          type: "rect",
          height: 20,
        });
      }

      if (newProps.data.predictedDSSP3) {
        let secondaryStructure3 = this.findIndexes(
          newProps.data.predictedDSSP3,
          ["H", "E", "C"]
        );

        this.ft.addFeature({
          data: this.findRanges(secondaryStructure3["H"]),
          name: "DSSP3-Helix",
          color: "#ccd96a",
          type: "rect",
          height: 20,
        });

        this.ft.addFeature({
          data: this.findRanges(secondaryStructure3["E"]),
          name: "DSSP3-Sheet",
          color: "#d958aa",
          type: "rect",
          height: 20,
        });

        this.ft.addFeature({
          data: this.findRanges(secondaryStructure3["C"]),
          name: "DSSP3-Other",
          color: "#4cd9c2",
          type: "rect",
          height: 20,
        });

      }

      if(newProps.data.predictedConservation) {

        var conservation = []
        newProps.data.predictedConservation.forEach((y, i) => {
          conservation.push({
            x: i,
            y: y,
          });
        });
        
        this.ft.addFeature({
          data: conservation,
          name: "Conservation",
          className: "test5",
          color: "#008B8D",
          type: "line",
          filter: "type2",
          height: 10,
        });
      }
    }
  }

  render() {
    return <div className="use-bootstrap" id={"fv1"}/>;
  }
}

FeatureViewer.propTypes = {
  data: PropTypes.object,
};

export default FeatureViewer;
