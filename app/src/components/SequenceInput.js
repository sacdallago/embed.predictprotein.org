import React from "react";
import {
  Form,
  Card,
  Button,
  Nav,
  Col,
  Row,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import PropTypes from 'prop-types';
import { Protein, autodetect, validInput, parsers } from "protein-parser";
import { proteinStatus } from "../stores/JobParameters";
import storeComponentWrapper from '../stores/jobDispatcher';
import delay from "../utils/ActionDelayer";
import { event } from "react-ga";

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Sequence can be in FASTA format, a UniProt Accession number or UniProt
    Protein Name, or AA sequence.
  </Tooltip>
);

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
      console.log('here')
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
    console.log(event.target.value)
    
    this.loadSequence(event.target.value);
    console.log('after loading')
  };

  // TODO: this has to be integrated in the dropdown menu with examples
  loadSequence = type => {
    console.log(type)
    let fillerProtein = new Protein(
      "MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKMNLGVGAYRDDNGKPYVLPSVRKAEAQIAAKGLDKEYLPIGGLAEFCRASAELALGENSEVVKSGRFVTVQTISGTGALRIGASFLQRFFKFSRDVFLPKPSWGNHTPIFRDAGMQLQSYRYYDPKTCGFDFTGALEDISKIPEQSVLLLHACAHNPTGVDPRPEQWKEIATVVKKRNLFAFFDMAYQGFASGDGDKDAWAVRHFIEQGINVCLCQSYAKNMGLYGERVGAFTVICKDADEAKRVESQLKILIRPMYSNPPIHGARIASTILTSPDLRKQWLQEVKGMADRIIGMRTQLVSNLKKEGSTHSWQHITDQIGMFCFTGLKPEQVERLTKEFSIYMTKDGRISVAGVTSGNVGYLAHAIHQVTK"
    );

    fillerProtein.setUniprotData({
      accession: "P12345",
    });

    switch (type) {
      case "fasta":
        this.setState({
          proteinSequenceInput: `>My sequence
MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKM
NLGVGAYRDDNGKPYVLPSVRKAEAQIAAKGLDKEYLPIGGLAEFCRASAELALGENSEV
VKSGRFVTVQTISGTGALRIGASFLQRFFKFSRDVFLPKPSWGNHTPIFRDAGMQLQSYR
YYDPKTCGFDFTGALEDISKIPEQSVLLLHACAHNPTGVDPRPEQWKEIATVVKKRNLFA
FFDMAYQGFASGDGDKDAWAVRHFIEQGINVCLCQSYAKNMGLYGERVGAFTVICKDADE
AKRVESQLKILIRPMYSNPPIHGARIASTILTSPDLRKQWLQEVKGMADRIIGMRTQLVS
NLKKEGSTHSWQHITDQIGMFCFTGLKPEQVERLTKEFSIYMTKDGRISVAGVTSGNVGY
LAHAIHQVTK`,
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
            "MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKMNLGVGAYRDDNGKPYVLPSVRKAEAQIAAKGLDKEYLPIGGLAEFCRASAELALGENSEVVKSGRFVTVQTISGTGALRIGASFLQRFFKFSRDVFLPKPSWGNHTPIFRDAGMQLQSYRYYDPKTCGFDFTGALEDISKIPEQSVLLLHACAHNPTGVDPRPEQWKEIATVVKKRNLFAFFDMAYQGFASGDGDKDAWAVRHFIEQGINVCLCQSYAKNMGLYGERVGAFTVICKDADEAKRVESQLKILIRPMYSNPPIHGARIASTILTSPDLRKQWLQEVKGMADRIIGMRTQLVSNLKKEGSTHSWQHITDQIGMFCFTGLKPEQVERLTKEFSIYMTKDGRISVAGVTSGNVGYLAHAIHQVTK",
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
          proteinSequenceInput: "P12345",
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
          proteinSequenceInput: "AATM_RABIT",
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
    
    // TODO: last character is not set in proteinSequenceInput 
    console.log(this.state);
    

    // Check if there is currently a sequence being checked
    if (this.props.jobParameters.proteinStatus !== proteinStatus.LOADING) {
      //
      this.props.action({
        type: this.proteinStatusAction,
        payload: {
          proteinStatus: proteinStatus.LOADING,
        },
      });
    }
    console.log('step 1')
    delay("SEQUENCE_INPUT_CHANGE", this.handleChange, 1000);
  }
  render() {
    return (
      <Form>
        <div className="row mb-5"></div>

        <div className="col-lg-12">
          <Form.Group as={Row} className="mb-3" controlId="sequenceinput">
            <Form.Label>
              <h2>Sequence</h2>
            </Form.Label>
            <Col sm={12}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={this.state.proteinSequenceInput}
                  onChange={this.deleyedKeyUp}
                />
              </OverlayTrigger>
            </Col>
            <div className="row mb-3"></div>
            <Col sm={12}>
              <Form.Select onChange={this.handleChangeExample}>
                <option>Examples</option>
                <option value="fasta">FASTA format</option>
                <option value="accession">UniProt Accession Number</option>
                <option value="protein_name">UniProt Protein Name</option>
                <option value="aa">AA Sequence</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </div>
      </Form>
    );
  }
}

SequenceInput.propTypes = {
  action: PropTypes.func,
  classes: PropTypes.object.isRequired,
  jobParameters: PropTypes.object
};
export default storeComponentWrapper(SequenceInput);
