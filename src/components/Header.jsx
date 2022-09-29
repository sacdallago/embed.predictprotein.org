import React from "react";

import { Link } from "react-router-dom";
import { Container, Stack, Nav, Navbar, Row } from "react-bootstrap";

export default function Header() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/"> 𝗟amdba 𝗣redict 𝗣rotein (𝞴𝗣𝗣)</Link>
                </Navbar.Brand>
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
    );
}
