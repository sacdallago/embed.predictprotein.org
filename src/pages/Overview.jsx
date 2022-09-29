import "../styles/App.css";
import { Container, Stack, Nav, Navbar, Row } from "react-bootstrap";
import React from "react";
import SequenceDisplay from "../components/SequenceDisplay";

// import Cite from "../components/Cite";
// import Features from "../components/Features";
// import SequenceStatus from "../components/SequenceStatus";

export const Overview = () => {
    return (
        <div className="App">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>𝗟amdba 𝗣redict 𝗣rotein (𝞴𝗣𝗣)</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link
                                href="https://github.com/sacdallago/bio_embeddings"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub
                            </Nav.Link>
                            <Nav.Link
                                href="https://rostlab.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Rostlab Group
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <Stack gap={3}>
                    <Row />
                    <Row>
                        <SequenceDisplay />
                    </Row>
                    {/* <Row>
                        <SequenceStatus />
                    </Row>
                    <Features />
                    <Row /> */}
                </Stack>
            </Container>
        </div>
    );
};

export default Overview;
