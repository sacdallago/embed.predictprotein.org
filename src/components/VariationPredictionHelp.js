import React from "react";
import {Accordion} from "react-bootstrap";
import {MDBTypography} from "mdb-react-ui-kit";

class VariationPredictionHelp extends React.Component {
    render() {
        return <>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Find out more about variation prediction</Accordion.Header>
                    <Accordion.Body>
                        <br />
                        <MDBTypography variant={"body2"} as={"div"}>
                            <h5>What is predicted?</h5>
                        </MDBTypography>
                        <br />
                        <MDBTypography>
                            VESPAl predicts the effect of single amino acid variants across a protein's residue landscape. In other words: {""}
                            what's the likelihood that substituting residue X at position Y with amino acid Z will result in a non-functional sequence?
                        </MDBTypography>

                        <br />
                        <MDBTypography variant={"body2"} as={"div"}>
                            <h5>Cite</h5>
                        </MDBTypography>
                        <br />
                        <MDBTypography>
                            ProtTrans:{" "}
                            {
                                <a
                                    href={"https://ieeexplore.ieee.org/document/9477085"}
                                    target={"_blank"}
                                    // ref={"author"}
                                >
                                    https://ieeexplore.ieee.org/document/9477085
                                </a>
                            }
                            <MDBTypography>
                                VESPAl:{" "}
                                {
                                    <a
                                        href={"https://doi.org/10.1007/s00439-021-02411-y"}
                                        target={"_blank"}
                                        // ref={"author"}
                                    >
                                        https://doi.org/10.1007/s00439-021-02411-y
                                    </a>
                                }
                            </MDBTypography>
                        </MDBTypography>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    }
}

VariationPredictionHelp.propTypes = {
};

export default VariationPredictionHelp;
