import React from "react";

import { Container, Stack, Nav, Navbar, Row, Col } from "react-bootstrap";

import FeatureViewer from "../components/FeatureViewer";
import StructurePrediction from "../components/StructurePrediction";

import StructureStatus from "../components/StructureStatus";
import FeatureGrabber from "../components/FeatureGrabber";
import StructureDownload from "../components/StructureDownload";
import SequenceDisplay from "../components/SequenceDisplay";

const proteinStatus = null;
const annotationsPlaceholder = null;
const structurePlaceholder = null;
const resultStatus = null;

class Interactive extends React.Component {
    constructor(props) {
        super(props);

        let sequence = window.location.href.substring(
            window.location.href.lastIndexOf("/") + 1
        );

        this.state = {
            sequence: sequence,
            features: annotationsPlaceholder,
            structure: structurePlaceholder,
            protein: {
                uniprotData: {
                    accession: "P12345",
                },
            },
        };
    }

    componentWillReceiveProps(nextProps) {
        let jobParameters = nextProps.jobParameters;
        let jobResults = nextProps.jobResults;

        if (jobParameters.proteinStatus !== proteinStatus.NULL) {
            this.setState({
                proteinStatus: jobParameters.proteinStatus,
                sequence: jobParameters.protein?.sequence,
                protein: jobParameters.protein,

                // jobParams
                embedder: jobParameters.embedder,
                predictor: jobParameters.predictor,

                // Status result
                loadingAnnotations:
                    jobResults["prottrans_t5_xl_u50"].status !==
                    resultStatus.DONE,
                loadingStructure:
                    jobResults["colabfold"].status !== resultStatus.DONE,

                // Results
                features: jobResults["prottrans_t5_xl_u50"],
                structure: jobResults["colabfold"],
            });
        }
    }

    render() {
        return (
            <div className="App">
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand
                            href={
                                "/#/" +
                                (this.state.protein?.uniprotData
                                    ? this.state.protein.uniprotData.accession
                                    : this.state.sequence)
                            }
                            target={"_blank"}
                        >
                            ← Go back to main page
                        </Navbar.Brand>
                    </Container>
                </Navbar>

                <div style={{ display: "none" }}>
                    <SequenceDisplay />
                    <FeatureGrabber />
                </div>

                <Container>
                    <Stack gap={3}>
                        <Row />
                        <Row>
                            <Col>
                                {/*<StructureDownload structure={this.state.structure} sequence={this.state.sequence} />*/}
                                <FeatureViewer data={this.state.features} />
                            </Col>
                        </Row>
                        <Row style={{ width: "100%" }}>
                            <Col>
                                <StructureStatus
                                    structure={this.state.structure}
                                    sequence={this.state.sequence}
                                />
                                <StructurePrediction
                                    data={this.state.structure.pdb}
                                    link={this.state.structure.link}
                                    annotations={this.state.features}
                                />
                            </Col>
                        </Row>
                        <Row />
                    </Stack>
                </Container>
            </div>
        );
    }
}

export default Interactive;
