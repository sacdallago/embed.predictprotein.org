import React from "react";
import PropTypes from "prop-types";
import storeComponentWrapper from "../stores/jobDispatcher";
import { proteinStatus } from "../stores/JobParameters";
import { Spinner, Container, Alert, Card } from "react-bootstrap";


class SequenceStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      proteinStatus:
        this.props.jobParameters.proteinStatus || proteinStatus.NULL,
    };
    console.log(this.state)
  }

  componentWillReceiveProps(nextProps) {
    let jobParameters = nextProps.jobParameters;

    this.setState({
      proteinStatus: jobParameters.proteinStatus,
      protein: jobParameters.protein,
    });
  }

  render() {
    switch (this.state.proteinStatus) {
      case proteinStatus.UNIPROT:
        return (
          <div className="col-lg-12">
            <Alert key="success" variant="success">
              Valid identifier passed. The sequence from{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={
                  "https://uniprot.org/uniprot/" +
                  (this.state.protein && this.state.protein.uniprotData
                    ? this.state.protein.uniprotData.accession
                    : "P12345")
                }
              >
                {this.state.protein && this.state.protein.uniprotData
                  ? this.state.protein.uniprotData.accession
                  : "P12345"}
              </a>{" "}
              will be used.
            </Alert>
          </div>
        );
      case proteinStatus.AA:
      case proteinStatus.FASTA:
        return (
          <div className="col-lg-12">
            <Alert key="success" variant="success">
              Valid sequence passed.
            </Alert>
          </div>
        );
      case proteinStatus.INVALID:
        return (
          <div className="col-lg-12">
            <Alert key="danger" variant="danger">
              Sorry, but it was not possible to identify your sequence or
              identifier.
            </Alert>
          </div>
        );
      case proteinStatus.LOADING:
        return (
          <div className="col-lg-12">
            <Container style={{ textAlign: "center" }}>
            <Alert key="secondary" variant="secondary">
                <Spinner
                  animation="border"
                  variant="primary"
                  role="status"
                />
             </Alert>
            </Container>
          </div>
        );
      case proteinStatus.MULTIPLESEQUENCES:
        return (
          <div className="col-lg-12">
            <Alert key="warning" variant="warning">
              You inputted valid sequences, but only the first sequence will be
              considered.
            </Alert>
          </div>
        );
      default:
        return (
          <div className="col-lg-12">
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
};

export default storeComponentWrapper(SequenceStatus);
