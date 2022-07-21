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
                            LocTree3 predicts the sub-cellular localization for
                            all proteins in all domains of life. Water-soluble
                            globular and trans-membrane proteins are predicted in
                            one 18 classes in Eukaryota (chloroplast, chloroplast
                            membrane, cytosol, ER, Golgi, ER membrane, Golgi
                            membrane, extra-cellular, mitochondria, mitochondria
                            membrane, nucleus, nucleus membrane, peroxisome,
                            peroxisome membrane, plasma membrane, plastid, vacuole
                            and vacuole membrane), 6 classes in Bacteria (cytosol,
                            extra-cellular, fimbrium, outer membrane, periplasmic
                            space and plasma membrane) and 3 classes in Archaea
                            (cytosol, extra-cellular and plasma membrane). Each
                            prediction is accompanied by a confidence score
                            (ranging from 0=unreliable to 100=reliable) and a Gene
                            Ontology term of the predicted localization class.
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
