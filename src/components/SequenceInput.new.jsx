import React from "react";

import { Form, Col, Row, Button } from "react-bootstrap";
import styled from "styled-components";

import { eval_input_type, InputType, InputAlphabet } from "../utils/sequence";
import ValidationIndicator from "./ValidationIndicator";

const ClickableSpan = styled.span`
    font-weight: bold;
    text-decoration: underline;
    text-decoration-style: dashed;
    cursor: pointer;
`;

const example_input = {
    [InputType.fasta]: `>My sequence
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
    const [input, setInput] = React.useState("");
    const [inputType, setInputType] = React.useState(InputType.invalid);
    const [inputAlphabet, setInputAlphabet] = React.useState(
        InputAlphabet.undefined
    );
    // TODO Unify into one state as they are linked
    const [inputValid, setInputValid] = React.useState(false);
    const [isValidationPending, startValidation] = React.useTransition();
    const ref_input = React.createRef();

    if (props.sequence !== "") {
        setInput(props.sequence);
    }

    const setExampleState = (type) => {
        let input = example_input[type];
        setInput(input);
        validate_input(input);
    };

    const validate_input = (input) => {
        startValidation(() => {
            var [type, alphabet, isValid] = eval_input_type(input);
            setInputType(type);
            setInputAlphabet(alphabet);
            setInputValid(isValid);
        });
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
                                validate_input(ref_input.current.value);
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
                    <Col md={8}></Col>
                    <Col md={2}>
                        <Button id="submit-protein" disabled={!inputValid}>
                            PredictProperties
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        </Form>
    );
};

export default SequenceInput;
