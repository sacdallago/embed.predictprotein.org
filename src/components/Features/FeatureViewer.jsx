import React, { useState } from "react";
// import { proteinColorSchemes } from "../../utils/Graphics";

import { Button } from "react-bootstrap";
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
function FeatureViewerLoading() {}
function FeatureViewerError() {}

// class FeatureViewer extends React.Component {
//     componentWillReceiveProps(newProps) {
//         if (this.data !== newProps.data && newProps.data !== null) {
//             // Update and clear
//             this.data = newProps.data;
//             this.ft && this.ft.clearInstance();
//             delete this.ft;
//             document.getElementById("fv1").innerHTML = "";

//             this.ft = new window.FeatureViewer(newProps.data.sequence, "#fv1", {
//                 showAxis: true,
//                 showSequence: true,
//                 brushActive: true, //zoom
//                 toolbar: true, //current zoom & mouse position
//                 bubbleHelp: false,
//                 zoomMax: 50, //define the maximum range of the zoom
//             });

//             this.ft.onFeatureSelected(function (d) {
//                 newProps.action({
//                     type: "SET_REGION",
//                     payload: {
//                         selectionStart: d.detail.start,
//                         selectionEnd: d.detail.end,
//                     },
//                 });
//             });

//             if (newProps.data.predictedTransmembrane) {
//                 let toplogy = this.findIndexes(
//                     newProps.data.predictedTransmembrane,
//                     ["B", "b", "H", "h", "S"]
//                 );

//                 let data = [
//                     ...this.findRanges(toplogy["H"]).map((e) => {
//                         e["description"] = "Helix - outwards";
//                         e["color"] =
//                             proteinColorSchemes[
//                                 "predictedTransmembrane"
//                             ].contrast["H"];
//                         return e;
//                     }),
//                     ...this.findRanges(toplogy["h"]).map((e) => {
//                         e["description"] = "Helix - inwards";
//                         e["color"] =
//                             proteinColorSchemes[
//                                 "predictedTransmembrane"
//                             ].contrast["h"];
//                         return e;
//                     }),
//                     ...this.findRanges(toplogy["B"]).map((e) => {
//                         e["description"] = "Sheet - outwards";
//                         e["color"] =
//                             proteinColorSchemes[
//                                 "predictedTransmembrane"
//                             ].contrast["B"];
//                         return e;
//                     }),
//                     ...this.findRanges(toplogy["b"]).map((e) => {
//                         e["description"] = "Sheet - inwards";
//                         e["color"] =
//                             proteinColorSchemes[
//                                 "predictedTransmembrane"
//                             ].contrast["b"];
//                         return e;
//                     }),
//                     ...this.findRanges(toplogy["S"]).map((e) => {
//                         e["description"] = "Signal peptide";
//                         e["color"] =
//                             proteinColorSchemes[
//                                 "predictedTransmembrane"
//                             ].contrast["S"];
//                         return e;
//                     }),
//                 ];

//                 this.ft.addFeature({
//                     data: data,
//                     name: "Topology",
//                     color: "#989898",
//                     type: "rect",
//                     height: 20,
//                 });
//             }

//             if (newProps.data.predictedDSSP3) {
//                 let secondaryStructure3 = this.findIndexes(
//                     newProps.data.predictedDSSP3,
//                     ["H", "E", "C"]
//                 );

//                 let data = [
//                     ...this.findRanges(secondaryStructure3["H"]).map((e) => {
//                         e["description"] = "Helix";
//                         e["color"] = proteinColorSchemes["dssp8"].contrast["H"];
//                         e["level"] = 0;
//                         return e;
//                     }),
//                     ...this.findRanges(secondaryStructure3["E"]).map((e) => {
//                         e["description"] = "Sheet";
//                         e["color"] = proteinColorSchemes["dssp8"].contrast["E"];
//                         e["level"] = 1;
//                         return e;
//                     }),
//                     ...this.findRanges(secondaryStructure3["C"]).map((e) => {
//                         e["description"] = "Other";
//                         e["color"] = proteinColorSchemes["dssp8"].contrast["C"];
//                         e["level"] = 2;
//                         return e;
//                     }),
//                 ];

//                 this.ft.addFeature({
//                     data: data,
//                     name: "Structure",
//                     color: "#989898",
//                     type: "rect",
//                     height: 20,
//                 });
//             }

//             if (newProps.data.predictedDisorder) {
//                 let disorder = this.findIndexes(
//                     newProps.data.predictedDisorder,
//                     ["X"]
//                 );

//                 this.ft.addFeature({
//                     data: this.findRanges(disorder["X"]),
//                     name: "Disorder",
//                     color: proteinColorSchemes["disorder"].contrast["X"],
//                     type: "rect",
//                     height: 20,
//                 });
//             }

//             if (
//                 newProps.data.predictedBindingMetal &&
//                 newProps.data.predictedBindingNucleicAcids &&
//                 newProps.data.predictedBindingSmallMolecules
//             ) {
//                 let bindingMetal = this.findIndexes(
//                     newProps.data.predictedBindingMetal,
//                     ["M"]
//                 );
//                 bindingMetal = this.findRanges(bindingMetal["M"]).map((e) => {
//                     e["description"] = "Metal";
//                     e["color"] = proteinColorSchemes["metal"].contrast["M"];
//                     return e;
//                 });

//                 let bindingNucleicAcids = this.findIndexes(
//                     newProps.data.predictedBindingNucleicAcids,
//                     ["N"]
//                 );
//                 bindingNucleicAcids = this.findRanges(
//                     bindingNucleicAcids["N"]
//                 ).map((e) => {
//                     e["description"] = "Nucleic Acids";
//                     e["color"] =
//                         proteinColorSchemes["nucleicAcids"].contrast["N"];
//                     return e;
//                 });

//                 let bindingSmallMolecules = this.findIndexes(
//                     newProps.data.predictedBindingSmallMolecules,
//                     ["S"]
//                 );
//                 bindingSmallMolecules = this.findRanges(
//                     bindingSmallMolecules["S"]
//                 ).map((e) => {
//                     e["description"] = "Small molecule";
//                     e["color"] =
//                         proteinColorSchemes["smallMolecules"].contrast["S"];
//                     return e;
//                 });

//                 let data = [
//                     ...bindingSmallMolecules,
//                     ...bindingNucleicAcids,
//                     ...bindingMetal,
//                 ];

//                 this.ft.addFeature({
//                     data: data,
//                     name: "Binding",
//                     color: "#989898",
//                     type: "rect",
//                     height: 20,
//                 });
//             }

//             if (newProps.data.predictedConservation) {
//                 this.ft.addFeature({
//                     data: newProps.data.predictedConservation.map((y, i) => {
//                         return {
//                             x: i,
//                             y: y,
//                         };
//                     }),
//                     name: "Conservation",
//                     color: "#008B8D",
//                     type: "line",
//                     height: 5,
//                 });
//             }

//             if (
//                 newProps.data.predictedVariation &&
//                 newProps.data.predictedVariation.values
//             ) {
//                 let transposedVariation =
//                     newProps.data.predictedVariation.values[0].map(
//                         (_, colIndex) =>
//                             newProps.data.predictedVariation.values.map(
//                                 (row) => row[colIndex]
//                             )
//                     );
//                 let averageVariation = transposedVariation.map(
//                     (e) => e.reduce((e, acc) => e + acc, 0) / e.length
//                 );

//                 this.ft.addFeature({
//                     data: averageVariation.map((y, i) => {
//                         return {
//                             x: i,
//                             y: y,
//                         };
//                     }),
//                     name: "μ variation",
//                     color: "#000000",
//                     type: "line",
//                     height: 5,
//                 });
//             }
//         }
//     }

//     render() {}
// }

// FeatureViewer.propTypes = {
//     data: PropTypes.object,
// };

// export default FeatureViewer;
