import React from "react";
import { Accordion, Col, Row, Container } from "react-bootstrap";
import { useMatomo } from "@jonkoops/matomo-tracker-react";

import GeneOntology from "../components/Features/GeneOntology";
import GeneOntologyDetail from "../components/Features/GeneOntologyDetail";
import SubcellularLocation from "../components/Features/SubcellularLocation";
import SubcellularLocationDetail from "../components/Features/SubcellularLocationDetail";
import VariantEffectPrediction from "../components/Features/VariantEffectPrediction";
import VariantEffectPredictionDetail from "../components/Features/VariantEffectPredictionDetail";

import FeatureViewer from "../components/Features/FeatureViewer";
import StructureProgress from "../components/StructureProgress";
import StructureDisplay from "../components/Features/StructureDisplay";
import StructureDisplayDetail from "../components/Features/StructureDisplayDetail";
import FeatureViewerDetail from "../components/Features/FeatureViewerDetail";

export const Overview = () => {
    const { trackPageView } = useMatomo();

    // Track page view
    React.useEffect(() => {
        trackPageView({
            documentTitle: "Overview",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Row className="justify-content-center mb-5">
                <Col md={12}>
                    <h2>Residue Features</h2>
                    <FeatureViewerDetail />
                    <FeatureViewer />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={12}>
                    <h2>Protein Features</h2>
                    <Accordion defaultActiveKey={["0", "2"]} flush alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                Subceullular Location
                            </Accordion.Header>
                            <Accordion.Body>
                                <SubcellularLocationDetail />
                                <SubcellularLocation />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Gene Ontology</Accordion.Header>
                            <Accordion.Body>
                                <GeneOntologyDetail />
                                <GeneOntology />
                            </Accordion.Body>
                        </Accordion.Item>{" "}
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>
                                Single Amino Acid Variant Effect
                            </Accordion.Header>
                            <Accordion.Body>
                                <VariantEffectPredictionDetail />
                                <VariantEffectPrediction />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
            <Row className="justify-content-center mt-5">
                <Col md={12}>
                    <h2>3D Structure</h2>
                    <StructureProgress />
                    <StructureDisplayDetail />
                    <StructureDisplay />
                </Col>
            </Row>
        </Container>
    );
};

export default Overview;
