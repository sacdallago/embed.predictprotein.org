import React from "react";
import featureComponentWrapper from '../stores/featureDispatcher';
import {proteinColorSchemes} from "../utils/Graphics";

class StructurePrediction extends React.Component {

  constructor(props) {
    super(props);

    this.options = {
      hideControls: true,
      visualStyle: "cartoon",
      hideCanvasControls: ['expand', 'selection', 'animation', 'controlToggle', 'controlInfo'],
      alphafoldView: true,
      bgColor: {
        b: 255,
        g: 255,
        r: 255,
      },
    };

    this.state = {
      annotations: {...this.props.annotations},
      data: this.props.data,
      link: this.props.link
    }

    this.annotations = {...this.props.annotations};
  }

  componentDidMount() {
    if (this.props.data !== null) {
      //Create plugin instance
      this.viewerInstance = new window.PDBeMolstarPlugin();

      // Make sure data and data.structure and data.structure.pdb exist!
      let pdbBlob = new Blob([this.props.data], {
        type: "text/plain",
      });

      //Get element from HTML/Template to place the viewer
      this.viewerContainer = document.getElementById("structureViewer");

      //Call render method to display the 3D view
      this.viewerInstance.render(this.viewerContainer, {
        ...this.options,

        customData: {
          url: URL.createObjectURL(pdbBlob),
          format: "pdb",
        }
      });
    } else {
      console.error("Could not instantiate structure component!")
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

    let ranges = [{ start_residue_number: array[0], end_residue_number: array[0] }];

    for (let i = 1; i < array.length; i++) {
      let currentRange = ranges[ranges.length - 1];

      if (array[i] <= currentRange.end_residue_number + 1) {
        currentRange.end_residue_number = array[i];
      } else {
        ranges.push({ start_residue_number: array[i], end_residue_number: array[i] });
      }
    }
    return ranges;
  };

  componentWillReceiveProps(newProps) {

    this.setState({
      annotaitons: newProps.annotations,
      data: newProps.data,
      link: newProps.link
    })

    if(newProps.data !== null){
      this.reDraw3D(newProps.data, newProps.featureSelection.selectionStart, newProps.featureSelection.selectionEnd);
    }

    if(newProps.link !== null){
      this.reDrawFromAFDB(newProps.link, newProps.featureSelection.selectionStart, newProps.featureSelection.selectionEnd)
    }

    if (this.annotations !== newProps.annotations && newProps.annotations !== null) {
      this.annotations = {...newProps.annotations};

      this.addAnnotations();
    }
  }

  addAnnotations(){
    if(this.annotations.predictedTransmembrane) {
      let toplogy = this.findIndexes(
          this.annotations.predictedTransmembrane,
          ["B", "b", "H", "h", "S", "."]
      );

      this.annotations.predictedTransmembrane = [
        ...this.findRanges(toplogy["."]).map(e => {
          e['color'] = proteinColorSchemes["predictedTransmembrane"].contrast["."];
          return e
        }),
        ...this.findRanges(toplogy["H"]).map(e => {
          e['color'] = proteinColorSchemes["predictedTransmembrane"].contrast["H"];
          return e
        }),
        ...this.findRanges(toplogy["h"]).map(e => {
          e['color'] = proteinColorSchemes["predictedTransmembrane"].contrast["h"];
          return e
        }),
        ...this.findRanges(toplogy["B"]).map(e => {
          e['color'] = proteinColorSchemes["predictedTransmembrane"].contrast["B"];
          return e
        }),
        ...this.findRanges(toplogy["b"]).map(e => {
          e['color'] = proteinColorSchemes["predictedTransmembrane"].contrast["b"];
          return e
        }),
        ...this.findRanges(toplogy["S"]).map(e => {
          e['color'] = proteinColorSchemes["predictedTransmembrane"].contrast["S"];
          return e
        }),
      ];
    }

    if (this.annotations.predictedDSSP3) {
      let secondaryStructure3 = this.findIndexes(
          this.annotations.predictedDSSP3,
          ["H", "E", "C"]
      );

      this.annotations.predictedDSSP3 = [
        ...this.findRanges(secondaryStructure3["H"]).map(e => {
          e['color'] = proteinColorSchemes["dssp8"].contrast["H"];
          return e
        }),
        ...this.findRanges(secondaryStructure3["E"]).map(e => {
          e['color'] = proteinColorSchemes["dssp8"].contrast["E"];
          return e
        }),
        ...this.findRanges(secondaryStructure3["C"]).map(e => {
          e['color'] = proteinColorSchemes["dssp8"].contrast["C"];
          return e
        }),
      ];
    }

    if (this.annotations.predictedDisorder) {
      let disorder = this.findIndexes(this.annotations.predictedDisorder, ["X", "-"]);

      this.annotations.predictedDisorder = [
        ...this.findRanges(disorder["X"]).map(e => {
          e['color'] = proteinColorSchemes["disorder"].contrast["X"];
          return e
        }),
        ...this.findRanges(disorder["-"]).map(e => {
          e['color'] = proteinColorSchemes["disorder"].contrast["-"];
          return e
        }),
      ];
    }

    if(this.annotations.predictedConservation) {
      let conservation = this.findIndexes(this.annotations.predictedConservation.map(e => e + "").join(""), ["0", "1", "2", "3", "4", "5", "6", "7", "8"]);

      this.annotations.predictedConservation = [
        ...this.findRanges(conservation["0"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["0"];
          return e
        }),
        ...this.findRanges(conservation["1"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["1"];
          return e
        }),
        ...this.findRanges(conservation["2"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["2"];
          return e
        }),
        ...this.findRanges(conservation["3"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["3"];
          return e
        }),
        ...this.findRanges(conservation["4"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["4"];
          return e
        }),
        ...this.findRanges(conservation["5"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["5"];
          return e
        }),
        ...this.findRanges(conservation["6"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["6"];
          return e
        }),
        ...this.findRanges(conservation["7"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["7"];
          return e
        }),
        ...this.findRanges(conservation["8"]).map(e => {
          e['color'] = proteinColorSchemes["conservation"].contrast["8"];
          return e
        }),
      ];
    }

    if (this.annotations.predictedBindingMetal) {
      let bindingMetal = this.findIndexes(this.annotations.predictedBindingMetal, ["M", "-"]);

      this.annotations.predictedBindingMetal = [
        ...this.findRanges(bindingMetal["M"]).map(e => {
          e['color'] = proteinColorSchemes["metal"].contrast["M"];
          return e
        }),
        ...this.findRanges(bindingMetal["-"]).map(e => {
          e['color'] = proteinColorSchemes["metal"].contrast["-"];
          return e
        }),
      ];
    }

    if (this.annotations.predictedBindingNucleicAcids) {
      let bindingNucleic = this.findIndexes(this.annotations.predictedBindingNucleicAcids, ["N", "-"]);

      this.annotations.predictedBindingNucleicAcids = [
        ...this.findRanges(bindingNucleic["N"]).map(e => {
          e['color'] = proteinColorSchemes["nucleicAcids"].contrast["N"];
          return e
        }),
        ...this.findRanges(bindingNucleic["-"]).map(e => {
          e['color'] = proteinColorSchemes["nucleicAcids"].contrast["-"];
          return e
        }),
      ];
    }

    if (this.annotations.predictedBindingSmallMolecules) {
      let bindingSmall = this.findIndexes(this.annotations.predictedBindingSmallMolecules, ["S", "-"]);

      this.annotations.predictedBindingSmallMolecules = [
        ...this.findRanges(bindingSmall["S"]).map(e => {
          e['color'] = proteinColorSchemes["smallMolecules"].contrast["S"];
          return e
        }),
        ...this.findRanges(bindingSmall["-"]).map(e => {
          e['color'] = proteinColorSchemes["smallMolecules"].contrast["-"];
          return e
        }),
      ];
    }
  }

  overlayAnnotations(annotationName){
    switch (annotationName) {
      case "secondary_structure":
        this.viewerInstance.visual.select({
          data: this.annotations.predictedDSSP3
        })
        break;
      case "disorder":
        this.viewerInstance.visual.select({
          data: this.annotations.predictedDisorder
        })
        break;
      case "topology":
        this.viewerInstance.visual.select({
          data: this.annotations.predictedTransmembrane
        })
        break;
      case "conservation":
        this.viewerInstance.visual.select({
          data: this.annotations.predictedConservation
        })
        break;
      case "metal":
        this.viewerInstance.visual.select({
          data: this.annotations.predictedBindingMetal
        })
        break;
      case "small":
        this.viewerInstance.visual.select({
          data: this.annotations.predictedBindingSmallMolecules
        })
        break;
      case "nucleic":
        this.viewerInstance.visual.select({
          data: this.annotations.predictedBindingNucleicAcids
        })
        break;
    }
  }

  reDrawFromAFDB(link, start, end) {

    //Call render method to display the 3D view
    this.viewerInstance.visual.update({
      ...this.options,
      customData: {
        url: link,
        format: "cif",
      }
    });


    if (start !== null && end !== null){
      setTimeout(() => this.viewerInstance.visual.select({
        data: [{
          start_residue_number: start,
          end_residue_number: end,
          focus: true
        }]
      }), 500)
    }
  }

  reDraw3D(data, start, end) {
    // Make sure data and data.structure and data.structure.pdb exist!
    let pdbBlob = new Blob([data], {
      type: "text/plain",
    });

    //Call render method to display the 3D view
    this.viewerInstance.visual.update({
      ...this.options,
      customData: {
        url: URL.createObjectURL(pdbBlob),
        format: "pdb",
      }
    });

    if (start !== null && end !== null){
      setTimeout(() => this.viewerInstance.visual.select({
        data: [{
          start_residue_number: start,
          end_residue_number: end,
          focus: true
        }]
      }), 500)

    }
  }

  render() {
    return (
        <>
          <div id="structureViewer" style={{float: 'inherit',  width: 'inherit', height: '700px', position: 'relative', backgroundColor: "#d9d9d9"}}>
            <p style={{fontSize: "5em", textAlign: "center"}}>:(</p>
          </div>
          {(this.annotations?.predictedDisorder !== undefined || this.annotations?.predictedDSSP3 !== undefined || this.annotations?.predictedTransmembrane !== undefined) && (
              <div>
                <p>
                  <h2>👇 Click to color structure by predictions of:</h2> {" "}
                  <ul>
                    {this.annotations?.predictedDSSP3 && <li style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => this.overlayAnnotations("secondary_structure")}>Secondary structure
                      (<span style={{backgroundColor:proteinColorSchemes["dssp8"].contrast["H"]}}>helix</span>
                      <span style={{color: "white", backgroundColor:proteinColorSchemes["dssp8"].contrast["E"]}}>strand</span>
                      <span style={{backgroundColor:proteinColorSchemes["dssp8"].contrast["C"]}}>other</span>
                      )
                      {""}</li>} {" "}
                    {this.annotations?.predictedConservation && <li style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => this.overlayAnnotations("conservation")}>Conservation
                      (<span style={{color: "white", backgroundColor:proteinColorSchemes["conservation"].contrast["0"]}}>variable</span>{""}
                      <span style={{color: "white", backgroundColor:proteinColorSchemes["conservation"].contrast["1"]}}>-</span>{""}
                      <span style={{backgroundColor:proteinColorSchemes["conservation"].contrast["2"]}}>-</span>{""}
                      <span style={{backgroundColor:proteinColorSchemes["conservation"].contrast["3"]}}>-</span>{""}
                      <span style={{backgroundColor:proteinColorSchemes["conservation"].contrast["4"]}}>-</span>{""}
                      <span style={{backgroundColor:proteinColorSchemes["conservation"].contrast["5"]}}>-</span>{""}
                      <span style={{backgroundColor:proteinColorSchemes["conservation"].contrast["6"]}}>-</span>{""}
                      <span style={{backgroundColor:proteinColorSchemes["conservation"].contrast["7"]}}>-</span>{""}
                      <span style={{color: "white", backgroundColor:proteinColorSchemes["conservation"].contrast["8"]}}>conserved</span>)
                    </li>} {" "}
                    {this.annotations?.predictedTransmembrane && <li style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => this.overlayAnnotations("topology")}>Topology
                      (strand <span style={{color: "white", backgroundColor:proteinColorSchemes["predictedTransmembrane"].contrast["B"]}}>in→OU</span>{""}
                      <span style={{color: "white", backgroundColor:proteinColorSchemes["predictedTransmembrane"].contrast["b"]}}>T→in</span>, {""}
                      helix <span style={{color: "white", backgroundColor:proteinColorSchemes["predictedTransmembrane"].contrast["H"]}}>in→O</span>{""}
                      <span style={{backgroundColor:proteinColorSchemes["predictedTransmembrane"].contrast["h"]}}>UT→in</span>, {""}
                      <span style={{backgroundColor:proteinColorSchemes["predictedTransmembrane"].contrast["S"]}}>signal peptide</span>).
                    </li>} {" "}
                    {this.annotations?.predictedBindingSmallMolecules && <li style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => this.overlayAnnotations("small")}><span style={{color: "white", backgroundColor:proteinColorSchemes["smallMolecules"].contrast["S"]}}>Small</span> molecule binding </li>} {" "}
                    {this.annotations?.predictedBindingNucleicAcids && <li style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => this.overlayAnnotations("nucleic")}><span style={{color: "white", backgroundColor:proteinColorSchemes["nucleicAcids"].contrast["N"]}}>Nucleic</span> acid binding </li>} {" "}
                    {this.annotations?.predictedBindingMetal && <li style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => this.overlayAnnotations("metal")}><span style={{color: "white", backgroundColor:proteinColorSchemes["metal"].contrast["M"]}}>Metal</span> binding </li>} {" "}
                    {this.annotations?.predictedDisorder && <li style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => this.overlayAnnotations("disorder")}><span style={{color: "white", backgroundColor:proteinColorSchemes["disorder"].contrast["X"]}}>Disorder</span> </li>} {" "}
                  </ul>
                </p>
              </div>
          )}
        </>
    );
  }
}

export default featureComponentWrapper(StructurePrediction);