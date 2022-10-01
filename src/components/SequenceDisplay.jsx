import React from "react";

import { Form, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
    const [sequence, accession, reset_input] = useInputStore((state) => [
        state.sequence,
        state.accession,
        state.reset,
    ]);
    const navigate = useNavigate();

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
                        <Form.Control
                            as="textarea"
                            rows={5}
                            disabled={true}
                            cols={100}
                            value={sequence}
                        />
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
