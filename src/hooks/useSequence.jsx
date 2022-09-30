import React from "react";

import useInputStore from "../stores/inputStore";
import { Notification, useNotifcationStore } from "../stores/notificationStore";
import { SequenceException } from "../utils/sequence";

export default function useSequence() {
    const getSequence = useInputStore((state) => state.getSequence);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const pushNotification = useNotifcationStore(
        (state) => state.pushNotification
    );

    function loadSeqNow() {
        setLoading(true);
        setError(false);
        getSequence()
            .then((out) => setLoading(false))
            .catch((err) => {
                setLoading(false);
                setError(true);
                if (err instanceof SequenceException) {
                    pushNotification(
                        new Notification(err.message, "error", "Error")
                    );
                    if (err.error != null) console.error(err.error);
                } else {
                    throw err;
                }
            });
    }

    return [loading, error, loadSeqNow];
}
