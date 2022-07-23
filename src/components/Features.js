import React from "react";
import PropTypes from "prop-types";

import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "react-minimal-side-navigation";

import { MDBTypography } from "mdb-react-ui-kit";

import {
  Tabs,
  Tab,
  Alert,
  Stack
} from "react-bootstrap";

import { proteinStatus } from "../stores/JobParameters";
import { annotationsPlaceholder, resultStatus } from "../stores/JobResults";

import storeComponentWrapper from "../stores/jobDispatcher";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

import FeatureGrabber from "./FeatureGrabber";
import VariationPrediction from "./VariationPrediction";
import VariationPredictionHelp from "./VariationPredictionHelp";
import FeatureViewer from "./FeatureViewer";
import FeatureViewerLegend from "./FeatureViewerLegend";
import StructurePrediction from "./StructurePrediction";
import GeneOntology from "./GeneOntology";
import GeneOntologyHelp from "./GeneOntologyHelp";
import SubcellularLocalization from "./SubcellularLocation";
import SubcellularLocalizationHelp from "./SubcellularLocalizationHelp";


class Features extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      proteinStatus: this.props.jobParameters.proteinStatus || proteinStatus.NULL,

      // The job parameters (aka which embedder for the linear/feature/annotations predictions and the "predictor" for structure prediction)
      embedder: this.props.jobParameters.embedder || "prottrans_t5_xl_u50",
      predictor: this.props.jobParameters.predictor || "colabfold",

      // The sequence being used
      sequence: null,

      // The predicted features (features = linear annotations; structure = output from the structur endpoint)
      features: null,
      structure: null,

      // The status of the structure and annotations requests
      loadingAnnotations: null,
      loadingStructure: null,
    };

    this.proteinLevelFeaturesRef = React.createRef();
    this.sequenceStructureRef = React.createRef();
    this.residueLandscapeFeaturesRef = React.createRef();
    this.residueLevelFeaturesRef = React.createRef();

  }

  componentWillReceiveProps(nextProps) {
    let jobParameters = nextProps.jobParameters;
    let jobResults = nextProps.jobResults;

    if (jobParameters.proteinStatus !== proteinStatus.NULL) {
      this.setState(
          {
            proteinStatus: jobParameters.proteinStatus,
            sequence: jobParameters.protein?.sequence,

            // jobParams
            embedder: jobParameters.embedder,
            predictor: jobParameters.predictor,

            // Status result
            loadingAnnotations: jobResults["prottrans_t5_xl_u50"].status !== resultStatus.DONE,
            loadingStructure: jobResults["colabfold"].status !== resultStatus.DONE,

            // Results
            features: jobResults["prottrans_t5_xl_u50"],
            structure: jobResults["colabfold"],
          }
      );
    }
  }

  redirectFunction = () => {
    console.log("redirecting");
    const navigate = useNavigate();
    navigate("/printpage", { state: { name: "Xyz" } });
  };

  executeScroll = (id) => {
    switch (id){
      case '/protein-level-features/subcellular-location':
      case '/protein-level-features/gene-ontology-terms':
      case '/protein-level-features':
        this.proteinLevelFeaturesRef.current.scrollIntoView();
        break;
      case '/sequence-structure':
        this.sequenceStructureRef.current.scrollIntoView();
        break;
      case '/residue-landscape-features/variation-prediction':
      case '/residue-landscape-features/conservation-prediction':
        this.residueLandscapeFeaturesRef.current.scrollIntoView()
        break;
      case '/residue-level-features':
        this.residueLevelFeaturesRef.current.scrollIntoView()
        break;
    }
  };

  isValidIdentifierOrSequence() {
    return (
        this.state.proteinStatus !== proteinStatus.INVALID &&
        this.state.proteinStatus !== proteinStatus.NULL &&
        this.state.proteinStatus !== proteinStatus.LOADING
    )
  }

  render() {
    let features =
        this.state.loadingAnnotations || this.state.features === null
            ? annotationsPlaceholder
            : this.state.features;

    return (
        <div>
          {
            this.isValidIdentifierOrSequence() &&
            (
                <div>
                  <h3>Predicted features</h3>
                  <p>
                    Use the following navigation to quickly jump to your preferred features.
                  </p>
                  <Navigation
                      className=""
                      // you can use your own router's api to get pathname
                      //activeItemId="/protein-level-features"
                      onSelect={({ itemId }) => {
                        this.executeScroll(itemId);
                      }}
                      items={[
                        {
                          title: "Residue features (toplogy, secondary structure, disorder, binding and conservation)",
                          itemId: "/residue-level-features",
                        },
                        {
                          title: "Protein features (GO annotations and subcellular localization)",
                          itemId: "/protein-level-features",
                        },
                        {
                          title: "Single Amino Acid variant effect",
                          itemId: "/residue-landscape-features/variation-prediction",
                        },
                        {
                          title: "3D Structure",
                          itemId: "/sequence-structure",
                        },
                      ]}
                  />
                </div>
            )
          }
          {
            this.isValidIdentifierOrSequence() &&
            (
                <div ref={this.residueLevelFeaturesRef}>
                  <MDBTypography tag="h3">Residue features</MDBTypography>
                  <p>
                    The following feature viewer is a compact representation of residue-level predicted features. We use a variety of prediction methods to produce the results below. {""}
                    You can find details about the methods used, their performance and their utility in the manuscript linked in the "Cite" section at the bottom of the page.
                  </p>
                  <FeatureViewer data={this.state.features} />
                  <FeatureViewerLegend/>
                </div>
            )
          }
          {
            this.isValidIdentifierOrSequence() &&
            (
                <Alert key="secondary" variant="secondary" style={{textAlign: "center"}}>
                  <Link
                      to={{
                        pathname: `/printpage/${this.state.sequence}`,
                        state: { foo: "bar" },
                      }}
                      reloadDocument={false}
                      state={{ features: features }}
                  >
                    Visualize residue-features and associated legends in a print friendly page!
                  </Link>
                </Alert>
            )
          }
          {/*PROTEIN LEVEL FEATURES START*/}
          {
            this.isValidIdentifierOrSequence() &&
            (
                <div ref={this.proteinLevelFeaturesRef}>
                  <MDBTypography tag="h3">Protein features</MDBTypography>

                  <Tabs defaultActiveKey="GO">
                    <Tab eventKey="GO" title="Gene Ontology Terms">
                      <br/>
                      <GeneOntology features={features}/>
                      <GeneOntologyHelp/>
                    </Tab>
                    <Tab eventKey="subcell_loc" title="Subcellular Location">
                      <br/>
                      <Stack gap={3}>
                        <SubcellularLocalization features={features}/>
                        <SubcellularLocalizationHelp />
                      </Stack>
                    </Tab>
                  </Tabs>
                </div>
            )
          }
          {
            this.isValidIdentifierOrSequence() &&
            (
                <div ref={this.residueLandscapeFeaturesRef} style={{ textAlign: "justify" }}>
                  <MDBTypography tag="h3">Single Amino acid Variant (SAV) effect</MDBTypography>
                  <p>
                    The following visualization displays the effect of substituting the residue at position X on the x-axis with amino acid Y on the y-axis. {""}
                    Darker color / higher value translates to a high effect in execution said substitution, while a lighter color / lower value {""}
                    translates to a more tolerable substitution. The orange dotted marks indicate the wild-type residue at the given position, for which the substitution effect {""}
                    score is null.
                  </p>
                  <VariationPrediction data={this.state.features} />
                  <p>
                    You may click and pan the visualization to move along the y-axis of the sequence.
                  </p>
                  <VariationPredictionHelp/>
                </div>
            )
          }
          {/*STRUCTURE START*/}
          {
            this.isValidIdentifierOrSequence() &&
            (
                <div ref={this.sequenceStructureRef}>
                  <MDBTypography tag="h3">3D Structure</MDBTypography>

                  <p>
                    The protein structure is predicted via ColabFold. While predicting the annotations above only requires a few seconds, the first time you submit a sequence which our server has not yet processed {""}
                    predicting its structure can take several minutes. {""}
                    The prediction is started in the background for you and the visualization below will automatically display the structure once it is available (no need to refresh the page).
                  </p>

                  {this.state.sequence?.length > 500 && (
                      <p>
                        <b>Apologies!</b> Our server can currently only handle structure prediction for sequences shorter than {""}
                        500 amino acids. The sequence you submitted is {this.state.sequence?.length} amino acids. {""}
                      </p>
                  )}

                  {this.state.sequence?.length <= 500 && this.state.structure?.status !== resultStatus.DONE && (
                      <p>
                        ⏱ We are predicting the structure of your protein.
                      </p>
                  )}

                  {this.state?.structure?.pdb && <StructurePrediction data={this.state.structure.pdb} />}

                  <Link
                      to={{
                        pathname: `/interactive/${this.state.sequence}`,
                        state: {},
                      }}
                      reloadDocument={false}
                  >
                    Interactively explore the predicted features on the structure.
                  </Link>
                </div>
            )}


          {/*STRUCTURE END*/}
          <FeatureGrabber />
        </div>
    );
  }
}

Features.propTypes = {
  jobParameters: PropTypes.object,
  jobResults: PropTypes.object,
};

export default storeComponentWrapper(Features);
