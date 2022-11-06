import React from "react";
import styled from "styled-components";
import { FiDownload, FiSearch } from "react-icons/fi";

import { useStructure } from "../../hooks/useStructure";
import { useSelection } from "../../stores/featureStore";
import { Placeholder, Button } from "react-bootstrap";

import { download_link } from "../../lib/net_utils";
import { submit_foldseek } from "../../lib/foldseek_api";

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
    const { isError, isSuccess, isLoading, data, raw, queryAFDB } =
        useStructure();
    const renderAction = () => {
        if (isLoading) return <StructureDisplayLoading />;
        if (isError) return <StructureDisplayError />;
        if (isSuccess)
            return (
                <>
                    <StructureNavigation
                        data={data}
                        pdb={raw?.structure?.pdb}
                        queryAFDB={queryAFDB}
                    />
                    <StructureDisplayLoaded data={data} />
                </>
            );
    };

    return <>{renderAction()}</>;
}

function StructureNavigation({ queryAFDB, data, pdb }) {
    var foldseekbtn = queryAFDB ? (
        <></>
    ) : (
        <Button
            variant="link"
            className="link-dark"
            onClick={() => submit_foldseek(pdb)}
        >
            <FiSearch size="1em" />
            Find similar structure (FoldSeek)
        </Button>
    );

    return (
        <div className="d-flex flex-row justify-content-end">
            {foldseekbtn}
            <Button
                variant="link"
                className="link-dark"
                onClick={() =>
                    download_link(
                        data.url,
                        "predicted-structure." + data.format
                    )
                }
            >
                <FiDownload size="1em" />
                Download Structure
            </Button>
        </div>
    );
}

function StructureDisplayLoaded({ data }) {
    const viewerRef = React.useRef(null);
    const [initialRender, setInitialRender] = React.useState(false);
    const { source, ...customData } = data;
    const viewerInstance = React.useRef(null);
    const { start, end } = useSelection((state) => ({
        start: state.selectionStart,
        end: state.selectionEnd,
    }));

    React.useEffect(() => {
        if (!viewerRef.current) return;
        if (!viewerInstance.current)
            viewerInstance.current = new window.PDBeMolstarPlugin();
        else {
            if (!initialRender) {
                (async () => {
                    await viewerInstance.current.render(viewerRef.current, {
                        ...VIEWER_OPTIONS,
                        customData,
                    });
                    setInitialRender(true);
                })();
            }
        }
        // Clearing does not work somehow.
        // return () => {
        //     if (viewerInstance.current != null && initialRender)
        //         viewerInstance.current.clear();
        //     setInitialRender(false);
        // };
    }, [initialRender, customData]);

    React.useEffect(() => {
        if (!initialRender) return;
        if (start !== undefined && end !== undefined) {
            setTimeout(
                () =>
                    viewerInstance.current.visual.select({
                        data: [
                            {
                                start_residue_number: start,
                                end_residue_number: end,
                                focus: true,
                            },
                        ],
                    }),
                500
            );
        } else {
            setTimeout(() => {
                viewerInstance.current.visual.clearSelection();
                viewerInstance.current.visual.reset({ camera: true });
            }, 500);
        }
    }, [initialRender, start, end]);

    return (
        <>
            <StructureViewerElement
                id="test"
                ref={viewerRef}
            ></StructureViewerElement>
        </>
    );
}

function StructureDisplayLoading() {
    return (
        <>
            <Placeholder animation="glow">
                <Placeholder
                    style={{
                        width: "inherit",
                        height: "700px",
                    }}
                />
            </Placeholder>
        </>
    );
}
function StructureDisplayError() {}
