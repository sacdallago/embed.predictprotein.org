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
    const [initialRender, setInitialRender] = React.useState(false);
    const { source, ...customData } = data;
    const viewerInstance = React.useRef(new window.PDBeMolstarPlugin());

    React.useEffect(() => {
        if (!viewerRef.current) return;
        const instance = viewerInstance.current;

        (async () => {
            await instance.render(viewerRef.current, VIEWER_OPTIONS);
            setInitialRender(true);
            console.log(viewerRef, instance, instance.plugin);
        })();
    }, []);

    React.useEffect(() => {
        if (initialRender)
            viewerInstance.current.visual.update({
                customData,
                ...VIEWER_OPTIONS,
            });
    }, [initialRender, customData]);

    return (
        <StructureViewerElement id="test" ref={viewerRef}>
            <p style={{ fontSize: "5em", textAlign: "center" }}>:(</p>
        </StructureViewerElement>
    );
}

function StructureDisplayLoading() {}
function StructureDisplayError() {}
