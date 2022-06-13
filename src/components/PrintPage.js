import React from "react";
import SequenceHighlighter from "./SequenceHighlither";
import VariationPrediction from "./VariationPrediction";
import PropTypes from "prop-types";

const url = "/printpage";

function PrintPage() {
    return (
        <div>
            test
        </div>
    )
}

PrintPage.propTypes = {
    features: PropTypes.object,
  };
  
export default PrintPage;