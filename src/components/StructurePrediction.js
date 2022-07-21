import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

class StructurePrediction extends React.Component {

  constructor(props) {
    super(props);
    console.log('in structure prediction constructor')
    this.viewerInstance = null
    this.draw3D(props)
  }
  delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  draw3D(props) {
    var data = props.data;
    console.log('in structure prediction componentWillReceiveProps')

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

  selectFeature(viewerInstance) {
    console.log('in select feat')
    console.log(viewerInstance)
    viewerInstance.visual.select({ data: [{ struct_asym_id: 'B', start_residue_number: 1, end_residue_number: 2, color:{r:255,g:255,b:0}, focus: true }]})
  };

  componentWillReceiveProps(newProps) {
    var data = newProps.data;

    console.log('in structure prediction componentWillReceiveProps')

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
    setTimeout(console.log('waited'), 10000);
    //Call render method to display the 3D view
    this.viewerInstance.render(this.viewerContainer, this.options);
  }

  render() {
    return (
     
   
      <div id="myViewer" style={{ textAlign: 'center', float: 'inherit',  width: '1296px', height: '700px', position: 'relative' }}> 
      in structure viewer container
      </div>
      
    );
  }
}

export default StructurePrediction;