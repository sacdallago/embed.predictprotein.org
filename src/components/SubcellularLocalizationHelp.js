import React from "react";
import {Accordion} from "react-bootstrap";
import {MDBTypography} from "mdb-react-ui-kit";

export default class SubcellularLocalizationHelp extends React.Component {
    render() {
        return <>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Help</Accordion.Header>
                    <Accordion.Body>
                        <br/>
                        <MDBTypography variant={"body2"} as={"div"}>
                            <h5>What is predicted?</h5>
                        </MDBTypography>
                        <br/>
                        <MDBTypography>
                            LA ProtT5 predicts the sub-cellular localization of proteins in ten classes (nucleus, cytoplasm, extracellular space, mitochondrion, cell membrane, endoplasmatic reticulum, plastid, Golgi apparatus, lysosome/vacuole and peroxisome). {""}
                            The method was trained and evaluated on eukaryotic proteins.
                        </MDBTypography>

                        <br/>
                        <MDBTypography variant={"body2"} as={"div"}>
                            <h5>Cite</h5>
                        </MDBTypography>
                        <br/>
                        <MDBTypography>
                            Light-Attention: {" "}
                            {
                                <a
                                    href={
                                        "https://academic.oup.com/bioinformaticsadvances/article/1/1/vbab035/6432029"
                                    }
                                    target={"_blank"}
                                    // ref={"author"}
                                >
                                    https://academic.oup.com/bioinformaticsadvances/article/1/1/vbab035/6432029
                                </a>
                            }
                        </MDBTypography>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    }
}
