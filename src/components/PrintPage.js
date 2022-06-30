import React from "react";
import SequenceHighlighter from "./SequenceHighlither";
import VariationPrediction from "./VariationPrediction";
import PropTypes from "prop-types";
import { proteinStatus } from "../stores/JobParameters";
import { resultStatus } from "../stores/JobResults";
import { proteinColorSchemes } from "../utils/Graphics";
import { useLocation, useParams, withRouter, useNavigate } from "react-router-dom";
import { MDBTypography } from "mdb-react-ui-kit";
import { Button, Container } from "react-bootstrap";

const url = "/printpage";

const placeholder = {
  sequence:
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
};

const PrintPage = (props) => {
  console.log(useLocation());
  let location = useLocation();
  let sequence = location.pathname.split("/")[2];
  let features = location.state.features;

  return (
    <>
      <div className="row mb-5"></div>
      <Container>
        <div className="row mb-5">
          <div className="col-lg-12">
            <MDBTypography tag="h4">Your Sequence</MDBTypography>
            <div>
              <SequenceHighlighter
                string={sequence}
                proteinColorScheme={proteinColorSchemes["mview"]}
              />
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <MDBTypography tag="h4">
          Secondary structure in three states (DSSP3)
        </MDBTypography>
        <div className="row mb-5">
          <div className="col-lg-12">
            <div>
              <SequenceHighlighter
                string={features.predictedDSSP3}
                proteinColorScheme={proteinColorSchemes["dssp8"]}
              />
            </div>
          </div>
        </div>

        <MDBTypography tag="h4">
          Secondary structure in eight states (DSSP8)
        </MDBTypography>
        <div className="row mb-5">
          <div className="col-lg-12">
            <div>
              <SequenceHighlighter
                string={features.predictedDSSP8}
                proteinColorScheme={proteinColorSchemes["dssp8"]}
              />
            </div>
          </div>
        </div>
        <MDBTypography tag="h4">Disorder Prediction</MDBTypography>
        <div className="row mb-5">
          <div className="col-lg-12">
            <div>
              <SequenceHighlighter
                string={features.predictedDisorder}
                proteinColorScheme={proteinColorSchemes["disorder"]}
              />
            </div>
          </div>
        </div>

      </Container>
    </>
  );
};

PrintPage.propTypes = {
  sequenceFeatureArray: PropTypes.object,
};

export default PrintPage;
