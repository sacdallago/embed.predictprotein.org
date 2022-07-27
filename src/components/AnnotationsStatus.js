import React from "react";
import {resultStatus} from "../stores/JobResults";
import {Alert} from "react-bootstrap";

class AnnotationsStatus extends React.Component {
    render() {
        return <>
            {this.props.sequence?.length <= 2000 && this.props.features?.status !== resultStatus.DONE && (
                <Alert key="warning" variant="warning">
                    ⏱ Your features are being computed. Depending on the length of your sequence, this could take up to eight seconds. {""}
                </Alert>
            )}
            {this.props.sequence?.length > 2000 && (
                <Alert key="danger" variant="danger">
                    <b>Apologies!</b> Our server can currently only handle feature predictions for sequences up to {""}
                    2000 amino acids. The sequence you submitted is {this.props.sequence?.length} amino acids. {""}
                </Alert>
            )}
        </>
    }
}

AnnotationsStatus.propTypes = {
};

export default AnnotationsStatus;
