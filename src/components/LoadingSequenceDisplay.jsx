import React from "react";

import { Container, Col, Row, Placeholder } from "react-bootstrap";
import TextDisplay from "./TextDisplay";

export default function LoadingSequenceDisplay() {
    return (
        <Container className="mt-3">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Placeholder as="span" animation="glow">
                        <Placeholder xs={5} />
                    </Placeholder>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={8}>
                    <TextDisplay>
                        <Placeholder as="span" animation="glow">
                            <Placeholder xs={6} /> <Placeholder xs={5} />{" "}
                            <Placeholder xs={3} /> <Placeholder xs={7} />{" "}
                            <Placeholder xs={4} /> <Placeholder xs={6} />
                            <Placeholder xs={5} /> <Placeholder xs={5} />
                        </Placeholder>
                    </TextDisplay>
                </Col>
            </Row>
            <Row className="mt-3 justify-content-center">
                <Col md={8}>
                    <Row className="justify-content-end">
                        <Col md={2}>
                            <Placeholder.Button
                                xs={10}
                                aria-hidden="true"
                                bg="danger"
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
