import { Container, Stack, Row, Col } from "react-bootstrap";
import React from "react";
import SequenceDisplay from "../components/SequenceDisplay";
import InputGate from "../components/InputGate";

import { PAGES } from "../utils/pages";
import FeatureProgress from "../components/FeatureProgress";

import Overview from "./Overview";
import DisplayNavigation from "../components/DisplayNavigation";
import PrintPage from "./PrintPage";
// import Interactive from "./Interactive";

export function Followup({ page }) {
    let pageComponent = undefined;
    switch (page) {
        case PAGES.overview:
            pageComponent = <Overview />;
            break;
        // case PAGES.interactive:
        //     pageComponent = <Interactive />;
        //     break;
        case PAGES.print:
            pageComponent = <PrintPage />;
            break;
        case PAGES.error:
        default:
            pageComponent = <>Error</>;
    }

    return (
        <InputGate>
            <Container>
                <Stack gap={3} className="mb-5">
                    <Row>
                        <SequenceDisplay />
                    </Row>
                    <Row className="justify-content-center">
                        <FeatureProgress />
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <DisplayNavigation page={page} />
                        </Col>
                    </Row>
                </Stack>
            </Container>
            {pageComponent}
        </InputGate>
    );
}

export default Followup;
