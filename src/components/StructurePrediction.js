import React from "react";
import featureComponentWrapper from '../stores/featureDispatcher';

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

      this.data = this.props.data;
    } else {
      console.error("Could not instantiate structure component!")
    }
  }

  componentWillReceiveProps(newProps) {
    if(this.data !== newProps.data && newProps.data !== null){
      this.reDraw3D(newProps.data);
    }

    if(newProps.featureSelection.selectionStart !== null && newProps.featureSelection.selectionEnd !== null){
      this.selectFeature(newProps.featureSelection.selectionStart, newProps.featureSelection.selectionEnd)
    }
  }

  reDraw3D(data) {
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
  }

  selectFeature(start, end) {
    console.log("attempting to select " + start + "-" + end);
    this.viewerInstance.visual.select({
      data: [{
        entity_id: '1',
        struct_asym_id: 'A',
        start_residue_number: start,
        end_residue_number: end,
        focus: true
      }]
    })
  };

  render() {
    return (
        <div id="structureViewer" style={{float: 'inherit',  width: 'inherit', height: '700px', position: 'relative', backgroundColor: "#d9d9d9"}}>
          <p style={{fontSize: "5em", textAlign: "center"}}>:(</p>
        </div>
    );
  }
}

export default featureComponentWrapper(StructurePrediction);