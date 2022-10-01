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

    async function loadSeqNow() {
        setLoading(true);
        setError(false);
        let seq = undefined;
        try {
            seq = await getSequence();
        } catch (error) {
            setError(true);
            if (error instanceof SequenceException) {
                pushNotification(
                    new Notification(error.message, "error", "Error")
                );
                if (error.error != null) console.error(error.error);
            } else {
                throw error;
            }
        } finally {
            setLoading(false);
        }
        return seq;
    }

    return [loading, error, loadSeqNow];
}
