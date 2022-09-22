import React from "react";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { Spinner } from "./Spinner";
import { InputAlphabet, InputType } from "../utils/sequence";
import { OverlayTrigger, Popover } from "react-bootstrap";

function getValidationOutput(inputState) {
    let header = "";
    let body = "";
    if (inputState.isValidationPending) {
        header = "Validating...";
        body = "Validating input; Please wait.";
        return [header, body];
    }
    switch (inputState.type) {
        case InputType.fasta:
            header = "Valid Input";
            body = "Identified input as Fasta Sequence.";
            break;
        case InputType.uniprot_id:
            header = "Valid Input";
            body = "Identified input as Uniprot Identifier.";
            break;
        case InputType.uniprot_protein_name:
            header = "Valid Input";
            body = "Identified input as Uniprot Protein Name.";
            break;
        case InputType.residue:
            header = "Valid Input";
            body = "Identified input as Amino Acid Sequence.";
            break;
        case InputType.invalid:
        default:
            header = "Invalid Input";
            body =
                "Could not parse input; Please specify a valid input sequence";
            break;
    }
    if (inputState.alphabet === InputAlphabet.iupac_extended) {
        body = body +=
            " Warning: Extended IUPAC symbols detected; will be mapped to X.";
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
