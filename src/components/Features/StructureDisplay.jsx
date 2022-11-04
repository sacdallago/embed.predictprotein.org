import React from "react";
import styled from "styled-components";
import { FaCreativeCommonsBy, FaCreativeCommons } from "react-icons/fa";

import { useStructure } from "../../hooks/useStructure";
import { useSelection } from "../../stores/featureStore";

import MethodDetails from "../MethodDetails";

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
    const { isError, isSuccess, isLoading, data, queryAFDB } = useStructure();
    const renderAction = () => {
        if (isLoading) return <StructureDisplayLoading />;
        if (isError) return <StructureDisplayError />;
        if (isSuccess) return <StructureDisplayLoaded data={data} />;
    };

    return (
        <>
            <h2>3D Structure</h2>
            <StructurePredictionDetails queryAFDB={queryAFDB} />
            {renderAction()}
        </>
    );
}

function StructurePredictionDetails({ queryAFDB }) {
    var molstar_text = (
        <>
            The structure is displayed using the{" "}
            <a
                href="https://github.com/molstar/pdbe-molstar"
                target="_blank"
                rel="noreferrer"
                className="link-dark"
            >
                PDBe implementation
            </a>{" "}
            of{" "}
            <a
                href="https://molstar.org/"
                target="_blank"
                rel="noreferrer"
                className="link-dark"
            >
                Mol*
            </a>
            .
        </>
    );
    var citations = [];
    var method_text = undefined;
    if (queryAFDB) {
        citations.push("10.1038/s41586-021-03819-2", "10.1093/nar/gkab1061");
        method_text = (
            <>
                The structure was retrieved from{" "}
                <a
                    href="https://www.alphafold.ebi.ac.uk"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    Alphafold DB
                </a>{" "}
                and is available curtesy of{" "}
                <a
                    href="https://www.ebi.ac.uk/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    Deepmind
                </a>{" "}
                and{" "}
                <a
                    href="https://www.ebi.ac.uk/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    EMBL-EBI
                </a>
                . Details regarding the current precition pipeline can be found{" "}
                <a
                    href="https://www.alphafold.ebi.ac.uk/faq"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    here
                </a>{" "}
                <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    <FaCreativeCommons />
                    <FaCreativeCommonsBy />
                </a>
                . {molstar_text}
            </>
        );
    } else {
        citations.push("10.1038/s41592-022-01488-1");
        method_text = (
            <>
                The structure was predicted using the latest version of{" "}
                <a
                    href="https://github.com/sokrypton/ColabFold"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    ColabFold
                </a>
                . Implementation and model details in bioembeddings can be found{" "}
                <a
                    href="https://github.com/sacdallago/bio_embeddings/blob/efb9801f0de9b9d51d19b741088763a7d2d0c3a2/webserver/tasks/colabfold.py#L40-L58"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    here
                </a>
                . {molstar_text}
            </>
        );
    }
    citations.push("10.1093/nar/gkab314"); //Add molstar ciataion last.

    return <MethodDetails citations={citations}>{method_text}</MethodDetails>;
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

function StructureDisplayLoading() {}
function StructureDisplayError() {}
