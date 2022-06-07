import "./App.css";
import { Container } from "react-bootstrap";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SequenceInput from "./components/SequenceInput";
import { Nav, Navbar } from "react-bootstrap";
import Cite from "./components/Cite";
import PropTypes from "prop-types";
import Features from "./components/Features";
import SequenceStatus from "./components/SequenceStatus";
import ScriptTag from "react-script-tag/lib/ScriptTag";

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
    const { classes } = this.props;
    return (
      <div className="App">
  
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home"> </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="https://github.com/sacdallago/bio_embeddings">
                Code
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Container>
          <SequenceInput />
          <SequenceStatus />
        </Container>
        <div className="row mb-5"></div>

        <Features />
        
        <div className="row mb-5"></div>

        <div className="row mb-5"></div>
        <div className="col-lg-12">
          <Container>
            <Cite />
          </Container>
        </div>
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default App;
