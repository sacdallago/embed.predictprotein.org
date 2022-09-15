import React from "react";

import { Form, Col, Row } from "react-bootstrap";

import { eval_input_type, InputType, InputAlphabet } from "../utils/sequence";

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
    const [isValidationPending, startValidation] = React.useTransition();
    const ref_input = React.createRef();

    if (props.sequence !== "") {
        setInput(props.sequence);
    }

    const setExampleState = (type) => {
        let input = example_input[type];
        setInput(input);
    };

    const validate_input = (input) => {
        startValidation(() => {
            var [type, alphabet] = eval_input_type(input);
            setInputType(type);
            setInputAlphabet(alphabet);
            console.log(type);
            console.log(alphabet);
        });
    };

    return (
        <Form className="d-flex justify-content-center mt-3">
            <Form.Group controlId="sequenceInput">
                <Row>
                    <Col md={10}>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            cols={100}
                            ref={ref_input}
                            value={input}
                            placeholder="SEQWENCE..."
                            onChange={(event) => {
                                setInput(ref_input.current.value);
                                validate_input(ref_input.current.value);
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <Form.Text muted={true}>
                            Input a sequence in either{" "}
                            <span
                                className="clickable-example"
                                onClick={() => setExampleState(InputType.fasta)}
                            >
                                FASTA format
                            </span>
                            , a {""}
                            <span
                                className="clickable-example"
                                onClick={() =>
                                    setExampleState(InputType.uniprot_id)
                                }
                            >
                                UniProt Accession
                            </span>{" "}
                            number or {""}
                            <span
                                className="clickable-example"
                                onClick={() =>
                                    setExampleState(
                                        InputType.uniprot_protein_name
                                    )
                                }
                            >
                                UniProt Protein Name
                            </span>
                            , or {""}
                            <span
                                className="clickable-example"
                                onClick={() =>
                                    setExampleState(InputType.residue)
                                }
                            >
                                AA sequence
                            </span>
                            .
                        </Form.Text>
                    </Col>
                </Row>
            </Form.Group>
        </Form>
    );
};

export default SequenceInput;
