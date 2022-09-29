import React from "react";
// import {proteinStatus} from "../stores/JobParameters";
// import {resultStatus} from "../stores/JobResults";
import PropTypes from "prop-types";

const proteinStatus = null;
const resultStatus = null;

const ULR = "https://api.bioembeddings.com/api/annotations";

class FeaturesGrabber extends React.Component {
    constructor(props) {
        super(props);

        this.protein = props.jobParameters.protein;
    }

    processGoPredSimResults = (json) => {
        // MAKE string for AMIGO viz
        // MFO
        let predictedMFOGraphData = { ...json.predictedMFO };

        Object.keys(predictedMFOGraphData).forEach((e) => {
            let score = predictedMFOGraphData[e];
            let newValue = {
                title: e + "<br/> score:" + score,
                fill: score >= 0.28 ? "#FFFF99" : "#E5E4E2",
            };

            predictedMFOGraphData[e] = newValue;
        });

        json["predictedMFOGraphDataString"] = encodeURIComponent(
            JSON.stringify(predictedMFOGraphData)
        );
        // CCO
        let predictedCCOGraphData = { ...json.predictedCCO };

        Object.keys(predictedCCOGraphData).forEach((e) => {
            let score = predictedCCOGraphData[e];
            let newValue = {
                title: e + "<br/> score:" + score,
                fill: score >= 0.29 ? "#FFFF99" : "#E5E4E2",
            };

            predictedCCOGraphData[e] = newValue;
        });

        json["predictedCCOGraphDataString"] = encodeURIComponent(
            JSON.stringify(predictedCCOGraphData)
        );
        // BPO
        let predictedBPOGraphData = { ...json.predictedBPO };

        Object.keys(predictedBPOGraphData).forEach((e) => {
            let score = predictedBPOGraphData[e];
            let newValue = {
                title: e + "<br/> score:" + score,
                fill: score >= 0.35 ? "#FFFF99" : "#E5E4E2",
            };

            predictedBPOGraphData[e] = newValue;
        });

        json["predictedBPOGraphDataString"] = encodeURIComponent(
            JSON.stringify(predictedBPOGraphData)
        );

        return json;
    };

    getFeatures = (sequence, embedder) => {
        fetch(ULR, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify({
                sequence: sequence,
                format: "full",
                model: embedder,
            }), // body data type must match "Content-Type" header
        })
            .then((response) => response.json())
            .then((json) => {
                this.props.action({
                    type: "SET_ANNOTATIONS",
                    payload: {
                        embedder: embedder,
                        result: {
                            ...json,
                            status: resultStatus.DONE,
                        },
                    },
                });
            })
            .catch((e) => {
                console.error(e);

                this.props.action({
                    type: "SET_ANNOTATIONS",
                    payload: {
                        embedder: embedder,
                        result: {
                            status: resultStatus.INVALID,
                        },
                    },
                });
            });
    };

    getStructure = (sequence) => {
        fetch("https://api.bioembeddings.com/api/structure", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({
                sequence: sequence,
                predictor: "colabfold",
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                // Result is computed
                if (json.status === "OK") {
                    this.props.action({
                        type: "SET_STRUCTURE",
                        payload: {
                            predictor: "colabfold",
                            result: {
                                ...json.structure,
                                link: null,
                                status: resultStatus.DONE,
                            },
                        },
                    });
                } else {
                    // The request has been created or is being computed!
                    setTimeout(() => this.getStructure(sequence), 5000);
                }
            })
            .catch((e) => {
                console.error(e);

                this.props.action({
                    type: "SET_STRUCTURE",
                    payload: {
                        predictor: "colabfold",
                        result: {
                            status: resultStatus.INVALID,
                        },
                    },
                });
            });
    };

    structureFromAFDB = (accession, sequence) => {
        fetch("https://www.alphafold.ebi.ac.uk/api/prediction/" + accession, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.props.action({
                    type: "SET_STRUCTURE",
                    payload: {
                        predictor: "colabfold",
                        result: {
                            link: json[0]["cifUrl"],
                            status: resultStatus.DONE,
                        },
                    },
                });
            })
            .catch((e) => {
                console.error(e);
                if (sequence.length <= 500) {
                    this.getStructure(sequence);
                }
            });
    };

    componentWillReceiveProps(nextProps) {
        let jobParameters = nextProps.jobParameters;

        switch (jobParameters.proteinStatus) {
            case proteinStatus.UNIPROT:
                if (this.protein !== jobParameters.protein) {
                    this.protein = jobParameters.protein;

                    this.props.action({
                        type: "RESET_RESULTS",
                    });

                    this.getFeatures(
                        jobParameters.protein.sequence,
                        "prottrans_t5_xl_u50"
                    );
                    this.structureFromAFDB(
                        jobParameters.protein?.uniprotData?.accession,
                        jobParameters.protein.sequence
                    );
                }
                break;
            case proteinStatus.AA:
            case proteinStatus.FASTA:
            case proteinStatus.MULTIPLESEQUENCES:
                if (this.protein !== jobParameters.protein) {
                    this.protein = jobParameters.protein;

                    this.props.action({
                        type: "RESET_RESULTS",
                    });

                    this.getFeatures(
                        jobParameters.protein.sequence,
                        "prottrans_t5_xl_u50"
                    );

                    if (jobParameters.protein.sequence.length <= 500) {
                        this.getStructure(jobParameters.protein.sequence);
                    }
                }
                break;
            case proteinStatus.LOADING:
            case proteinStatus.INVALID:
            default:
            // do nothing
        }
    }

    render() {
        return <div />;
    }
}

FeaturesGrabber.propTypes = {
    jobParameters: PropTypes.object,
    action: PropTypes.func,
};

export default FeaturesGrabber;
