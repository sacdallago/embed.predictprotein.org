import React from "react";

import { Stack, Container, Row, Col } from "react-bootstrap";
import { useMatomo } from "@jonkoops/matomo-tracker-react";
import Bibliography from "../components/Bibliography";

export default function Cite() {
    const { trackPageView } = useMatomo();

    // Track page view
    React.useEffect(() => {
        trackPageView({
            documentTitle: "Cite",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs="12" md="6">
                    <h1 className="mb-3">Citation</h1>
                    <Stack gap={1.3} className="ms-3">
                        <div>
                            <p>
                                If you use LambdaPP in your research, please
                                cite us using:
                            </p>
                        </div>
                        <Bibliography
                            citations={["10.1101/2022.08.04.502750 "]}
                        />
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}
