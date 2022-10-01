import React from "react";

import { useParams, Navigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

import useInputStore from "../stores/inputStore";
import useSequence from "../hooks/useSequence";
import Spinner from "./Spinner";

function LoadingModal() {
    return (
        <>
            <Modal show={true} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Loading Sequence</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Spinner size="2em" /> Loading your sequence ... just one
                    moment.
                </Modal.Body>
            </Modal>
        </>
    );
}

const SequenceLoader = ({ children }) => {
    const { isLoading, isSuccess, isError, refetch } = useSequence();

    React.useEffect(() => {
        refetch();
    }, []);

    if (isLoading) return <LoadingModal />;
    if (isError) return <Navigate to="/" />;
    if (isSuccess) return <>{children}</>;
};

export default function InputGate({ children }) {
    const [setInput, validateInput, reset_input] = useInputStore((state) => [
        state.setInput,
        state.validate,
        state.reset,
    ]);
    const [redirect, setRedirect] = React.useState(undefined);

    const urlInput = useParams();
    const isParamEmpty = Object.keys(urlInput).length === 0;

    React.useEffect(() => {
        if (!isParamEmpty) {
            reset_input();
            setInput(urlInput.sequence);
            let isValid = validateInput();
            if (isValid) {
                setRedirect(false);
            } else {
                setRedirect(true);
            }
        } else {
            setRedirect(true);
        }
    }, []);

    if (redirect === true) return <Navigate to="/" />;
    if (redirect === false) return <SequenceLoader>{children}</SequenceLoader>;
}
