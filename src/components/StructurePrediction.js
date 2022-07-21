import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

class StructurePrediction extends React.Component {

  constructor(props) {
    super(props);

    this.viewerInstance = null
  }

  selectFeature(viewerInstance) {
    console.log('in select feat')
    console.log(viewerInstance)
    viewerInstance.visual.select({ data: [{ struct_asym_id: 'B', start_residue_number: 1, end_residue_number: 2, color:{r:255,g:255,b:0}, focus: true }]})
  };

  componentWillReceiveProps(newProps) {
    var data = newProps.data;

    console.log(data)

    // Make sure data and data.structure and data.structure.pdb exist!
    var pdbBlob = new Blob([data], {
      type: "text/plain",
    });
    //Create plugin instance
    this.viewerInstance = new window.PDBeMolstarPlugin();

    //Set options (Checkout available options list in the documentation)
    this.options = {
      
      customData: {
        url: URL.createObjectURL(pdbBlob),
        format: "pdb",
      },
      
      //moleculeId: '2nnu',
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
    this.viewerContainer = document.getElementById("myViewer");

    //Call render method to display the 3D view
    this.viewerInstance.render(this.viewerContainer, this.options);


  }

  render() {
    return (
     
      <>
        {this.viewerInstance != null && (
          <div></div>
          /*
        <Button onClick={(e) => {
          console.log('in click function')
          debugger;
          this.viewerInstance.visual.select({ data: [{struct_asym_id: 'B', color:{r:255,g:255,b:0}, focus:true}], nonSelectedColor: {r:255,g:255,b:255} })
        }}>Click</Button>
        */
      )}
      
      <div id="myViewer" style={{ textAlign: 'center', float: 'inherit', width: '1296px', height: '700px', position: 'relative' }}>
      </div></>
    );
  }
}

export default StructurePrediction;