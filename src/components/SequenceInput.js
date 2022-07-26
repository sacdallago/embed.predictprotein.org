import React from "react";
import {
  Form,
  Col,
  Row,
  Container,
} from "react-bootstrap";
import PropTypes from 'prop-types';
import { Protein, autodetect, validInput, parsers } from "protein-parser";
import { proteinStatus } from "../stores/JobParameters";
import storeComponentWrapper from '../stores/jobDispatcher';
import delay from "../utils/ActionDelayer";

class SequenceInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      proteinSequenceInput: "",
    };

    this.proteinStatusAction = "SET_PROTEIN_STATUS";
    this.jobParametersAction = "SET_JOB_PARAMETERS";

    this.handleChange = this.handleChange.bind(this);
    this.deleyedKeyUp = this.deleyedKeyUp.bind(this);
  }

  componentWillUnmount() {
    this.props.action({
      type: "RESET_JOB_SUBMISSION",
    });
  }

  handleChange() {
    let textInput = this.state.proteinSequenceInput;

    // Check if the sequence has less than 3 characters
    if (textInput.length < 3) {
      // set invalid
      this.props.action({
        type: this.proteinStatusAction,
        payload: {
          proteinStatus: proteinStatus.INVALID,
        },
      });
      return;
    }

    // It's going to be !== undefined only if a valid sequence or UniProt accession
    let retrievingFunction = autodetect(textInput);

    // if valid sequence passed
    if (retrievingFunction !== undefined) {
      retrievingFunction(textInput)
          .then(([proteins, _]) => {
            // check what kind of input is given - Fasta, just a sequence, uniprot id, etc
            if (proteins.length > 1 && proteins[0] !== undefined) {
              if (proteins[0].uniprotData !== undefined) {
                this.props.action({
                  type: this.jobParametersAction,
                  payload: {
                    protein: proteins[0],
                    proteinStatus: proteinStatus.UNIPROT,
                  },
                });
              } else {
                this.props.action({
                  type: this.jobParametersAction,
                  payload: {
                    protein: proteins[0],
                    proteinStatus: proteinStatus.MULTIPLESEQUENCES,
                  },
                });
              }
            } else if (proteins[0] !== undefined) {
              let parser = validInput(textInput);

              if (parser === parsers.accession) {
                this.props.action({
                  type: this.jobParametersAction,
                  payload: {
                    protein: proteins[0],
                    proteinStatus: proteinStatus.UNIPROT,
                  },
                });
              } else if (parser === parsers.fasta) {
                if (proteins[0].uniprotData !== undefined) {
                  this.props.action({
                    type: this.jobParametersAction,
                    payload: {
                      protein: proteins[0],
                      proteinStatus: proteinStatus.UNIPROT,
                    },
                  });
                } else {
                  this.props.action({
                    type: this.jobParametersAction,
                    payload: {
                      protein: proteins[0],
                      proteinStatus: proteinStatus.FASTA,
                    },
                  });
                }
              } else if (parser === parsers.protein_name) {
                this.props.action({
                  type: this.jobParametersAction,
                  payload: {
                    protein: proteins[0],
                    proteinStatus: proteinStatus.UNIPROT,
                  },
                });
              } else if (parser === parsers.aa) {
                this.props.action({
                  type: this.jobParametersAction,
                  payload: {
                    protein: proteins[0],
                    proteinStatus: proteinStatus.AA,
                  },
                });
              } else {
                console.error(
                    "Unexpected error when validating protein retrieving function"
                );
                this.props.action({
                  type: "SET_PROTEIN_STATUS",
                  payload: {
                    proteinStatus: proteinStatus.INVALID,
                  },
                });
              }
            } else {
              this.props.action({
                type: this.jobParametersAction,
                payload: {
                  proteinStatus: proteinStatus.INVALID,
                },
              });
            }
          })
          .catch((e) => {
            console.error(e);

            this.props.action({
              type: this.jobParametersAction,
              payload: {
                proteinStatus: proteinStatus.INVALID,
              },
            });
          });
    } else {
      this.props.action({
        type: this.jobParametersAction,
        payload: {
          proteinStatus: proteinStatus.INVALID,
        },
      });
    }
  }

  handleChangeExample = event => {
    this.loadSequence(event.target.value);
  };

  loadSequence = type => {
    let fillerProtein = new Protein(
        "MGDWSALGKLLDKVQAYSTAGGKVWLSVLFIFRILLLGTAVESAWGDEQSAFRCNTQQPGCENVCYDKSFPISHVRFWVLQIIFVSVPTLLYLAHVFYVMRKEEKLNKKEEELKVAQTDGVNVDMHLKQIEIKKFKYGIEEHGKVKMRGGLLRTYIISILFKSIFEVAFLLIQWYIYGFSLSAVYTCKRDPCPHQVDCFLSRPTEKTIFIIFMLVVSLVSLALNIIELFYVFFKGVKDRVKGKSDPYHATSGALSPAKDCGSQKYAYFNGCSSPTAPLSPMSPPGYKLVTGDRNNSSCRNYNKQASEQNWANYSAEQNRMGQAGSTISNSHAQPFDFPDDNQNSKKLAAGHELQPLAIVDQRPSSRASSRASSRPRPDDLEI"
    );

    fillerProtein.setUniprotData({
      accession: "A0A654IBU3",
    });

    switch (type) {
      case "fasta":
        this.setState({
          proteinSequenceInput: `>My sequence
MGDWSALGKLLDKVQAYSTAGGKVWLSVLFIFRILLLGTAVESAWGDEQSAFRCNTQQPG
CENVCYDKSFPISHVRFWVLQIIFVSVPTLLYLAHVFYVMRKEEKLNKKEEELKVAQTDG
VNVDMHLKQIEIKKFKYGIEEHGKVKMRGGLLRTYIISILFKSIFEVAFLLIQWYIYGFS
LSAVYTCKRDPCPHQVDCFLSRPTEKTIFIIFMLVVSLVSLALNIIELFYVFFKGVKDRV
KGKSDPYHATSGALSPAKDCGSQKYAYFNGCSSPTAPLSPMSPPGYKLVTGDRNNSSCRN
YNKQASEQNWANYSAEQNRMGQAGSTISNSHAQPFDFPDDNQNSKKLAAGHELQPLAIVD
QRPSSRASSRASSRPRPDDLEI`,
        });
        this.props.action({
          type: this.jobParametersAction,
          payload: {
            proteinStatus: proteinStatus.FASTA,
            protein: fillerProtein,
          },
        });
        break;

      case "aa":
        this.setState({
          proteinSequenceInput:
              "MGDWSALGKLLDKVQAYSTAGGKVWLSVLFIFRILLLGTAVESAWGDEQSAFRCNTQQPGCENVCYDKSFPISHVRFWVLQIIFVSVPTLLYLAHVFYVMRKEEKLNKKEEELKVAQTDGVNVDMHLKQIEIKKFKYGIEEHGKVKMRGGLLRTYIISILFKSIFEVAFLLIQWYIYGFSLSAVYTCKRDPCPHQVDCFLSRPTEKTIFIIFMLVVSLVSLALNIIELFYVFFKGVKDRVKGKSDPYHATSGALSPAKDCGSQKYAYFNGCSSPTAPLSPMSPPGYKLVTGDRNNSSCRNYNKQASEQNWANYSAEQNRMGQAGSTISNSHAQPFDFPDDNQNSKKLAAGHELQPLAIVDQRPSSRASSRASSRPRPDDLEI",
        });
        this.props.action({
          type: this.jobParametersAction,
          payload: {
            proteinStatus: proteinStatus.AA,
            protein: fillerProtein,
          },
        });
        break;

      case "accession":
        this.setState({
          proteinSequenceInput: "A0A654IBU3",
        });
        this.props.action({
          type: this.jobParametersAction,
          payload: {
            proteinStatus: proteinStatus.UNIPROT,
            protein: fillerProtein,
          },
        });
        break;
      case "protein_name":
        this.setState({
          proteinSequenceInput: "A0A654IBU3_HUMAN",
        });
        this.props.action({
          type: this.jobParametersAction,
          payload: {
            proteinStatus: proteinStatus.UNIPROT,
            protein: fillerProtein,
          },
        });
        break;
      default:
        break;
    }
  };

  deleyedKeyUp(event) {
    // Set the entered input sequence
    this.setState({
      proteinSequenceInput: event.target.value,
    });

    // Check if there is currently a sequence being checked
    if (this.props.jobParameters.proteinStatus !== proteinStatus.LOADING) {
      this.props.action({
        type: this.proteinStatusAction,
        payload: {
          proteinStatus: proteinStatus.LOADING,
        },
      });
    }
    delay("SEQUENCE_INPUT_CHANGE", this.handleChange, 1000);
  }
  render() {
    return (
        <Container>
          <Form>
            <Form.Group controlId="sequenceinput">
              <Row>
                <Col>
                  <Form.Control
                      as="textarea"
                      rows={5}
                      value={this.state.proteinSequenceInput}
                      onChange={this.deleyedKeyUp}
                  />
                  <Form.Text muted={true}>
                    Input a sequence in either <b><span onClick={()=>this.loadSequence("fasta")}>FASTA format</span></b>, a {""}
                    <b><span onClick={()=>this.loadSequence("accession")}>UniProt Accession</span></b> number or {""}
                    <b><span onClick={()=>this.loadSequence("protein_name")}>UniProt Protein Name</span></b>, or {""}
                    <b><span onClick={()=>this.loadSequence("aa")}>AA sequence</span></b> (click the bolded text for examples).
                  </Form.Text>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Container>
    );
  }
}

SequenceInput.propTypes = {
  action: PropTypes.func,
  jobParameters: PropTypes.object
};
export default storeComponentWrapper(SequenceInput);
