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
                setError(true);
                if (err.message) pushNotification(err.message);
                if (err.error) {
                    console.log(err.error);
                } else {
                    console.log(err);
                }
            });
    }

    return [loading, error, loadSeqNow];
}
