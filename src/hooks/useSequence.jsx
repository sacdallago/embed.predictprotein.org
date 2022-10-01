import React from "react";

import { useQuery } from "react-query";

import useInputStore from "../stores/inputStore";
import { Notification, useNotifcationStore } from "../stores/notificationStore";
import { get_sequence_for_type, SequenceException } from "../utils/sequence";

export default function useSequence(onSuccess = () => {}) {
    const [input, inputType] = useInputStore((state) => [
        state.input,
        state.type,
    ]);

    const pushNotification = useNotifcationStore(
        (state) => state.pushNotification
    );

    const sequenceQuery = useQuery({
        queryKey: ["sequence", input],
        queryFn: () => get_sequence_for_type(inputType, input),
        staleTime: "Infinity",
        refetchOnWindowFocus: false,
        enabled: false,
        retry: 2,
        retryDelay: 500,
        onError: (error) => {
            if (error instanceof SequenceException) {
                pushNotification(
                    new Notification(
                        error.message,
                        "error",
                        "Error fetching Sequence"
                    )
                );
                if (error.error != null) console.error(error.error);
            } else {
                throw error;
            }
        },
        onSuccess: onSuccess,
    });

    return sequenceQuery;
}
