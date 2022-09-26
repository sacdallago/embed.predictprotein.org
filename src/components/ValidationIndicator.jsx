import React from "react";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { Spinner } from "./Spinner";
import { InputAlphabet, InputType } from "../utils/sequence";
import { OverlayTrigger, Popover } from "react-bootstrap";

function getValidationOutput(inputState) {
    let header = "";
    let body = [];
    if (inputState.isValidationPending) {
        header = "Validating...";
        body.push(<div key="1">Validating input; Please wait.</div>);
        return [header, body];
    }
    header = "Valid Input";
    switch (inputState.type) {
        case InputType.fasta:
            body.push(
                <div key="1">
                    Identified input as <strong>Fasta Sequence</strong> (header
                    ignored).
                </div>
            );
            break;
        case InputType.uniprot_id:
            body.push(
                <div key="1">
                    Identified input as <strong>Uniprot Identifier</strong>.
                </div>
            );
            break;
        case InputType.uniprot_protein_name:
            body.push(
                <div key="1">
                    Identified input as <strong>Uniprot Protein Name</strong>.
                </div>
            );
            break;
        case InputType.residue:
            body.push(
                <div key="1">
                    Identified input as <strong>Amino Acid Sequence</strong>.
                </div>
            );
            break;
        case InputType.invalid:
        default:
            header = "Invalid Input";
            body.push(
                <div key="1">
                    Could not parse input; Please specify a valid input sequence{" "}
                </div>
            );
            break;
    }
    if (inputState.alphabet === InputAlphabet.iupac_extended) {
        body.push(
            <div key="2">
                <br /> <strong>Warning:</strong> Extended IUPAC symbols
                detected; will be mapped to X.
            </div>
        );
    }

    return [header, body];
}

const FunctionalValidationIndicator = React.forwardRef(
    ({ inputState, ...other }, ref) => {
        let component = null;
        if (inputState.isValidationPending) {
            component = <Spinner size="1.5em" />;
        } else if (
            inputState.type !== InputType.invalid &&
            inputState.alphabet === InputAlphabet.iupac_extended
        ) {
            component = <FaCheckCircle color="#ffd300" size="1.5em" />;
        } else if (
            inputState.type !== InputType.invalid &&
            inputState.alphabet !== InputAlphabet.iupac_extended
        ) {
            component = <FaCheckCircle color="green" size="1.5em" />;
        } else {
            component = <FaTimesCircle color="red" size="1.5em" />;
        }

        return (
            <div className={other.className} ref={ref} {...other.eventHandler}>
                {component}
            </div>
        );
    }
);

const PopoverValidationIndicator = ({ inputState, ...props }) => {
    let [header, body] = getValidationOutput(inputState);

    return (
        <OverlayTrigger
            overlay={
                <Popover {...props} container="body" id="validation-popover">
                    <Popover.Header as="h3">{header}</Popover.Header>
                    <Popover.Body>{body}</Popover.Body>
                </Popover>
            }
            placement="right"
            {...props}
        >
            {({ ref, ...triggerHandler }) => (
                <FunctionalValidationIndicator
                    eventHandler={triggerHandler}
                    ref={ref}
                    inputState={inputState}
                    {...props}
                />
            )}
        </OverlayTrigger>
    );
};

const StyledValidationIndicator = styled(PopoverValidationIndicator)`
    position: absolute;
    right: 0%;
    top: -9%;
    background-color: white;
`;

export default StyledValidationIndicator;