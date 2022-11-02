import React from "react";
import styled from "styled-components";
import { useStructure } from "../../hooks/useStructure";

const VIEWER_OPTIONS = {
    hideControls: true,
    visualStyle: "cartoon",
    hideCanvasControls: [
        "expand",
        "selection",
        "animation",
        "controlToggle",
        "controlInfo",
    ],
    alphafoldView: true,
    bgColor: {
        b: 255,
        g: 255,
        r: 255,
    },
};

const StructureViewerElement = styled.div`
    float: inherit;
    width: inherit;
    height: 700px;
    position: relative;
    background-color: #d9d9d9;
`;

export default function StructureDisplay() {
    const { isError, isSuccess, isLoading, data } = useStructure();

    const renderAction = () => {
        if (isLoading) return <StructureDisplayLoading />;
        if (isError) return <StructureDisplayError />;
        if (isSuccess) return <StructureDisplayLoaded data={data} />;
    };

    return <>{renderAction()}</>;
}

function StructureDisplayLoaded({ data }) {
    const viewerRef = React.useRef(null);
    const { source, ...customData } = data;

    React.useEffect(() => {
        if (!viewerRef) return;

        const viewerInstance = new window.PDBeMolstarPlugin();

        viewerInstance.render(viewerRef.current, {
            ...VIEWER_OPTIONS,
            customData: customData,
        });

        return () => {};
    }, [viewerRef, customData]);

    return <StructureViewerElement ref={viewerRef}></StructureViewerElement>;
}

function StructureDisplayLoading() {}
function StructureDisplayError() {}
