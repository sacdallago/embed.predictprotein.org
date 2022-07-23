import "./App.css";
import {Container, Stack, Nav, Navbar, Row} from "react-bootstrap";
import React from "react";
import SequenceInput from "./components/SequenceInput";
import Cite from "./components/Cite";
import Features from "./components/Features";
import SequenceStatus from "./components/SequenceStatus";

const uniprotRegex =
    /^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$/;

class App extends React.Component {
  state = {
    query: "",
    valid: true,
    ready: false,
  };

  timeout = null;

  onQueryChange = (query) => {
    if (uniprotRegex.test(query)) {
      this.setState({
        valid: true,
        ready: true,
      });
    } else {
      this.setState({
        valid: false,
      });
    }
  };

  onInputChange = (event) => {
    let value = event.target.value;

    if (uniprotRegex.test(value)) {
      this.setState({
        query: value,
        ready: false,
      });
      window.clearTimeout(this.timeout);
      this.onQueryChange(value);
    } else {
      this.setState({
        query: value,
        ready: false,
      });

      window.clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.onQueryChange(value);
      }, 1000);
    }
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
                <SequenceInput />
              </Row>
              <Row>
                <SequenceStatus />
              </Row>
              <Features />
              <Row>
                <Cite />
              </Row>
              <Row/>
            </Stack>
          </Container>
        </div>
    );
  }
}


export default App;
