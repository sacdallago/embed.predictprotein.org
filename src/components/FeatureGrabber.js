import storeComponentWrapper from '../stores/jobDispatcher';
import React from "react";
import {proteinStatus} from "../stores/JobParameters";
import {resultStatus} from "../stores/JobResults";
import PropTypes from "prop-types";

const ULR = "https://api.bioembeddings.com/api/annotations";

class FeaturesGrabber extends React.Component {
    constructor(props){
        super(props);

        this.protein = props.jobParameters.protein;
        this.continueFetching = true;
    }

    processGoPredSimResults = (json) => {
        // MAKE string for AMIGO viz
        // MFO
        let predictedMFOGraphData = {...json.predictedMFO};

        Object
            .keys(predictedMFOGraphData)
            .forEach(e => {
                let score = predictedMFOGraphData[e];
                let newValue = {
                    "title": e + "<br/> score:" + score,
                    "fill": score>= .28 ? "#FFFF99" : "#E5E4E2"
                };

                predictedMFOGraphData[e]= newValue
            });

        json['predictedMFOGraphDataString'] = encodeURIComponent(JSON.stringify(predictedMFOGraphData));
        // CCO
        let predictedCCOGraphData = {...json.predictedCCO};

        Object
            .keys(predictedCCOGraphData)
            .forEach(e => {
                let score = predictedCCOGraphData[e];
                let newValue = {
                    "title": e + "<br/> score:" + score,
                    "fill": score>= .29 ? "#FFFF99" : "#E5E4E2"
                };

                predictedCCOGraphData[e]= newValue
            });

        json['predictedCCOGraphDataString'] = encodeURIComponent(JSON.stringify(predictedCCOGraphData));
        // BPO
        let predictedBPOGraphData = {...json.predictedBPO};

        Object
            .keys(predictedBPOGraphData)
            .forEach(e => {
                let score = predictedBPOGraphData[e];
                let newValue = {
                    "title": e + "<br/> score:" + score,
                    "fill": score>= .35 ? "#FFFF99" : "#E5E4E2"
                };

                predictedBPOGraphData[e]= newValue
            });

        json['predictedBPOGraphDataString'] = encodeURIComponent(JSON.stringify(predictedBPOGraphData));

        return json
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
                "sequence": sequence,
                "format": "full",
                "model": embedder
            }), // body data type must match "Content-Type" header
        })
            .then(response => response.json())
            .then(json => {
                
                // TODO trigger new result
                this.props.action({
                    type: "SET_RESULT",
                    payload: {
                        embedder: embedder,
                        result: {
                            ...json,
                            status: resultStatus.DONE
                        }
                    }
                });
            })
            .catch(e => {
                console.error(e);

                this.props.action({
                    type: "SET_RESULT",
                    payload: {
                        embedder: embedder,
                        result: {
                            status: resultStatus.INVALID
                        }
                    }
                });
            })
        ;
    };

    wait(ms = 90000) { // One and a half minute
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }
    

    getSequenceStructure = (sequence) => {
       
        fetch('https://api.bioembeddings.com/api/structure', {
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
                "sequence": sequence,
                "predictor": "colabfold",
            }), 
        })
            .then(response => {
                return response.json()
            })
            .then(json => {
                if(json.status == "OK") {
                    this.continueFetching = false;
                    this.props.action({
                        type: "SET_RESULT",
                        payload: {
                            predictor: 'colabfold',
                            result: {
                                ...json,
                                status: resultStatus.DONE
                            }
                        }
                    });
                    console.log(this.props)
                }
                

            })
            .catch(e => {
                console.error(e);

                this.props.action({
                    type: "SET_RESULT",
                    payload: {
                        predictor: 'colabfold',
                        result: {
                            status: resultStatus.INVALID
                        }
                    }
                });
            })
        ;
    };

    componentWillReceiveProps(nextProps) {
        let jobParameters = nextProps.jobParameters;
        let jobResults = nextProps.jobResults;

        switch (jobParameters.proteinStatus) {
            case proteinStatus.UNIPROT:
            case proteinStatus.AA:
            case proteinStatus.FASTA:
            case proteinStatus.MULTIPLESEQUENCES:
                if(this.protein !== jobParameters.protein){
                    this.protein = jobParameters.protein;

                    this.props.action({
                        type: "RESET_RESULTS"
                    });
                    
                    this.getFeatures(jobParameters.protein.sequence, 'prottrans_t5_xl_u50');

                    if(jobParameters.protein.sequence.length <= 500){
                        this.getSequenceStructure(jobParameters.protein.sequence);
                    }
                    
                    /*
                    while(this.continueFetching) {
                        this.wait();
                        console.log('fetching once...')
                        this.getSequenceStructure(jobParameters.protein.sequence);
                    }
                    */

                }
                break;
            case proteinStatus.LOADING:
            case proteinStatus.INVALID:
            default:
            // do nothing
        }
    }

    render() {
        return (<div/>);
    }
}

FeaturesGrabber.propTypes = {
    jobParameters: PropTypes.object,
    jobResults: PropTypes.object,
    action: PropTypes.func,
};

export default storeComponentWrapper(FeaturesGrabber);