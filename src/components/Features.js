import React from "react";
import PropTypes from "prop-types";
import { MDBTypography } from "mdb-react-ui-kit";
import { proteinStatus } from "../stores/JobParameters";
import { resultStatus } from "../stores/JobResults";
import storeComponentWrapper from "../stores/jobDispatcher";
import FeatureGrabber from "./FeatureGrabber";
import { useNavigate } from "react-router-dom";
import { Spinner, Card } from "react-bootstrap";
import StructurePrediction from "./StructurePrediction";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

import {
  Tabs,
  Tab,
  Table,
  ListGroup,
  Accordion,
  Alert,
} from "react-bootstrap";
import FeatureViewer from "./FeatureViewer";

// subcell location images
import nucleus from "../assets/nucleus.PNG";
import mitochondrion from "../assets/mitochondrion.PNG";
import cytoplasm from "../assets/cytoplasm.PNG";
import plasmaMembrane from "../assets/plasmaMembrane.PNG";
import endoplasmicReticulum from "../assets/endoplasmicReticulum.PNG";
import golgiApparatus from "../assets/golgiApparatus.PNG";
import vacuole from "../assets/vacuole.PNG";
import peroxisome from "../assets/peroxisome.PNG";
import plastid from "../assets/plastid.PNG";
import secreted from "../assets/secreted.PNG";

import { Container } from "react-bootstrap";
import VariationPrediction from "./VariationPrediction";

import { Link } from "react-router-dom";

const locations_mapping = {
  Cytoplasm: cytoplasm,
  "Cell-Membrane": plasmaMembrane,
  "Endoplasmic reticulum'": endoplasmicReticulum,
  "Golgi - Apparatus": golgiApparatus,
  "Lysosome / Vacuole": vacuole,
  Mitochondrion: mitochondrion,
  Nucleus: nucleus,
  Peroxisome: peroxisome,
  Plastid: plastid,
  "Extra - cellular": secreted,
};

const placeholder = {
  sequence: " ",

  predictedBPO: {},
  predictedBPOGraphDataString: "",
  predictedCCO: {},
  predictedCCOGraphDataString: "",
  predictedMFO: {},
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
    if(id === '/protein-level-features/subcellular-location' ||
        id === '/protein-level-features/gene-ontology-terms') {
      this.proteinLevelFeaturesRef.current.scrollIntoView()
    }
    else if(id === '/sequence-structure' ) {
      this.sequenceStructureRef.current.scrollIntoView()
    }
    else if(id === '/residue-landscape-features/conservation-prediction' ||
        id === '/residue-landscape-features/variation-prediction') {
      this.residueLandscapeFeaturesRef.current.scrollIntoView()
    }

  };

  render() {
    let features =
        this.state.loading || this.state.features === null
            ? placeholder
            : this.state.features;

    return (
        <div>
          {this.state.loading !== null &&
          this.state.proteinStatus !== proteinStatus.INVALID && this.state.proteinStatus !== proteinStatus.LOADING &&
          "predictedBPOGraphDataString" in features && (
              <div>
                <Container style={{ textAlign: "center" }}>
                  <Card>
                    <Card.Body>
                    <span>
                      <h5>Getting the results...</h5>
                    </span>
                      <Spinner
                          animation="border"
                          variant="primary"
                          role="status"
                      ></Spinner>
                    </Card.Body>
                  </Card>
                  <div className="row mb-5"></div>
                </Container>
              </div>
          )}
          {
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
            (
                <Container style={{ textAlign: "left" }}>
                  <Navigation
                      className=""
                      // you can use your own router's api to get pathname
                      //activeItemId="/protein-level-features"
                      onSelect={({ itemId }) => {
                        this.executeScroll(itemId);
                      }}
                      items={[
                        {
                          title: "Protein-Level Features",
                          itemId: "/protein-level-features",
                          subNav: [
                            {
                              title: "Subcellular Location",
                              itemId: "/protein-level-features/subcellular-location",
                            },
                            {
                              title: "Gene Ontology Terms",
                              itemId: "/protein-level-features/gene-ontology-terms",
                            },
                          ],
                        },
                        {
                          title: "Sequence Structure",
                          itemId: "/sequence-structure",
                        },
                        {
                          title: "Residue-Landscape Features",
                          itemId: "/residue-landscape-features",
                          subNav: [
                            {
                              title: "Conservation Prediction",
                              itemId:
                                  "/residue-landscape-features/conservation-prediction",
                            },
                            {
                              title: "Variant Effect Prediction",
                              itemId: "/residue-landscape-features/variation-prediction",
                            },
                          ],
                        },
                      ]}
                  />
                </Container>
            )}


          <Container>
            {
              this.state.loading !== null &&
              this.state.proteinStatus !== proteinStatus.INVALID &&
              this.state.proteinStatus !== proteinStatus.LOADING &&
              (
                  <div ref={this.proteinLevelFeaturesRef} className="row mb-5">
                    <div className="col-lg-12">
                      <MDBTypography tag="h4">Protein-Level Features</MDBTypography>
                    </div>

                    <Tabs defaultActiveKey="ml" className="mb-3">
                      <Tab eventKey="ml" title="Subcellular Location">
                        <div class="row">
                          <div className="col-md-7">
                            <img
                                src={
                                  locations_mapping[
                                      features.predictedSubcellularLocalizations
                                      ]
                                }
                                alt="Subcell Location"
                                height={390}
                            />
                          </div>
                          <div className="col-md-5">
                            <ListGroup variant="flush">
                              <ListGroup.Item>
                                Subcellular location:{" "}
                                <b> {features.predictedSubcellularLocalizations} </b>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Membrane bound: <b>{features.predictedMembrane}</b>
                              </ListGroup.Item>
                            </ListGroup>
                          </div>
                        </div>
                        <div className="row mb-5"> </div>
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Help</Accordion.Header>
                            <Accordion.Body>
                              <br />
                              <MDBTypography variant={"body2"}>
                                <h5>What is predicted?</h5>
                              </MDBTypography>
                              <br />
                              <MDBTypography>
                                LocTree3 predicts the sub-cellular localization for
                                all proteins in all domains of life. Water-soluble
                                globular and trans-membrane proteins are predicted in
                                one 18 classes in Eukaryota (chloroplast, chloroplast
                                membrane, cytosol, ER, Golgi, ER membrane, Golgi
                                membrane, extra-cellular, mitochondria, mitochondria
                                membrane, nucleus, nucleus membrane, peroxisome,
                                peroxisome membrane, plasma membrane, plastid, vacuole
                                and vacuole membrane), 6 classes in Bacteria (cytosol,
                                extra-cellular, fimbrium, outer membrane, periplasmic
                                space and plasma membrane) and 3 classes in Archaea
                                (cytosol, extra-cellular and plasma membrane). Each
                                prediction is accompanied by a confidence score
                                (ranging from 0=unreliable to 100=reliable) and a Gene
                                Ontology term of the predicted localization class.
                              </MDBTypography>

                              <br />
                              <MDBTypography variant={"body2"}>
                                <h5>Cite</h5>
                              </MDBTypography>
                              <br />
                              <MDBTypography>
                                Light-Attention:{" "}
                                {
                                  <a
                                      href={
                                        "https://academic.oup.com/bioinformaticsadvances/article/1/1/vbab035/6432029"
                                      }
                                      target={"_blank"}
                                      ref={"author"}
                                  >
                                    https://academic.oup.com/bioinformaticsadvances/article/1/1/vbab035/6432029
                                  </a>
                                }
                              </MDBTypography>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Tab>
                      <Tab eventKey="es" title="Gene Ontology Terms">
                        <div class="row">
                          <div className="col-md-6">
                            {Object.keys(features.predictedBPO).length > 0 &&
                            Object.keys(features.predictedCCO).length > 0 &&
                            Object.keys(features.predictedMFO).length > 0 && (
                                <Table striped bordered hover>
                                  <thead>
                                  <tr>
                                    <th colSpan="3">Biological process (BPO)</th>
                                  </tr>
                                  <tr>
                                    <th>Reference Seq.</th>
                                    <th>GO Name</th>
                                    <th>Reliability Index</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {features.predictedBPO.map((value, index) => {
                                    return (
                                        <tr>
                                          <td>
                                            <a
                                                href={
                                                  "https://www.uniprot.org/uniprot/" +
                                                  features.predictedBPO[index]
                                                      ?.identifier
                                                }
                                            >
                                              <div>
                                                {
                                                  features.predictedBPO[index]
                                                      ?.identifier
                                                }
                                              </div>
                                            </a>
                                          </td>

                                          <td>
                                            <a
                                                href={
                                                  "http://amigo.geneontology.org/amigo/term/" +
                                                  features.predictedBPO[index]?.GO_Term
                                                }
                                            >
                                              <div>
                                                {
                                                  features.predictedBPO[index]
                                                      ?.GO_Name
                                                }
                                              </div>
                                            </a>
                                          </td>

                                          <td>
                                            {features.predictedBPO[index]?.RI.toFixed(
                                                2
                                            )}
                                          </td>
                                        </tr>
                                    );
                                  })}
                                  </tbody>
                                </Table>
                            )}
                          </div>
                          <div className="col-md-6">
                            {Object.keys(features.predictedBPO).length > 0 &&
                            Object.keys(features.predictedCCO).length > 0 &&
                            Object.keys(features.predictedMFO).length > 0 && (
                                <Table striped bordered hover>
                                  <thead>
                                  <tr>
                                    <th colSpan="3">Molecular function (MFO)</th>
                                  </tr>
                                  <tr>
                                    <th>Reference Seq.</th>
                                    <th>GO Name</th>
                                    <th>Reliability Index</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {features.predictedMFO.map((value, index) => {
                                    return (
                                        <tr>
                                          <td>
                                            <a
                                                href={
                                                  "https://www.uniprot.org/uniprot/" +
                                                  features.predictedMFO[index]
                                                      ?.identifier
                                                }
                                            >
                                              <div>
                                                {
                                                  features.predictedMFO[index]
                                                      ?.identifier
                                                }
                                              </div>
                                            </a>
                                          </td>

                                          <td>
                                            <a
                                                href={
                                                  "http://amigo.geneontology.org/amigo/term/" +
                                                  features.predictedMFO[index]?.GO_Term
                                                }
                                            >
                                              <div>
                                                {
                                                  features.predictedMFO[index]
                                                      ?.GO_Name
                                                }
                                              </div>
                                            </a>
                                          </td>

                                          <td>
                                            {features.predictedMFO[index]?.RI.toFixed(
                                                2
                                            )}
                                          </td>
                                        </tr>
                                    );
                                  })}
                                  </tbody>
                                </Table>
                            )}
                          </div>
                        </div>
                        <div class="center">
                          <div className="row mb-5"></div>
                          {Object.keys(features.predictedBPO).length > 0 &&
                          Object.keys(features.predictedCCO).length > 0 &&
                          Object.keys(features.predictedMFO).length > 0 && (
                              <Table striped bordered hover>
                                <thead>
                                <tr>
                                  <th colSpan="3">Cellular Component (CCO)</th>
                                </tr>
                                <tr>
                                  <th>Reference Seq.</th>
                                  <th>GO Name</th>
                                  <th>Reliability Index</th>
                                </tr>
                                </thead>
                                <tbody>
                                {features.predictedCCO.map((value, index) => {
                                  return (
                                      <tr>
                                        <td>
                                          <a
                                              href={
                                                "https://www.uniprot.org/uniprot/" +
                                                features.predictedCCO[index]?.identifier
                                              }
                                          >
                                            <div>
                                              {
                                                features.predictedCCO[index]
                                                    ?.identifier
                                              }
                                            </div>
                                          </a>
                                        </td>

                                        <td>
                                          <a
                                              href={
                                                "http://amigo.geneontology.org/amigo/term/" +
                                                features.predictedCCO[index]?.GO_Term
                                              }
                                          >
                                            <div>
                                              {features.predictedCCO[index]?.GO_Name}
                                            </div>
                                          </a>
                                        </td>

                                        <td>
                                          {features.predictedCCO[index]?.RI.toFixed(
                                              2
                                          )}
                                        </td>
                                      </tr>
                                  );
                                })}
                                </tbody>
                              </Table>
                          )}
                        </div>

                        {Object.keys(features.predictedBPO).length == 0 &&
                        Object.keys(features.predictedCCO).length == 0 &&
                        Object.keys(features.predictedMFO).length == 0 && (
                            <div>
                              <br />
                              <MDBTypography variant={"body2"}>
                                <h5>No GO predictions found!</h5>
                              </MDBTypography>
                              <br />
                            </div>
                        )}
                        <div className="row mb-5"> </div>
                        <div className="row mb-5">
                          <Accordion>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>Help</Accordion.Header>
                              <Accordion.Body>
                                <br />
                                <MDBTypography variant={"body2"}>
                                  <h5>What is predicted?</h5>
                                </MDBTypography>
                                <br />
                                <MDBTypography>
                                  The output of goPredSim is a list of Gene Ontology
                                  (GO) terms. GO thrives to capture the complexity of
                                  protein function and standardize the vocabulary used
                                  to describe those in a human- and machine-readable
                                  manner. GO separates different aspects of function
                                  into three hierarchies: MFO (Molecular Function
                                  Ontology), BPO (biological process ontology), and
                                  CCO (cellular component(s) or subcellular
                                  localization(s) in which the protein acts). Each
                                  ontology is a rooted graph in which each node
                                  represents a GO term and each link a functional
                                  relationship. Thus, the prediction of our method can
                                  be seen as three subgraphs of the full ontologies.
                                  These three subgraphs are displayed below the
                                  tabular result. Often, the tabular result only
                                  contain very specific functional terms not
                                  reflecting the more general role of the protein that
                                  can be inferred by going to the root of the
                                  ontology. The graphical results show such terms
                                  (predicted: yellow boxes, inferred: white boxes).
                                </MDBTypography>
                                <br />
                                <MDBTypography variant={"body2"}>
                                  <h5>
                                    What can you expect from GO term predictions?
                                  </h5>
                                </MDBTypography>
                                <br />
                                <MDBTypography>
                                  Replicating the conditions of CAFA3 which allows a
                                  comparison of our method to other state-of-the-art
                                  approaches showed that our method would have been
                                  competitive with the top 10 CAFA3 competitors and
                                  clearly outperformed homology-based inference
                                  achieving Fmax(BPO)=37±2%, Fmax(MFO)=50±2%,
                                  Fmax(CCO)=58±2%. Applying a new dataset not
                                  available during method development and preliminary
                                  results from CAFA4 support those results. For each
                                  prediction a reliability score is provided which is
                                  derived based on the distance of the query protein
                                  and the closest annotated protein in SeqVec
                                  embedding space. If this score is {">"}0.5 we expect
                                  a precision and recall of ~50% for BPO and MFO and
                                  ~60% for CCO.
                                </MDBTypography>

                                <br />
                                <MDBTypography variant={"body2"}>
                                  <h5>Computational details</h5>
                                </MDBTypography>
                                <br />
                                <MDBTypography>
                                  Our method consists of three steps: first, the
                                  language model SeqVec is used to represent the query
                                  protein as vectors (embeddings). That is used to
                                  compute the pairwise Euclidean distance to each
                                  embedding of a set of annotated proteins (this
                                  lookup set is pre-computed). As not all proteins
                                  hold annotations to all three ontologies, we pick
                                  the most similar protein for each of the three
                                  ontologies separately. Then, the annotation of the
                                  most similar protein for each ontology is
                                  transferred to the query protein.
                                </MDBTypography>

                                <br />
                                <MDBTypography variant={"body2"}>
                                  <h5>Cite</h5>
                                </MDBTypography>
                                <br />
                                <MDBTypography>
                                  goPredSim:{" "}
                                  {
                                    <a
                                        href={
                                          "https://www.nature.com/articles/s41598-020-80786-0"
                                        }
                                        target={"_blank"}
                                        ref={"author"}
                                    >
                                      https://www.nature.com/articles/s41598-020-80786-0
                                    </a>
                                  }
                                </MDBTypography>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
              )}
          </Container>
          {
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
            this.state.structureStatus === -1 && (
                <Container ref={this.sequenceStructureRef}>
                  <div className="col-lg-12">
                    <MDBTypography style={{ textAlign: "center" }} tag="h4">
                      Sequence Structure
                    </MDBTypography>
                  </div>
                  <div className="row mb-5"></div>
                  <div className="col-lg-12">
                    <MDBTypography style={{ textAlign: "center" }} tag="h5">
                      There is no sequence structure predictions for proteins longer than 500 AA!
                    </MDBTypography>
                  </div>
                  <div className="row mb-5"></div>
                </Container>
            )}
          {console.log(this.state?.features?.structure?.pdb)}
          {/*this.state.loading !== null && this.state.proteinStatus != 0 && this.state.structureStatus == 1 &&*/}
          { this.state?.features?.structure?.pdb != undefined && (
              <Container ref={this.sequenceStructureRef}>
                <div className="col-lg-12">
                  <MDBTypography style={{ textAlign: "center" }} tag="h4">
                    Sequence Structure
                  </MDBTypography>
                </div>
                <div className="row mb-5"></div>
                <div>
                  <StructurePrediction data={this.state?.features?.structure?.pdb} />
                </div>
                <div className="row mb-5"></div>
              </Container>
          )}
          { this.state.loading !== null && this.state.proteinStatus != 0 && this.state.structureStatus == 0 && (
              <div className="col-lg-12">

                <Container ref={this.sequenceStructureRef} style={{ textAlign: "center" }}>
                  <div className="col-lg-12">
                    <MDBTypography style={{ textAlign: "center" }} tag="h4">
                      Sequence Structure
                    </MDBTypography>
                  </div>
                  <div className="row mb-5"></div>
                  <MDBTypography style={{ textAlign: "center" }} tag="h6">
                    The Structure Prediction can take a while. Please reload the page with the same input whithin a couple of minutes.
                  </MDBTypography>
                </Container>
                <div className="row mb-5"></div>
              </div>
          )}
          {
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
            (
                <div>
                  <Container style={{ textAlign: "justify" }}>
                    <FeatureViewer data={this.state.features} />
                    <div className="row mb-5"> </div>
                  </Container>
                </div>
            )}
          {
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
            (
                <div className="col-lg-12">
                  <Container style={{ textAlign: "center" }}>
                    <Alert key="secondary" variant="secondary">
                      <Link
                          to={{
                            pathname: `/printpage/${this.state.sequence}`,
                            state: { foo: "bar" },
                          }}
                          reloadDocument={false}
                          state={{ features: features }}
                      >
                        Visualize all the features and their legends in a print friendly page!
                      </Link>
                    </Alert>
                  </Container>
                  <div className="row mb-5"></div>
                </div>
            )}
          {
            this.state.loading !== null &&
            this.state.proteinStatus !== proteinStatus.INVALID &&
            this.state.proteinStatus !== proteinStatus.LOADING &&
            (
                <Container ref={this.residueLandscapeFeaturesRef} style={{ textAlign: "justify" }}>
                  <div className="row mb-5">
                    <div className="col-lg-12">
                      <div className="row mb-5"></div>
                      <MDBTypography style={{ textAlign: "center" }} tag="h4">
                        Residue-Landscape Features
                      </MDBTypography>
                    </div>

                    <Tabs
                        defaultActiveKey="variationPrediction"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >

                      <Tab
                          eventKey="variationPrediction"
                          title="Variant Effect Prediction"
                      >
                        <Container style={{ textAlign: "center" }}>
                          <VariationPrediction data={this.state.features} />
                        </Container>
                      </Tab>
                    </Tabs>
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Help</Accordion.Header>
                        <Accordion.Body>
                          <br />
                          <MDBTypography variant={"body2"}>
                            <h5>What is predicted?</h5>
                          </MDBTypography>
                          <br />
                          <MDBTypography>
                            RePROF and ProtT5-sec predict secondary structure
                            elements, i.e. Helix, Strand and Other (details in "How Do
                            We Predict Secondary Structure?"). Furthermore, RePROF
                            also predicts solvent accessibility of protein residues
                            for 10 states of relative accessibility. These are grouped
                            into two states: buried and exposed.
                          </MDBTypography>

                          <br />
                          <MDBTypography variant={"body2"}>
                            <h5>
                              What Can You Expect From Secondary Structure Prediction?
                            </h5>
                          </MDBTypography>
                          <br />
                          <MDBTypography>
                            The expected levels of accuracy (RePROF secondary
                            structure = 72±11% (three state per-residue accuracy, Q3)
                            and RePROF solvent accessibility = 75±7% (two-state
                            per-residue accuracy)) are valid for typical globular,
                            water-soluble proteins when the multiple sequence
                            alignment (MSA) contains many and diverse sequences. High
                            values for the reliability indices indicate more accurate
                            predictions (although: for alignments with little
                            variation in the sequences, the reliability indices adopt
                            misleadingly high values). An expected accuracy of 70%
                            does not imply that for your protein 70% of all residues
                            are correctly predicted. Instead, this number is
                            calculated as an average of many hard to predict proteins.
                            An expected accuracy of 70±10% (one standard deviation)
                            implies that, on average, for two thirds of all proteins
                            between 60 and 80% of the residues will be predicted
                            correctly (expected accuracy of PHDsec). Thus, prediction
                            accuracy can be higher than 80% or lower than 60% for your
                            protein. Few methods supply well tested indices for the
                            reliability of predictions. Such indices can help to
                            reduce or increase your trust in a particular prediction.
                            Secondary structure predictions from RePROF (as well as
                            other methods) focus on predicting hydrogen bonds.
                            Consequently, occasionally strongly predicted (high
                            reliability index) helices are observed as strands and
                            vice versa. Secondary structure prediction of RePROF
                            treats N- and C-terminal ends of proteins as solvent
                            molecules. The size of the input window for predicting 1D
                            structure is up to 17 residues. Thus, the first and the
                            last 17 residues of your sequence will 'see solvent'.
                            Especially for short fragments you did cut out from large
                            proteins, this may result in false predictions. ProtT5-sec
                            is a novel secondary structure prediction method which
                            achieves a Q3 of 81-87% (CASP12=81%, TS115=87%) using a
                            two-layer convolutional neural network. The advantage of
                            this method is that it does not rely on the number or the
                            diversity of sequences in the MSAs. Instead, the method
                            learned the "language of protein sequences", and can be
                            leveraged to create representations from single protein
                            sequences, i.e. your query sequence. These representations
                            can then be used to train machine learning devices to
                            predict protein features, in this case: secondary
                            structure.
                          </MDBTypography>

                          <br />
                          <MDBTypography variant={"body2"}>
                            <h5>Cite</h5>
                          </MDBTypography>
                          <br />
                          <MDBTypography>
                            ProtTrans:{" "}
                            {
                              <a
                                  href={"https://ieeexplore.ieee.org/document/9477085"}
                                  target={"_blank"}
                                  ref={"author"}
                              >
                                https://ieeexplore.ieee.org/document/9477085
                              </a>
                            }
                            <MDBTypography>
                              VESPA:{" "}
                              {
                                <a
                                    href={"https://doi.org/10.1007/s00439-021-02411-y"}
                                    target={"_blank"}
                                    ref={"author"}
                                >
                                  https://doi.org/10.1007/s00439-021-02411-y
                                </a>
                              }
                            </MDBTypography>
                          </MDBTypography>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <div className="row mb-5"> </div>
                  </div>
                </Container>
            )}
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
