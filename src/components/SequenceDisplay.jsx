import React from "react";

import { Form, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import useInputStore from "../stores/inputStore";

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
                    <Col md={10}>{accession}</Col>
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
