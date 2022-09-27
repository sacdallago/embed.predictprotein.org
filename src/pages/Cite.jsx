import React from "react";

import { Stack, Container, Row, Col } from "react-bootstrap";

export default function Cite() {
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

                        <div style={{ textAlign: "justify" }}>
                            <p>
                                <strong>
                                    LambdaPP: Fast and accessible
                                    protein-specific phenotype predictions
                                </strong>
                            </p>
                            <p>
                                Tobias Olenyi, Céline Marquet, Michael
                                Heinzinger, Benjamin Kröger, Tiha Nikolova,
                                Michael Bernhofer, Philip Sändig, Konstantin
                                Schütze, Maria Littmann, Milot Mirdita, Martin
                                Steinegger, Christian Dallago, Burkhard Rost.{" "}
                            </p>
                        </div>
                        <div>
                            bioRxiv 2022.08.04.502750; doi:{" "}
                            <a
                                target={"_blank"}
                                rel="noreferrer"
                                href={
                                    "https://doi.org/10.1101/2022.08.04.502750"
                                }
                            >
                                https://doi.org/10.1101/2022.08.04.502750
                            </a>
                        </div>
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}
