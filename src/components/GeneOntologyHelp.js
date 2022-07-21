import React from "react";
import {Accordion} from "react-bootstrap";
import {MDBTypography} from "mdb-react-ui-kit";

export default class GeneOntologyHelp extends React.Component {
    render() {
        return <>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Help</Accordion.Header>
                    <Accordion.Body>
                        <br />
                        <MDBTypography variant={"body2"} as={"div"}>
                            <h5>What is predicted?</h5>
                        </MDBTypography>
                        <br />
                        <MDBTypography>
                            The output of goPredSim is a list of Gene Ontology
                            (GO) terms. GO thrives to capture the complexity of
                            protein function and standardize the vocabulary used
                            to describe those in a human- and machine-readable
                            manner. GO separates different aspects of function
                            into three hierarchies: MFO (Molecular Function
                            Ontology), BPO (biological process ontology), and
                            CCO (cellular component(s) or subcellular
                            localization(s) in which the protein acts). Each
                            ontology is a rooted graph in which each node
                            represents a GO term and each link a functional
                            relationship. Thus, the prediction of our method can
                            be seen as three subgraphs of the full ontologies.
                            These three subgraphs are displayed below the
                            tabular result. Often, the tabular result only
                            contain very specific functional terms not
                            reflecting the more general role of the protein that
                            can be inferred by going to the root of the
                            ontology. The graphical results show such terms
                            (predicted: yellow boxes, inferred: white boxes).
                        </MDBTypography>
                        <br />
                        <MDBTypography variant={"body2"} as={"div"}>
                            <h5>
                                What can you expect from GO term predictions?
                            </h5>
                        </MDBTypography>
                        <br />
                        <MDBTypography>
                            Replicating the conditions of CAFA3 which allows a
                            comparison of our method to other state-of-the-art
                            approaches showed that our method would have been
                            competitive with the top 10 CAFA3 competitors and
                            clearly outperformed homology-based inference
                            achieving Fmax(BPO)=37±2%, Fmax(MFO)=50±2%,
                            Fmax(CCO)=58±2%. Applying a new dataset not
                            available during method development and preliminary
                            results from CAFA4 support those results. For each
                            prediction a reliability score is provided which is
                            derived based on the distance of the query protein
                            and the closest annotated protein in SeqVec
                            embedding space. If this score is {">"}0.5 we expect
                            a precision and recall of ~50% for BPO and MFO and
                            ~60% for CCO.
                        </MDBTypography>

                        <br />
                        <MDBTypography variant={"body2"} as={"div"}>
                            <h5>Computational details</h5>
                        </MDBTypography>
                        <br />
                        <MDBTypography>
                            Our method consists of three steps: first, the
                            language model SeqVec is used to represent the query
                            protein as vectors (embeddings). That is used to
                            compute the pairwise Euclidean distance to each
                            embedding of a set of annotated proteins (this
                            lookup set is pre-computed). As not all proteins
                            hold annotations to all three ontologies, we pick
                            the most similar protein for each of the three
                            ontologies separately. Then, the annotation of the
                            most similar protein for each ontology is
                            transferred to the query protein.
                        </MDBTypography>

                        <br />
                        <MDBTypography variant={"body2"} as={"div"}>
                            <h5>Cite</h5>
                        </MDBTypography>
                        <br />
                        <MDBTypography>
                            goPredSim:{" "}
                            {
                                <a
                                    href={
                                        "https://www.nature.com/articles/s41598-020-80786-0"
                                    }
                                    target={"_blank"}
                                    // ref={"author"}
                                >
                                    https://www.nature.com/articles/s41598-020-80786-0
                                </a>
                            }
                        </MDBTypography>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    }
}
