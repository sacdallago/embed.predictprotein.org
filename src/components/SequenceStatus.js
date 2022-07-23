import React from "react";
import PropTypes from "prop-types";
import storeComponentWrapper from "../stores/jobDispatcher";
import { proteinStatus } from "../stores/JobParameters";
import { Alert } from "react-bootstrap";
import {resultStatus} from "../stores/JobResults";


class SequenceStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            proteinStatus: this.props.jobParameters.proteinStatus || proteinStatus.NULL,
            jobResultsStatus: this.props.jobResults.prottrans_t5_xl_u50?.status || resultStatus.NULL,
            protein: null
        };
    }

    componentWillReceiveProps(nextProps) {
        let jobParameters = nextProps.jobParameters;
        let jobResults = nextProps.jobResults;

        this.setState({
            proteinStatus: jobParameters.proteinStatus,
            jobResultsStatus: jobResults.prottrans_t5_xl_u50?.status,
            protein: jobParameters.protein
        });
    }

    render() {
        switch (this.state.proteinStatus) {
            case proteinStatus.UNIPROT:
                if(this.state.jobResultsStatus === resultStatus.DONE){
                    return (
                        <div>
                            <Alert key="success" variant="success">
                                Done! The sequence from {" "}
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={
                                        "https://uniprot.org/uniprot/" +
                                        (this.state.protein?.uniprotData
                                            ? this.state.protein.uniprotData.accession
                                            : "P12345")
                                    }
                                >
                                    {this.state.protein?.uniprotData
                                        ? this.state.protein.uniprotData.accession
                                        : "P12345"}
                                </a>{" "}
                                was used to compute the predictions below.
                            </Alert>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <Alert key="warning" variant="warning">
                                Valid identifier passed. We are beaming the results from our server to your computer...
                            </Alert>
                        </div>
                    );
                }
            case proteinStatus.AA:
            case proteinStatus.FASTA:
                if(this.state.jobResultsStatus === resultStatus.DONE){
                    return (
                        <div>
                            <Alert key="success" variant="success">
                                Valid sequence passed.
                            </Alert>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <Alert key="warning" variant="warning">
                                Valid sequence passed. We are beaming the results from our server to your computer...
                            </Alert>
                        </div>
                    );
                }
            case proteinStatus.INVALID:
                return (
                    <div>
                        <Alert key="danger" variant="danger">
                            Sorry, but it was not possible to identify your sequence or
                            identifier. Click one of the bolded options to find out what inputs are accepted.
                        </Alert>
                    </div>
                );
            case proteinStatus.LOADING:
                return (
                    <div>
                        <Alert key="secondary" variant="secondary">
                            One moment! Your input is being processed...
                        </Alert>
                    </div>
                );
            case proteinStatus.MULTIPLESEQUENCES:
                return (
                    <div>
                        <Alert key="warning" variant="warning">
                            You inputted a valid FASTA but with multiple entries. Only the first sequence will be
                            considered.
                        </Alert>
                    </div>
                );
            default:
                return (
                    <div>
                        <Alert key="secondary" variant="secondary">
                            Input a sequence to start!
                        </Alert>
                    </div>
                );
        }
    }
}

SequenceStatus.propTypes = {
    jobParameters: PropTypes.object,
    jobResults: PropTypes.object,
};

export default storeComponentWrapper(SequenceStatus);
