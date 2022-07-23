import React from "react";

import {Container, Stack, Nav, Navbar, Row} from "react-bootstrap";

import FeatureViewer from "./components/FeatureViewer";
import StructurePrediction from "./components/StructurePrediction";

import "./App.css";
import {annotationsPlaceholder, structurePlaceholder} from "./stores/JobResults";

const ULR = "https://api.bioembeddings.com/api/annotations";

class Interactive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      features: annotationsPlaceholder,
      structure: structurePlaceholder,
    };

    let sequence = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

    this.getFeatures(sequence, "prottrans_t5_xl_u50");
    this.getStructure(sequence);
  }

  getFeatures = (sequence, embedder) => {
    fetch(ULR, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify({
        "sequence": sequence,
        "format": "full",
        "model": embedder
      }), // body data type must match "Content-Type" header
    })
        .then(response => response.json())
        .then(json => {
          this.setState({
            features: json
          })
        })
        .catch(e => {
          console.error(e);
        })
    ;
  };

  getStructure = (sequence) => {
    fetch('https://api.bioembeddings.com/api/structure', {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify({
        "sequence": sequence,
        "predictor": "colabfold",
      }),
    })
        .then(response => {
          return response.json()
        })
        .then(json => {
          // Result is computed
          if(json.status === "OK") {
            this.setState({
              structure: json.structure
            })
          } else {
            // The request has been created or is being computed!
            setTimeout(() => this.getStructure(sequence), 5000);
          }
        })
        .catch(e => {
          console.error(e);
        })
    ;
  };

  render() {
    return (
        <div className="App">
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="#">Embed Predict Protein (EMPP)</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="https://github.com/sacdallago/bio_embeddings" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </Nav.Link>
                  <Nav.Link href="https://rostlab.org" target="_blank" rel="noopener noreferrer">
                    Rostlab Group
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Container>
            <Stack gap={3}>
              <Row/>
              <Row>
                <FeatureViewer data={this.state.features} />
              </Row>
              <Row style={{width: "100%"}}>
                <StructurePrediction data={this.state.structure.pdb}/>
              </Row>
              <Row/>
            </Stack>
          </Container>
        </div>
    );
  }
}

export default Interactive;
