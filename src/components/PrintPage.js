import React from "react";
import SequenceHighlighter from "./SequenceHighlither";
import VariationPrediction from "./VariationPrediction";
import PropTypes from "prop-types";
import { proteinStatus } from "../stores/JobParameters";
import { resultStatus } from "../stores/JobResults";
import { proteinColorSchemes } from "../utils/Graphics";

const url = "/printpage";

const placeholder = {
    sequence:
      "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
  };

class PrintPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
          sequence: this.props.location.state.sequence,
          features: this.props.location.state.features,
        };
        
      }

  render() {
    let features =
      this.state.loading || this.state.features === null
        ? placeholder
        : this.state.features;
    console.log(this.props)
    return (
      <>
        <div className="row mb-5">
          <div className="col-lg-12">
            <div>
              <SequenceHighlighter
                string={this.state.sequence}
                proteinColorScheme={proteinColorSchemes["mview"]}
              />
            </div>
          </div>
        </div>
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
      </>
    );
  }
}

PrintPage.propTypes = {
  sequenceFeatureArray: PropTypes.object,
};

export default PrintPage;
