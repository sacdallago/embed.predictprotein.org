import React from "react";
import SequenceHighlighter from "./SequenceHighlither";
import VariationPrediction from "./VariationPrediction";
import PropTypes from "prop-types";
import { proteinStatus } from "../stores/JobParameters";
import { resultStatus } from "../stores/JobResults";
import { proteinColorSchemes } from "../utils/Graphics";
import { useLocation,useParams, withRouter } from "react-router-dom";
import { MDBTypography } from "mdb-react-ui-kit";
import { Container } from "react-bootstrap";

const url = "/printpage";

const placeholder = {
    sequence:
      "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
  };

const PrintPage = (props) => {

  console.log(useLocation())
  let sequence = useLocation().pathname.split('/')[2]
  console.log(props)
 
  
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
     <MDBTypography tag="h4">Secondary structure in three states (DSSP3)</MDBTypography>
     <MDBTypography tag="h4">Secondary structure in eight states (DSSP8)</MDBTypography>
     <MDBTypography tag="h4">Disorder Prediction</MDBTypography>

     </Container>
    </>
  );
}
    



PrintPage.propTypes = {
  sequenceFeatureArray: PropTypes.object,
};

export default PrintPage;
