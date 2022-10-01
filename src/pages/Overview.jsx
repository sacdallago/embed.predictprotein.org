import { Container, Stack, Nav, Navbar, Row } from "react-bootstrap";
import React from "react";
import SequenceDisplay from "../components/SequenceDisplay";
import InputValidator from "../components/InputValidator";

// import Cite from "../components/Cite";
// import Features from "../components/Features";
// import SequenceStatus from "../components/SequenceStatus";

export const Overview = () => {
    return (
        <InputValidator>
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
        </InputValidator>
    );
};

export default Overview;
