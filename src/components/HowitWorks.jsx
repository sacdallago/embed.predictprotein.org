import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Diagram from "../assets/PredDiagram.png";

export default function HowitWorks() {
    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs="12" md="10">
                    <h3 className="mb-5"> How it works </h3>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="12" md="10">
                    <img
                        width="80%"
                        className="ms-3"
                        src={Diagram}
                        alt="Diagramm of LambdaPP's architecture"
                    />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs="12" md="10">
                    <p className="col-md-10">
                        {/* NOTE: without col-md-10 the paragraph does not format correctly.*/}
                        <strong>LambdaPP pipeline:</strong> Starting with an
                        amino acid sequence, LambdaPP orchestrates the
                        prediction of (1) protein structure using ColabFold
                        (45); (2) per-protein features: Gene Ontology (GO)
                        annotations using goPredSim (38), subcellular location
                        using LA (64); (3) per-residue features: binding
                        residues using bindEmbed21DL (39), conservation using
                        ProtT5cons (42), disorder using SETH (29), secondary
                        structure using ProtT5-sec (23), helical and barrel
                        transmembrane (TM) regions using TMbed (13); and (4)
                        variant effect scores using VESPAl (42).
                    </p>
                </Col>
            </Row>
        </Container>
    );
}
