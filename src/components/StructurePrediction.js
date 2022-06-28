import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

class StructurePrediction extends React.Component {

  selectFeature() {
    console.log(this.viewerInstance)
    this.viewerInstance.visual.select({ data: [{ struct_asym_id: 'B', start_residue_number: 1, end_residue_number: 2, color:{r:255,g:255,b:0}, focus: true }]})
  };


  componentWillReceiveProps(newProps) {
    var data = newProps.data;

    // Make sure data and data.structure and data.structure.pdb exist!
    var pdbBlob = new Blob([data.structure.pdb], {
      type: "text/plain",
    });
    //Create plugin instance
    var viewerInstance = new window.PDBeMolstarPlugin();

    //Set options (Checkout available options list in the documentation)
    var options = {
      customData: {
        url: URL.createObjectURL(pdbBlob),
        format: "pdb",
      },
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

    //Get element from HTML/Template to place the viewer
    var viewerContainer = document.getElementById("myViewer");

    //Call render method to display the 3D view
    viewerInstance.render(viewerContainer, options);


    //Select/Highlight not working?
    viewerInstance.visual.select({
      data: [
        {
          entity_id: "1",
          struct_asym_id: "A",
          start_residue_number: 1,
          end_residue_number: 5,
          start: 1,
          end: 5
        },
      ],
    });

  }

  render() {
    return (
     
      <div id="myViewer" style={{ textAlign: 'center', float: 'inherit', width: '1296px', height: '700px', position: 'relative' }}>
      <Button onClick={console.log(14)}>click</Button>
      </div>
    );
  }
}

export default StructurePrediction;