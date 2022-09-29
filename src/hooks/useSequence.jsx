import React from "react";

import useInputStore from "../stores/inputStore";
import { useNotifcationStore } from "../stores/notificationStore";

export default function useSequence() {
    const getSequence = useInputStore((state) => state.getSequence);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const seq = useInputStore((state) => state.sequence);
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
                if (err.message)
                    pushNotification({
                        type: "error",
                        body: err.message,
                        header: "Error",
                    });
                if (err.error) {
                    console.error(err.error);
                } else {
                    console.error(err);
                }
            });
    }

    return [loading, error, loadSeqNow];
}
