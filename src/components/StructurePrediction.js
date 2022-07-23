import React from "react";

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
    } else {
      console.error("Could not instantiate structure component!")
    }
  }

  componentWillReceiveProps(newProps) {
    let data = newProps.data;

    data && this.reDraw3D(data);
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

  selectFeature(viewerInstance) {
    console.log('in select feat')
    console.log(viewerInstance)
    viewerInstance.visual.select({ data: [{ struct_asym_id: 'B', start_residue_number: 1, end_residue_number: 2, color:{r:255,g:255,b:0}, focus: true }]})
  };

  render() {
    return (
        <div id="structureViewer" style={{float: 'inherit',  width: 'inherit', height: '700px', position: 'relative', backgroundColor: "#d9d9d9"}}>
          <p style={{fontSize: "5em", textAlign: "center"}}>:(</p>
        </div>
    );
  }
}

export default StructurePrediction;