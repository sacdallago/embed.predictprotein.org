import React from "react";

import { Form, Col, Row, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import useSequence from "../hooks/useSequence";
import TextDisplay from "../components/TextDisplay";
import useInputStore from "../stores/inputStore";

function getAccessionDisplay(accession) {
    if (!accession) return "No Uniprot Reference Found.";
    return (
        <>
            Using sequence with Accession{" "}
            <a
                href={
                    "https://www.uniprot.org/uniprotkb/" + accession + "/entry"
                }
                target="_blank"
                rel="noreferrer"
            >
                <strong>{accession}</strong>
            </a>
            .
        </>
    );
}

export default function SequenceDisplay() {
    const sequenceQuery = useSequence();
    const reset_input = useInputStore((state) => state.reset);
    const navigate = useNavigate();

    const [accession, sequence] = [
        sequenceQuery.data.accession,
        sequenceQuery.data.sequence,
    ];

    const new_input = () => {
        reset_input();
        navigate("/");
    };

    return (
        <Container>
            <Form className="mt-3">
                <Form.Group controlId="sequenceInput">
                    <Row className="justify-content-center">
                        <Col md={8}>{getAccessionDisplay(accession)}</Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <TextDisplay>{sequence}</TextDisplay>
                        </Col>
                    </Row>
                    <Row className="mt-3 justify-content-center">
                        <Col md={8}>
                            <Row className="justify-content-end">
                                <Col md={2}>
                                    <Button
                                        id="new-input"
                                        variant="danger"
                                        onClick={() => new_input()}
                                    >
                                        New Query
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </Container>
    );
}
