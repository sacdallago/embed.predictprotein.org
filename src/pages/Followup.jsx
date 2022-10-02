import { Container, Stack, Row, Col } from "react-bootstrap";
import React from "react";
import SequenceDisplay from "../components/SequenceDisplay";
import InputGate from "../components/InputGate";

import { PAGES } from "../utils/pages";
import useSequence from "../hooks/useSequence";
import LoadingSequenceDisplay from "../components/LoadingSequenceDisplay";
import FeatureProgress from "../components/FeatureProgress";

import Overview from "./Overview";
import DisplayNavigation from "../components/DisplayNavigation";
// import PrintPage from "./PrintPage";
// import Interactive from "./Interactive";

export function Followup({ page }) {
    const { isLoading } = useSequence();

    let pageComponent = undefined;
    switch (page) {
        case PAGES.overview:
            pageComponent = <Overview />;
            break;
        // case PAGES.interactive:
        //     pageComponent = <Interactive />;
        //     break;
        // case PAGES.print:
        //     pageComponent = <PrintPage />;
        //     break;
        case PAGES.error:
        default:
            pageComponent = <>Error</>;
    }

    let seqDisplay = isLoading ? (
        <LoadingSequenceDisplay />
    ) : (
        <SequenceDisplay />
    );

    return (
        <InputGate>
            <Container>
                <Stack gap={3}>
                    <Row />
                    <Row>{seqDisplay}</Row>
                    <Row className="justify-content-center">
                        <FeatureProgress />
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <DisplayNavigation />
                        </Col>
                    </Row>
                </Stack>
            </Container>
            {pageComponent}
        </InputGate>
    );
}

export default Followup;
