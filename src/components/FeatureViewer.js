import React from "react";
import PropTypes from "prop-types";
import {proteinColorSchemes} from "../utils/Graphics";

class FeatureViewer extends React.Component {
  componentDidMount() {

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
    if(array.length < 1){
      return []
    }

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

      if(newProps.data.predictedTransmembrane) {
        let toplogy = this.findIndexes(
            newProps.data.predictedTransmembrane,
            ["B", "b", "H", "h", "S"]
        );

        let data = [
          ...this.findRanges(toplogy["H"]).map(e => {
            e['description'] = "Helix - outwards";
            e['color'] = proteinColorSchemes["dssp8"].contrast["H"];
            return e
          }),
          ...this.findRanges(toplogy["h"]).map(e => {
            e['description'] = "Helix - inwards";
            e['color'] = proteinColorSchemes["dssp8"].contrast["h"];
            return e
          }),
          ...this.findRanges(toplogy["B"]).map(e => {
            e['description'] = "Sheet - outwards";
            e['color'] = proteinColorSchemes["dssp8"].contrast["B"];
            return e
          }),
          ...this.findRanges(toplogy["b"]).map(e => {
            e['description'] = "Sheet - inwards";
            e['color'] = proteinColorSchemes["dssp8"].contrast["b"];
            return e
          }),
          ...this.findRanges(toplogy["S"]).map(e => {
            e['description'] = "Signal peptide";
            e['color'] = proteinColorSchemes["dssp8"].contrast["S"];
            return e
          }),
        ];

        console.log(data)

        this.ft.addFeature({
          data: data,
          name: "Topology",
          color: "#989898",
          type: "rect",
          height: 20,
        });
      }

      if (newProps.data.predictedDSSP3) {
        let secondaryStructure3 = this.findIndexes(
            newProps.data.predictedDSSP3,
            ["H", "E", "C"]
        );

        let data = [
          ...this.findRanges(secondaryStructure3["H"]).map(e => {
            e['description'] = "Helix";
            e['color'] = proteinColorSchemes["dssp8"].contrast["H"];
            e['level'] = 0;
            return e
          }),
          ...this.findRanges(secondaryStructure3["E"]).map(e => {
            e['description'] = "Sheet";
            e['color'] = proteinColorSchemes["dssp8"].contrast["E"];
            e['level'] = 1;
            return e
          }),
          ...this.findRanges(secondaryStructure3["C"]).map(e => {
            e['description'] = "Other";
            e['color'] = proteinColorSchemes["dssp8"].contrast["C"];
            e['level'] = 2;
            return e
          }),
        ];

        this.ft.addFeature({
          data: data,
          name: "Structure",
          color: "#989898",
          type: "rect",
          height: 20,
        });
      }

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

      if (newProps.data.predictedBindingMetal && newProps.data.predictedBindingNucleicAcids && newProps.data.predictedBindingSmallMolecules) {

        let bindingMetal = this.findIndexes(newProps.data.predictedBindingMetal, ["M"]);
        bindingMetal = this.findRanges(bindingMetal["M"]).map(e => {
          e['description'] = "Metal";
          e['color'] = proteinColorSchemes["metal"].contrast["M"];
          return e
        });

        let bindingNucleicAcids = this.findIndexes(newProps.data.predictedBindingNucleicAcids, ["N"]);
        bindingNucleicAcids = this.findRanges(bindingNucleicAcids["N"]).map(e => {
          e['description'] = "Nucleic Acids";
          e['color'] = proteinColorSchemes["nucleicAcids"].contrast["N"];
          return e
        });

        let bindingSmallMolecules = this.findIndexes(newProps.data.predictedBindingSmallMolecules, ["S"]);
        bindingSmallMolecules = this.findRanges(bindingSmallMolecules["S"]).map(e => {
          e['description'] = "Small molecule";
          e['color'] = proteinColorSchemes["smallMolecules"].contrast["S"];
          return e
        });

        let data = [...bindingSmallMolecules, ...bindingNucleicAcids, ...bindingMetal]

        this.ft.addFeature({
          data: data,
          name: "Binding",
          color: "#989898",
          type: "rect",
          height: 20,
        });
      }

      if(newProps.data.predictedConservation) {
        this.ft.addFeature({
          data: newProps.data.predictedConservation.map((y, i) => {
            return {
              x: i,
              y: y}
          }),
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
