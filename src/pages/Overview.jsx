import React from "react";
import { Accordion, Col, Row, Container } from "react-bootstrap";
import GeneOntology from "../components/Features/GeneOntology";
import SubcellularLocation from "../components/Features/SubcellularLocation";

import FeatureViewer from "../components/FeatureViewer.new";

export const Overview = () => {
    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={12}>
                    <FeatureViewer />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={12}>
                    <Accordion defaultActiveKey={["0", "1"]} flush alwaysOpen>
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
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
};

export default Overview;
