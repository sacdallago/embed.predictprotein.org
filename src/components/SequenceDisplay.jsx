import React from "react";

import { Form, Col, Row, Button } from "react-bootstrap";
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
        <Form className="d-flex justify-content-center mt-3">
            <Form.Group controlId="sequenceInput">
                <Row>
                    <Col md={10}>{getAccessionDisplay(accession)}</Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <TextDisplay>{sequence}</TextDisplay>
                    </Col>
                </Row>
                <Row className="mt-3">
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
                </Row>
            </Form.Group>
        </Form>
    );
}
