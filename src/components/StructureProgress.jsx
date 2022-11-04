import React from "react";

import { Alert } from "react-bootstrap";

import HelixSpinner from "./Spinner";
import { useStructure, MAX_SEQ_LEN } from "../hooks/useStructure";
import useSequence from "../hooks/useSequence";

export default function StructureProgress() {
    const { isLoading, isError, predictStructure } = useStructure();
    const { data: seqData } = useSequence();

    if (isError) {
        if (seqData.sequence.length > MAX_SEQ_LEN && predictStructure) {
            return (
                <Alert variant="danger" className="col-md-8">
                    Apologies! Our Server can currently only handle sequences of
                    up to {MAX_SEQ_LEN} residues.
                </Alert>
            );
        }
        return (
            <Alert variant="danger" className="col-md-8">
                Apologies! Something went wrong. Please try again later.
            </Alert>
        );
    }
    if (isLoading) {
        let text = "We are loading the structure... a moment please.";
        if (predictStructure) {
            text =
                "⏱ Your structure is being computed. Depending on the length of your sequence, this could take up to one hour. We will cache the result for 5 days so next visit will be faster.";
        }

        return (
            <Alert variant="info" className="col-md-12">
                <HelixSpinner size="1.5em" /> {text}
            </Alert>
        );
    }

    return <></>;
}
