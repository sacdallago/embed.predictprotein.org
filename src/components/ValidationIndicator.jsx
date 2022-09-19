import React from "react";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { Spinner } from "./Spinner";
import { InputAlphabet, InputType } from "../utils/sequence";
import { OverlayTrigger, Popover, Tooltip } from "react-bootstrap";

const FunctionalValidationIndicator = React.forwardRef((props, ref) => {
    let component = null;
    if (props.isValidationPending) {
        component = <Spinner size="1.5em" />;
    } else if (
        props.inputType !== InputType.invalid &&
        props.inputAlphabet === InputAlphabet.iupac_extended
    ) {
        component = <FaCheckCircle color="#ffd300" size="1.5em" />;
    } else if (
        props.inputType !== InputType.invalid &&
        props.inputAlphabet !== InputAlphabet.iupac_extended
    ) {
        component = <FaCheckCircle color="green" size="1.5em" />;
    } else {
        component = <FaTimesCircle color="red" size="1.5em" />;
    }

    return (
        <div className={props.className} ref={ref} {...props.eventHandler}>
            {component}
        </div>
    );
});

const SequencePopover = (props) => {
    let header = "";
    switch (props.inputType) {
        case InputType.fasta:
            header = "Valid Fasta input";
            break;
        case InputType.uniprot_id:
            header = "Valid Uniprot Identifier";
            break;
        case InputType.uniprot_protein_name:
            header = "Valid Uniprot Protein Name";
            break;
        case InputType.residue:
            header = "Valid Amino Acid Sequence";
            break;
        case InputType.invalid:
        default:
            header = "Invalid Input";
            break;
    }
    return (
        // TODO Fix Popover props
        <Popover {...props}>
            {/* zfix error in header display */}
            <Popover.Header as="h3">{header}</Popover.Header>
            <Popover.Body>{/* TODO Add body */}</Popover.Body>
        </Popover>
    );
};

const PopoverValidationIndicator = (props) => {
    return (
        <OverlayTrigger placement="right" overlay={SequencePopover}>
            {({ ref, ...triggerHandler }) => (
                <FunctionalValidationIndicator
                    eventHandler={triggerHandler}
                    ref={ref}
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
    margin-left: 0.5em;
`;

export default StyledValidationIndicator;
