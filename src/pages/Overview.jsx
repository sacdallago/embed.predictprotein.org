import React from "react";
import { Accordion, Col, Row, Container } from "react-bootstrap";
import { useMatomo } from "@jonkoops/matomo-tracker-react";

import GeneOntology from "../components/Features/GeneOntology";
import SubcellularLocation from "../components/Features/SubcellularLocation";
import VariantEffectPrediction from "../components/Features/VariantEffectPrediction";

import FeatureViewer from "../components/Features/FeatureViewer";
import StructureProgress from "../components/StructureProgress";

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
            {/* <Row className="justify-content-center">
                <Col md={12}>
                    <FeatureViewer />
                </Col>
            </Row> */}
            <Row className="justify-content-center">
                <Col md={12}>
                    <Accordion defaultActiveKey={["0", "2"]} flush alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                Subceullular Location
                            </Accordion.Header>
                            <Accordion.Body>
                                <SubcellularLocation />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Gene Ontology</Accordion.Header>
                            <Accordion.Body>
                                <GeneOntology />
                            </Accordion.Body>
                        </Accordion.Item>{" "}
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>
                                Single Amino Acid Variant Effect
                            </Accordion.Header>
                            <Accordion.Body>
                                <VariantEffectPrediction />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={12}>
                    <StructureProgress />
                </Col>
            </Row>
        </Container>
    );
};

export default Overview;
