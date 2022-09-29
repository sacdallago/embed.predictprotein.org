import React from "react";

import { Form, Col, Row, Button } from "react-bootstrap";
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
    const [loading, error, loadSeqNow] = useSequence();
    const navigate = useNavigate();

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
        loadSeqNow();
        if (!error) navigate("/o");
    };

    return (
        <Form className="d-flex justify-content-center mt-3">
            <Form.Group controlId="sequenceInput">
                <Row>
                    <Col md={10} className="position-relative">
                        <Form.Control
                            as="textarea"
                            rows={5}
                            cols={100}
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
                                    isValidationPending: isValidationPending,
                                    type: inputType,
                                    alphabet: inputAlphabet,
                                }}
                            />
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <Form.Text muted={true}>
                            Input a sequence in either{" "}
                            <ClickableSpan
                                onClick={() => setExampleState(InputType.fasta)}
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
                <Row className="mt-3">
                    <Col md={7}></Col>
                    <Col md={1}>
                        <Button
                            id="clear-input"
                            variant="danger"
                            disabled={input === ""}
                            onClick={() => reset_input()}
                        >
                            Clear
                        </Button>
                    </Col>
                    <Col md={3}>
                        <LoadingButton
                            id="submit-protein"
                            loading={loading}
                            disabled={!inputValid}
                            onClick={() => submit()}
                        >
                            {!loading && <>PredictProperties</>}
                            {loading && <>Loading Sequence...</>}
                        </LoadingButton>
                    </Col>
                </Row>
            </Form.Group>
        </Form>
    );
};

export default SequenceInput;
