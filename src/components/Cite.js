import React from "react";
import { MDBTypography } from "mdb-react-ui-kit";
import { Accordion } from "react-bootstrap";

class Cite extends React.Component {
  render() {
    return (
      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Cite</Accordion.Header>
          <Accordion.Body>
            <MDBTypography variant={"body2"}>
              Coming soon...
            </MDBTypography>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
}

export default Cite;
