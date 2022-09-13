import React from "react";

import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const Imprint = () => {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs="12" md="6">
                    <Stack gap={1.3}>
                        <div>
                            <h1 className="mb-3">Imprint</h1>
                        </div>
                        <div>
                            <h3 className="my-2"> Adress </h3>
                            <p className="imprint-adress ms-3">
                                I12 - Department for Bioinformatics and
                                Computational Biology <br />
                                School of Computation, Information and
                                Technology <br />
                                Boltzmannstraße 3 <br />
                                85748 Garching <br />
                                Germany
                            </p>
                        </div>
                        <div>
                            <h3 className="my-2">Authorized representative</h3>
                            <p className="ms-3">
                                Technical University of Munich is a statutory
                                body under public law (Art. 11 Abs. 1 BayHSchG).
                                It is legally represented by the President,
                                Prof. Dr. Thomas F. Hofmann.
                            </p>
                        </div>
                        <div>
                            <h3 className="my-2">Supervisory Authority</h3>
                            <p className="ms-3">
                                Bavarian State Ministry of Science and the Arts
                                (Bayerisches Staatsministerium für Wissenschaft
                                und Kunst)
                            </p>
                        </div>
                        <div>
                            <h3 className="my-2">VAT ID</h3>
                            <p className="ms-3">DE811193231 (§27a UStG)</p>
                        </div>
                        <div>
                            <h3 className="my-2">Responsible for Content</h3>
                            <p className="imprint-adress ms-3">
                                Prof. Dr. Burkhard Rost <br />
                                Boltzmannstraße 3 <br />
                                85748 Garching <br />
                                assistant. (at) .rostlab.org <br />
                                Tel: +49 (89) 289-17811 <br />
                                Fax: +49 (89) 289-19414
                            </p>
                        </div>
                        <div>
                            <h3 className="my-2">Implementation</h3>
                            <p className="ms-3">
                                LambdaPP was implemented by the Rostlab using
                                React. Technical details, assistance and open
                                issues can be found on{" "}
                                <a href="https://github.com/sacdallago/embed.predictprotein.org">
                                    GitHub
                                </a>
                                .
                            </p>
                        </div>
                        <div>
                            <h3 className="my-2">Legal disclaimer</h3>
                            <p className="ms-3">
                                In spite of regularily monitoring the linked
                                resources with great care, we do not accept any
                                responsibility for the content of external
                                links. The operators of these websites are
                                solely responsible for their content.
                            </p>
                        </div>
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
};

export default Imprint;
