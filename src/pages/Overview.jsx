import { Container, Stack, Row } from "react-bootstrap";
import React from "react";
import SequenceDisplay from "../components/SequenceDisplay";
import InputGate from "../components/InputGate";

import Features from "../components/Features";
import SequenceStatus from "../components/SequenceStatus";

export const Overview = () => {
    return (
        <InputGate>
            <Container>
                <Stack gap={3}>
                    <Row />
                    <Row>
                        <SequenceDisplay />
                    </Row>
                    {/* <Row>
                        <SequenceStatus />
                    </Row>
                    <Row>
                        <Features />
                    </Row> */}
                </Stack>
            </Container>
        </InputGate>
    );
};

export default Overview;
