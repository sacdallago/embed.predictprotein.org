import React from "react";
import { resolvePath } from "react-router-dom";

import useInputStore from "../stores/inputStore";

export default function useSequence() {
    const getSequence = useInputStore((state) => state.getSequence);
    const [output, setOutput] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const seq = useInputStore((state) => state.sequence);

    function loadSeqNow() {
        setLoading(true);
        getSequence()
            .then((out) => setOutput(output))
            .then((out) => setLoading(false))
            .catch((err) => {
                setOutput({
                    error: "Something went wrong; Please try again later",
                });
                console.error(err);
            });
    }

    // React.useEffect(() => loadSeqNow(), []);

    return [loading, output, loadSeqNow];
}
