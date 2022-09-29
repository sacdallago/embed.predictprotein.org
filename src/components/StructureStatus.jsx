import React from "react";
import { Alert } from "react-bootstrap";

const resultStatus = null;

class StructureStatus extends React.Component {
    render() {
        return (
            <>
                {this.props.sequence?.length <= 500 &&
                    this.props.structure?.status !== resultStatus.DONE && (
                        <Alert key="warning" variant="warning">
                            ⏱ Your structure is being computed. Depending on the
                            length of your sequence, this could take up to one
                            hour. {""}
                            You may also return to this page at a later time to
                            check the results.
                        </Alert>
                    )}
                {this.props.sequence?.length > 500 &&
                    this.props.structure.link === undefined && (
                        <Alert key="danger" variant="danger">
                            <b>Apologies!</b> Our server can currently only
                            handle structure prediction for sequences shorter
                            than {""}
                            500 amino acids. The sequence you submitted is{" "}
                            {this.props.sequence?.length} amino acids. {""}
                        </Alert>
                    )}

                {/*{this.props.structure?.link !== undefined && (*/}
                {/*    <Alert key="success" variant="success">*/}
                {/*        We are displaying a pre-computed structure from the <a href={"https://alphafold.ebi.ac.uk"} target={"_blank"}>AlphaFold Database</a>.*/}
                {/*    </Alert>*/}
                {/*)}*/}
            </>
        );
    }
}

StructureStatus.propTypes = {};

export default StructureStatus;
