import React, { useState } from "react";
// import { proteinColorSchemes } from "../../utils/Graphics";

import { Button, Placeholder } from "react-bootstrap";
import { FiDownload } from "react-icons/fi";

import { useFeatures } from "../../hooks/useFeatures";
import { useSelection } from "../../stores/featureStore";
import { download_data } from "../../lib/net_utils";
import { get_featureviewer_data } from "../../lib/bioembd_api";

export default function FeatureViewerCmp() {
    const { isSuccess, isLoading, isError, data } = useFeatures();

    const renderAction = () => {
        if (isLoading) return <FeatureViewerLoading />;
        if (isError) return <FeatureViewerError />;
        if (isSuccess)
            return (
                <>
                    <FeatureNavigator data={data} />
                    <FeatureViewerLoaded data={data} />
                </>
            );
    };

    return <>{renderAction()}</>;
}

function FeatureNavigator({ data }) {
    return (
        <div className="d-flex flex-row justify-content-end">
            <Button
                variant="link"
                className="link-dark"
                onClick={() =>
                    download_data(JSON.stringify(data), "predictions.json")
                }
            >
                <FiDownload size="1em" />
                Download all predictions
            </Button>
        </div>
    );
}

function FeatureViewerLoaded({ data }) {
    var featureViewer = React.useRef(null);
    const [viewerData, setViewerData] = useState(undefined);
    const { select, unselect } = useSelection((state) => ({
        select: state.select,
        unselect: state.unselect,
    }));

    React.useEffect(() => {
        if (featureViewer.current === null) {
            featureViewer.current = new window.FeatureViewer.createFeature(
                data.sequence,
                "#fv1",
                {
                    showAxis: true,
                    showSequence: true,
                    brushActive: true, //zoom
                    toolbar: true,
                    zoomMax: 10,
                    bubbleHelp: false,
                }
            );

            featureViewer.current.onFeatureSelected(function (d) {
                select(d.detail.start, d.detail.end);
            });
            featureViewer.current.onFeatureDeselected(function (d) {
                unselect();
            });
        }
        return () => {
            // This is very hacky and a problem of the featureViewer not being cooperative
            // TODO fix!
            if (featureViewer.current !== null) {
                featureViewer.current.clearInstance();
                let div = document.getElementById("fv1");
                while (div && div.firstChild) {
                    div.removeChild(div.firstChild);
                }
                delete featureViewer.current;
                featureViewer.current = null;
            }
        };
    }, []);

    React.useEffect(() => {
        if (!viewerData) {
            setViewerData(get_featureviewer_data(data));
            return;
        }
        if (!featureViewer.current) return;

        viewerData.forEach((feature) =>
            featureViewer.current.addFeature(feature)
        );
    }, [data, viewerData]);

    return <div className="use-bootstrap" id="fv1" />;
}
function FeatureViewerLoading() {
    return (
        <>
            <Placeholder animation="glow">
                <Placeholder
                    style={{ width: "15%", height: "25px" }}
                    className="mb-2 me-4"
                />{" "}
                <Placeholder
                    style={{ width: "80%", height: "25px" }}
                    className="mb-2"
                />
                <Placeholder
                    style={{ width: "15%", height: "25px" }}
                    className="mb-2 me-4"
                />{" "}
                <Placeholder
                    style={{ width: "80%", height: "25px" }}
                    className="mb-2"
                />
                <Placeholder
                    style={{ width: "15%", height: "25px" }}
                    className="mb-2 me-4"
                />{" "}
                <Placeholder
                    style={{ width: "80%", height: "25px" }}
                    className="mb-2"
                />
                <Placeholder
                    style={{ width: "15%", height: "25px" }}
                    className="mb-2 me-4"
                />{" "}
                <Placeholder
                    style={{ width: "80%", height: "25px" }}
                    className="mb-2"
                />
                <Placeholder
                    style={{ width: "15%", height: "25px" }}
                    className="mb-2 me-4"
                />{" "}
                <Placeholder
                    style={{ width: "80%", height: "25px" }}
                    className="mb-2"
                />
                <Placeholder
                    style={{ width: "15%", height: "25px" }}
                    className="mb-2 me-4"
                />{" "}
                <Placeholder
                    style={{ width: "80%", height: "60px" }}
                    className="mb-2"
                />
                <Placeholder
                    style={{ width: "15%", height: "25px" }}
                    className="mb-2 me-4"
                />{" "}
                <Placeholder
                    style={{ width: "80%", height: "60px" }}
                    className="mb-2"
                />
            </Placeholder>
        </>
    );
}
function FeatureViewerError() {}
