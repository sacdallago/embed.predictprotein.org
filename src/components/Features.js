import React from "react";
import PropTypes from "prop-types";

import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "react-minimal-side-navigation";

import { MDBTypography } from "mdb-react-ui-kit";

import {
  Tabs,
  Tab,
  Alert,
  Container,
  Spinner,
  Card, Stack
} from "react-bootstrap";

import { proteinStatus } from "../stores/JobParameters";
import { resultStatus } from "../stores/JobResults";

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


const placeholder = {
  sequence: " ",

  predictedBPO: [],
  predictedBPOGraphDataString: "",
  predictedCCO: [],
  predictedCCOGraphDataString: "",
  predictedMFO: [],
  predictedMFOGraphDataString: "",


  "predictedBindingMetal": " ",
  "predictedBindingNucleicAcids": " ",
  "predictedBindingSmallMolecules": " ",
  "predictedMembrane": " ",
  "predictedSubcellularLocalizations": " ",
  "predictedDSSP3": " ",
  "predictedDSSP8": " ",
  "predictedDisorder": " ",
  "predictedConservation": [],
  "predictedVariation": {
    "x_axis": [],
    "y_axis": [
      "A",
      "L",
      "G",
      "V",
      "S",
      "R",
      "E",
      "D",
      "T",
      "I",
      "P",
      "K",
      "F",
      "Q",
      "N",
      "Y",
      "M",
      "H",
      "W",
      "C"
    ],
    "values": []
  }
};

class Features extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      structureStatus: 0,
      proteinStatus:
          this.props.jobParameters.proteinStatus || proteinStatus.NULL,
      embedder: this.props.jobParameters.embedder || "prottrans_t5_xl_u50",
      sequence: null,
      features: null,
      loading: null,
    };

    this.proteinLevelFeaturesRef = React.createRef();
    this.sequenceStructureRef = React.createRef();
    this.residueLandscapeFeaturesRef = React.createRef();
    this.residueLevelFeaturesRef = React.createRef();

  }

  setFeatures = (embedder, results) => {
    // Base off of ProtT5
    let features = { ...results["prottrans_t5_xl_u50"], ...results["colabfold"]};

    if (features.sequence.length > 500) {
      return this.setState({
        structureStatus: -1,
        loading: results["prottrans_t5_xl_u50"].status !== resultStatus.DONE,
        features: features,
      });
    }
    else if (!("pdb" in results["colabfold"].structure)) {
      console.log('setting to 0')
      return this.setState({
        structureStatus: 0,
        loading: results["prottrans_t5_xl_u50"].status !== resultStatus.DONE,
        features: features,
      });
    }
    return this.setState({
      structureStatus: 1,
      loading: results["prottrans_t5_xl_u50"].status !== resultStatus.DONE,
      features: features,
    });
  };

  componentWillReceiveProps(nextProps) {
    let jobParameters = nextProps.jobParameters;
    let jobResults = nextProps.jobResults;

    if (jobParameters.proteinStatus !== proteinStatus.NULL) {
      this.setState(
          {
            proteinStatus: jobParameters.proteinStatus,
            sequence: jobParameters.protein && jobParameters.protein.sequence,
            embedder: jobParameters.embedder,
            loading: true,
          },
          () => {
            this.setFeatures(jobParameters.embedder, jobResults);
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

  render() {
    let features =
        this.state.loading || this.state.features === null
            ? placeholder
            : this.state.features;

    return (
        <div>
          {
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
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
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
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
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
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
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
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
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
            (
                <div ref={this.residueLandscapeFeaturesRef} style={{ textAlign: "justify" }}>
                  <h3>Single Amino acid Variant (SAV) effect</h3>
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
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
            this.state.structureStatus === -1 && (
                <Container ref={this.sequenceStructureRef}>
                  <div className="col-lg-12">
                    <MDBTypography style={{ textAlign: "center" }} tag="h4">
                      3D Structure
                    </MDBTypography>
                  </div>
                  <div className="row mb-5"></div>
                  <div className="col-lg-12">
                    <MDBTypography style={{ textAlign: "center" }} tag="h5">
                      There is no 3D structure prediction for proteins longer than 500 AA!
                    </MDBTypography>
                  </div>
                  <div className="row mb-5"></div>
                </Container>
            )}
          {console.log(this.state?.features?.structure?.pdb)}
          { this.state?.features?.structure?.pdb !== undefined && (
              <Container ref={this.sequenceStructureRef}>
                <div className="col-lg-12">
                  <MDBTypography style={{ textAlign: "center" }} tag="h4">
                    3D Structure
                  </MDBTypography>
                </div>
                <div className="row mb-5"></div>
                <div>
                  <StructurePrediction data={this.state?.features?.structure?.pdb} />
                </div>
                <div className="row mb-5"></div>
              </Container>
          )}
          { this.state.loading !== null && this.state.proteinStatus !== 0 && this.state.structureStatus === 0 && (
              <div className="col-lg-12">

                <Container ref={this.sequenceStructureRef} style={{ textAlign: "center" }}>
                  <div className="col-lg-12">
                    <MDBTypography style={{ textAlign: "center" }} tag="h4">
                      3D Structure
                    </MDBTypography>
                  </div>
                  <div className="row mb-5"></div>
                  <MDBTypography style={{ textAlign: "center" }} tag="h6">
                    The structure prediction can take a while. Please reload the page with the same input whithin a couple of minutes.
                  </MDBTypography>
                </Container>
                <div className="row mb-5"></div>
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
