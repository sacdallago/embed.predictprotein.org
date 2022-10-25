import React from "react";
import { useMatomo } from "@jonkoops/matomo-tracker-react";

import HowitWorks from "../components/HowitWorks";
import SequenceInput from "../components/SequenceInput";

export default function Input() {
    const { trackPageView } = useMatomo();

    // Track page view
    React.useEffect(() => {
        trackPageView({
            documentTitle: "Input",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <SequenceInput />
            <HowitWorks />
        </>
    );
}
