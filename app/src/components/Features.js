import React from "react";
import PropTypes from "prop-types";
import { MDBTypography } from "mdb-react-ui-kit";
import { proteinStatus } from "../stores/JobParameters";
import { resultStatus } from "../stores/JobResults";
import SequenceHighlighter from "./SequenceHighlither";
import { proteinColorSchemes } from "../utils/Graphics";
import storeComponentWrapper from "../stores/jobDispatcher";
import FeatureGrabber from "./FeatureGrabber";
import { Tabs, Tab, Table, ListGroup, Accordion } from "react-bootstrap";
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
import ScriptTag from "react-script-tag";

//import ProtvistaProteomicsdb from "./protvista-proteomicsdb/src/index.js";

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
  sequence:
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
  predictedSubcellularLocalizations: " ",
  predictedMembrane: " ",

  predictedBPO: {},
  predictedBPOGraphDataString: "",
  predictedCCO: {},
  predictedCCOGraphDataString: "",
  predictedMFO: {},
  predictedMFOGraphDataString: "",

  predictedDSSP3: " ",
  predictedDSSP8: " ",
  predictedDisorder: " ",
};

class Features extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      proteinStatus:
        this.props.jobParameters.proteinStatus || proteinStatus.NULL,
      embedder: this.props.jobParameters.embedder || "seqvec",
      sequence: null,
      features: null,
      loading: null,
    };
  }

  setFeatures = (embedder, results) => {
    // Base off of ProtT5
    let features = { ...results["prottrans_t5_xl_u50"] };
    
    return this.setState({
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
/*
  componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://cdn.plot.ly/plotly-2.12.1.min.js";
    script.async = true;
    script.innerHTML = "<div> tihatihaiha <div/>";
    document.body.appendChild(script);
  }
*/
  render() {
    const { classes } = this.props;
    let features =
      this.state.loading || this.state.features === null
        ? placeholder
        : this.state.features;
    let filler = this.state.loading || this.state.features === null;

    return (
      <div>
        <div>

          {
          // PROTVISTA TRIES
          }
          {this.state.loading !== null && (
            <div id="test">
            <script>
              {
                (window.onchange = function () {
                  //var protvistaproteomics = new ProtvistaProteomicsdb();
                })
                
              }
            </script>
                     
        </div>
          )}



        </div>
        {this.state.loading !== null && (
          <div className="row mb-5">
            <div className="col-lg-12">
              <MDBTypography tag="h4">Your Sequence</MDBTypography>
              <div>
                <SequenceHighlighter
                  string={
                    this.state.loading || this.state.sequence === null
                      ? placeholder.sequence
                      : this.state.sequence
                  }
                  proteinColorScheme={proteinColorSchemes["mview"]}
                />
              </div>
            </div>
          </div>
        )}
        {this.state.loading !== null && (
          <div className="row mb-5">
            <div className="col-lg-12">
              <MDBTypography tag="h4">Protein-level features</MDBTypography>
            </div>

            <Tabs defaultActiveKey="ml" className="mb-3">
              <Tab eventKey="ml" title="Subcellular location">
                <div class="row">
                  <div className="col-md-7">
                    <img
                      src={
                        locations_mapping[
                          features.predictedSubcellularLocalizations
                        ]
                      }
                      alt="Subcell Location"
                      height={300}
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
                        The output of goPredSim is a list of Gene Ontology (GO)
                        terms. GO thrives to capture the complexity of protein
                        function and standardize the vocabulary used to describe
                        those in a human- and machine-readable manner. GO
                        separates different aspects of function into three
                        hierarchies: MFO (Molecular Function Ontology), BPO
                        (biological process ontology), and CCO (cellular
                        component(s) or subcellular localization(s) in which the
                        protein acts). Each ontology is a rooted graph in which
                        each node represents a GO term and each link a
                        functional relationship. Thus, the prediction of our
                        method can be seen as three subgraphs of the full
                        ontologies. These three subgraphs are displayed below
                        the tabular result. Often, the tabular result only
                        contain very specific functional terms not reflecting
                        the more general role of the protein that can be
                        inferred by going to the root of the ontology. The
                        graphical results show such terms (predicted: yellow
                        boxes, inferred: white boxes).
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
                                        features.predictedBPO[index]?.identifier
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
                                        {features.predictedBPO[index]?.GO_Name}
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
                                        features.predictedMFO[index]?.identifier
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
                                        {features.predictedMFO[index]?.GO_Name}
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
                            <th colSpan="3">Cellular Component (CCO</th>
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
                                      {features.predictedCCO[index]?.identifier}
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
                                  {features.predictedCCO[index]?.RI.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                </div>
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
                          Ontology), BPO (biological process ontology), and CCO
                          (cellular component(s) or subcellular localization(s)
                          in which the protein acts). Each ontology is a rooted
                          graph in which each node represents a GO term and each
                          link a functional relationship. Thus, the prediction
                          of our method can be seen as three subgraphs of the
                          full ontologies. These three subgraphs are displayed
                          below the tabular result. Often, the tabular result
                          only contain very specific functional terms not
                          reflecting the more general role of the protein that
                          can be inferred by going to the root of the ontology.
                          The graphical results show such terms (predicted:
                          yellow boxes, inferred: white boxes).
                        </MDBTypography>
                        <br />
                        <MDBTypography variant={"body2"}>
                          <h5>What can you expect from GO term predictions?</h5>
                        </MDBTypography>
                        <br />
                        <MDBTypography>
                          Replicating the conditions of CAFA3 which allows a
                          comparison of our method to other state-of-the-art
                          approaches showed that our method would have been
                          competitive with the top 10 CAFA3 competitors and
                          clearly outperformed homology-based inference
                          achieving Fmax(BPO)=37±2%, Fmax(MFO)=50±2%,
                          Fmax(CCO)=58±2%. Applying a new dataset not available
                          during method development and preliminary results from
                          CAFA4 support those results. For each prediction a
                          reliability score is provided which is derived based
                          on the distance of the query protein and the closest
                          annotated protein in SeqVec embedding space. If this
                          score is {">"}0.5 we expect a precision and recall of
                          ~50% for BPO and MFO and ~60% for CCO.
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
                          embedding of a set of annotated proteins (this lookup
                          set is pre-computed). As not all proteins hold
                          annotations to all three ontologies, we pick the most
                          similar protein for each of the three ontologies
                          separately. Then, the annotation of the most similar
                          protein for each ontology is transferred to the query
                          protein.
                        </MDBTypography>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </Tab>
            </Tabs>
          </div>
        )}

        {this.state.loading !== null && (
          <div className="row mb-5">
            <div className="col-lg-12">
              <div className="row mb-5"></div>
              <MDBTypography tag="h4">Residue-level features</MDBTypography>
            </div>
            
            <FeatureViewer data={this.state.features}/>

            <div className="row mb-5"> </div>

            <Tabs
              defaultActiveKey="DSSP3"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab
                eventKey="DSSP3"
                title="Secondary structure in three states (DSSP3)"
              >
                {features.predictedDSSP3 && (
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
                )}
              </Tab>
              <Tab
                eventKey="DSSP8"
                title="Secondary structure in eight states (DSSP8)"
              >
                {features.predictedDSSP8 && (
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
                )}
              </Tab>
              <Tab eventKey="disorder" title="Disorder prediction">
                {features.predictedDisorder && (
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
                )}
              </Tab>
            </Tabs>
          </div>
        )}
        <FeatureGrabber />
      </div>
    );
  }
}

Features.propTypes = {
  classes: PropTypes.object.isRequired,
  jobParameters: PropTypes.object,
  jobResults: PropTypes.object,
};

export default storeComponentWrapper(Features);
