import React from "react";

import { Container, Col, Row, Placeholder } from "react-bootstrap";
import TextDisplay from "../components/TextDisplay";

export default function LoadingSequenceDisplay() {
    return (
        <Container className="d-flex justify-content-center mt-3">
            <Row>
                <Col md={10}>
                    <span>
                        <Placeholder xs={7} />
                    </span>
                </Col>
            </Row>
            <Row>
                <Col md={10}>
                    <TextDisplay></TextDisplay>
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
