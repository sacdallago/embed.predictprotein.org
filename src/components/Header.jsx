import React from "react";

import { Link } from "react-router-dom";
import { Container, Stack, Nav, Navbar, Row } from "react-bootstrap";
import styled from "styled-components";

const UndecoratedLink = styled(Link)`
    &,
    &:visited,
    &:hover,
    &:active,
    &:focus,
    &:active:hover {
        font-style: inherit;
        color: inherit;
        background-color: transparent;
        font-size: inherit;
        text-decoration: none;
        font-variant: inherit;
        font-weight: inherit;
        line-height: inherit;
        font-family: inherit;
        border-radius: inherit;
        border: inherit;
        outline: inherit;
        box-shadow: inherit;
        padding: inherit;
        vertical-align: inherit;
    }
`;

export default function Header() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand className="me-auto">
                    <UndecoratedLink to="/">
                        𝗟amdba 𝗣redict 𝗣rotein (𝞴𝗣𝗣)
                    </UndecoratedLink>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="https://www.biorxiv.org/content/10.1101/2022.08.04.502750v1">
                            Publication
                        </Nav.Link>
                        <Nav.Link href="https://github.com/sacdallago/embed.predictprotein.org">
                            Code
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
