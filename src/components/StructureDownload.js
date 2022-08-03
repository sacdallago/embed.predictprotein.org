import React from "react";
import {resultStatus} from "../stores/JobResults";
import {Button} from "react-bootstrap";

class StructureDownload extends React.Component {
    download(data){
        if(data !== null){
            let c = document.createElement("a");
            c.download = "structure.pdb";

            let t = new Blob([data], {
                type: "text/plain"
            });

            c.href = window.URL.createObjectURL(t);
            c.click();
        }
    }

    render() {
        return <div style={{width: "100%", textAlign: "right"}}>
            {this.props.sequence?.length <= 500 && this.props.structure?.status === resultStatus.DONE &&
            this.props.structure?.link === null && (
                <Button variant="warning" onClick={() => this.download(this.state.data)}>
                    Download PDB file
                </Button>
            )}
        </div>
    }
}

StructureDownload.propTypes = {
};

export default StructureDownload;
