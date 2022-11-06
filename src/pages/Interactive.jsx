import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import { useMatomo } from "@jonkoops/matomo-tracker-react";

import FeatureViewer from "../components/Features/FeatureViewer";
import StructureProgress from "../components/StructureProgress";
import StructureDisplay from "../components/Features/StructureDisplay";

export const Interactive = () => {
    const { trackPageView } = useMatomo();

    // Track page view
    React.useEffect(() => {
        trackPageView({
            documentTitle: "Interactive",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col xs="auto">
                    <p>
                        Explore predicted per-residue features on the structure
                        by highlighting regions of interest in the feature
                        viewer.
                    </p>
                </Col>
            </Row>
            <Row className="justify-content-center mb-5">
                <Col md={12}>
                    <FeatureViewer />
                </Col>
            </Row>
            <Row className="justify-content-center mt-5">
                <Col md={12}>
                    <StructureProgress />
                    <StructureDisplay />
                </Col>
            </Row>
        </Container>
    );
};

export default Interactive;
