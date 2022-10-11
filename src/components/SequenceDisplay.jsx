import React from "react";

import {
    Form,
    Col,
    Row,
    Button,
    Container,
    Placeholder,
} from "react-bootstrap";
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

function LoadingSequenceDisplay() {
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

function LoadedSequenceDisplay({ accession, sequence }) {
    const reset_input = useInputStore((state) => state.reset);
    const navigate = useNavigate();

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

function ErroredSequenceDisplay() {
    //TODO implement
    return <>Error!</>;
}

export default function SequenceDisplay() {
    const { isLoading, isError, isSuccess, data } = useSequence();

    if (isLoading) return <LoadingSequenceDisplay />;

    if (isError) return <ErroredSequenceDisplay />;

    if (isSuccess)
        return (
            <LoadedSequenceDisplay
                accession={data.accession}
                sequence={data.sequence}
            />
        );
}
