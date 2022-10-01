import React from "react";

import { useParams, Navigate } from "react-router-dom";

import useInputStore from "../stores/inputStore";
import useSequence from "../hooks/useSequence";

export default function InputValidator({ children }) {
    const [setInput, validateInput, reset_input, type] = useInputStore(
        (state) => [state.setInput, state.validate, state.reset, state.type]
    );

    const urlInput = useParams();
    const isParamEmpty = Object.keys(urlInput).length === 0;
    const { isLoading, isFetched, isSuccess, isError, refetch } = useSequence();

    React.useEffect(() => {
        if (!isParamEmpty) {
            reset_input();
            setInput(urlInput.sequence);
            let isValid = validateInput();
            console.log("here", type);
            if (isValid) {
                refetch(); // This is not up to date yet becaue we are working with the old store
            }
        }
    }, []);

    if (isLoading) return <>Loading ...</>;
    if (isError) return <Navigate to="/" />;
    if (isSuccess && isFetched) return <>{children}</>;
    return <Navigate to="/" />;
}
