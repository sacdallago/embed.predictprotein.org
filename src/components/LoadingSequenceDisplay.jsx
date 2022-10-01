import React from "react";

import { Container, Col, Row, Placeholder } from "react-bootstrap";
import TextDisplay from "../components/TextDisplay";

export default function LoadingSequenceDisplay() {
    return (
        <Container className="mt-3">
            <Row className="justify-content-center">
                <Col md={8}>
                    <span>
                        <Placeholder xs={5} />
                    </span>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={8}>
                    <TextDisplay>
                        <Placeholder xs={6} />
                        <Placeholder xs={5} />
                    </TextDisplay>
                </Col>
            </Row>
            {/* <Row className="mt-3">
                    <Col md={8}></Col>
                    <Col md={2}>
                        <Button
                            id="new-input"
                            variant="danger"
                            onClick={() => new_input()}
                        >
                            New Query
                        </Button>
                    </Col>
                </Row> */}
        </Container>
    );
}
