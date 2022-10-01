import React from "react";

import { Form, Container, Col, Row, Button } from "react-bootstrap";
import styled from "styled-components";

import { InputType } from "../utils/sequence";
import ValidationIndicator from "./ValidationIndicator";
import LoadingButton from "./LoadingButton";
import useInputStore from "../stores/inputStore";
import useSequence from "../hooks/useSequence";
import { useNavigate } from "react-router-dom";

const ClickableSpan = styled.span`
    font-weight: bold;
    text-decoration: underline;
    text-decoration-style: dashed;
    cursor: pointer;
`;

const StyledTextArea = styled.textarea`
    display: inline-block;
    margin: 0;
    padding: 0.2em;
    width: 80ch;
    max-width: 100%;
    word-wrap: break-word;
    line-height: 1.5em;
    height: 7.8em;
    min-height: 7.8em;
    border: 1px solid var(--bs-gray-400);
    cursor: text;
    overflow: auto;
    resize: vertical;
    border-radius: 5px;

    &:focus,
    &:focus-within,
    &:active {
        outline: 4px solid #9eeaf9;
    }
`;

const example_input = {
    [InputType.fasta]: `>tr|A0A654IBU3|A0A654IBU3_HUMAN Gap junction protein...
MGDWSALGKLLDKVQAYSTAGGKVWLSVLFIFRILLLGTAVESAWGDEQSAFRCNTQQPG
CENVCYDKSFPISHVRFWVLQIIFVSVPTLLYLAHVFYVMRKEEKLNKKEEELKVAQTDG
VNVDMHLKQIEIKKFKYGIEEHGKVKMRGGLLRTYIISILFKSIFEVAFLLIQWYIYGFS
LSAVYTCKRDPCPHQVDCFLSRPTEKTIFIIFMLVVSLVSLALNIIELFYVFFKGVKDRV
KGKSDPYHATSGALSPAKDCGSQKYAYFNGCSSPTAPLSPMSPPGYKLVTGDRNNSSCRN
YNKQASEQNWANYSAEQNRMGQAGSTISNSHAQPFDFPDDNQNSKKLAAGHELQPLAIVD
QRPSSRASSRASSRPRPDDLEI`,
    [InputType.residue]:
        "MGDWSALGKLLDKVQAYSTAGGKVWLSVLFIFRILLLGTAVESAWGDEQSAFRCNTQQPGCENVCYDKSFPISHVRFWVLQIIFVSVPTLLYLAHVFYVMRKEEKLNKKEEELKVAQTDGVNVDMHLKQIEIKKFKYGIEEHGKVKMRGGLLRTYIISILFKSIFEVAFLLIQWYIYGFSLSAVYTCKRDPCPHQVDCFLSRPTEKTIFIIFMLVVSLVSLALNIIELFYVFFKGVKDRVKGKSDPYHATSGALSPAKDCGSQKYAYFNGCSSPTAPLSPMSPPGYKLVTGDRNNSSCRNYNKQASEQNWANYSAEQNRMGQAGSTISNSHAQPFDFPDDNQNSKKLAAGHELQPLAIVDQRPSSRASSRASSRPRPDDLEI",
    [InputType.uniprot_id]: "A0A654IBU3",
    [InputType.uniprot_protein_name]: "A0A654IBU3_HUMAN",
};

export const SequenceInput = (props) => {
    const [
        input,
        setInput,
        validateInput,
        inputValid,
        inputType,
        inputAlphabet,
        reset_input,
    ] = useInputStore((state) => [
        state.input,
        state.setInput,
        state.validate,
        state.isValid,
        state.type,
        state.alphabet,
        state.reset,
    ]);
    const navigate = useNavigate();
    const sequenceQuery = useSequence(() => navigate("/o"));
    const loading = sequenceQuery.isLoading;

    // TODO Unify into one state as they are linked
    const [isValidationPending, startValidation] = React.useTransition();
    const ref_input = React.createRef();

    const setExampleState = (type) => {
        let input = example_input[type];
        setInput(input);
        validate_input();
    };

    const validate_input = () => {
        startValidation(() => validateInput());
    };

    const submit = () => {
        if (inputValid) sequenceQuery.refetch();
    };

    return (
        <Form className=" mt-3">
            <Form.Group controlId="sequenceInput">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <div
                                style={{
                                    position: "relative",
                                    display: "inline-block",
                                }}
                            >
                                <Form.Control
                                    as={StyledTextArea}
                                    ref={ref_input}
                                    value={input}
                                    placeholder="SEQWENCE... "
                                    onChange={(event) => {
                                        setInput(ref_input.current.value);
                                        validate_input();
                                    }}
                                />

                                {input !== "" && (
                                    <ValidationIndicator
                                        inputState={{
                                            isValidationPending:
                                                isValidationPending,
                                            type: inputType,
                                            alphabet: inputAlphabet,
                                        }}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Form.Text muted={true}>
                                Input a sequence in either{" "}
                                <ClickableSpan
                                    onClick={() =>
                                        setExampleState(InputType.fasta)
                                    }
                                >
                                    FASTA format
                                </ClickableSpan>
                                , a {""}
                                <ClickableSpan
                                    onClick={() =>
                                        setExampleState(InputType.uniprot_id)
                                    }
                                >
                                    UniProt Accession
                                </ClickableSpan>{" "}
                                number or {""}
                                <ClickableSpan
                                    onClick={() =>
                                        setExampleState(
                                            InputType.uniprot_protein_name
                                        )
                                    }
                                >
                                    UniProt Protein Name
                                </ClickableSpan>
                                , or {""}
                                <ClickableSpan
                                    onClick={() =>
                                        setExampleState(InputType.residue)
                                    }
                                >
                                    AA sequence
                                </ClickableSpan>
                                .
                            </Form.Text>
                        </Col>
                    </Row>
                    <Row className="mt-3 justify-content-center">
                        <Col md={8}>
                            <Row className="justify-content-end">
                                <Col className="me-auto"></Col>
                                <Col xs={1}>
                                    <Button
                                        id="clear-input"
                                        variant="danger"
                                        disabled={input === ""}
                                        onClick={() => reset_input()}
                                    >
                                        Clear
                                    </Button>
                                </Col>
                                <Col xs={3}>
                                    <LoadingButton
                                        id="submit-protein"
                                        loading={loading}
                                        disabled={!inputValid}
                                        onClick={submit}
                                    >
                                        {!loading && <>PredictProperties</>}
                                        {loading && <>Loading Sequence...</>}
                                    </LoadingButton>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Form.Group>
        </Form>
    );
};

export default SequenceInput;
