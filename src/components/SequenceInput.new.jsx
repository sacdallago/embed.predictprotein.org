import React from "react";

import { Form, Col, Row } from "react-bootstrap";

import { eval_input_type, InputType } from "../utils/sequence";

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
    const [sequence, setSequence] = React.useState("");
    const ref_input = React.createRef();

    if (props.sequence !== "") {
        setSequence(props.sequence);
    }

    const setExampleState = (type) => {
        let input = example_input[type];
        setSequence(input);
    };

    const validate_input = (input) => {
        return eval_input_type(input) !== InputType.invalid;
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
                            value={sequence}
                            placeholder="SEQWENCE..."
                            onChange={(event) => {
                                setSequence(ref_input.current.value);
                                var [seq_type, seq_alphabet] = eval_input_type(
                                    ref_input.current.value
                                );
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
