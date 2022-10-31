import React from "react";

import { useQuery } from "react-query";

import useInputStore from "../stores/inputStore";
import { get_sequence_for_type } from "../lib/sequence";

export default function useSequence(onSuccess = () => {}) {
    const [input, inputType] = useInputStore((state) => [
        state.input,
        state.type,
    ]);

    const sequenceQuery = useQuery({
        queryKey: ["sequence", input],
        queryFn: () => get_sequence_for_type(inputType, input),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        enabled: false,
        retry: 2,
        retryDelay: 500,
        onSuccess: onSuccess,
    });

    return sequenceQuery;
}
