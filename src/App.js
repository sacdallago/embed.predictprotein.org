import "./App.css";
import { Container } from "react-bootstrap";
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
        
        <Container>
          <SequenceInput />
          <SequenceStatus />
        </Container>
        <div className="row mb-5"></div>

        <Features />
        
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


export default App;
