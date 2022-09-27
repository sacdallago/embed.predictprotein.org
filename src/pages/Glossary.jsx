import React from "react";

import { Stack, Container, Row, Col } from "react-bootstrap";

export default function Glossary() {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs="12" md="6">
                    <h1 className="mb-3">Citation</h1>
                    <Stack gap={2} className="ms-3">
                        <div>
                            <strong>bio-embeddings:</strong> hosts the backend
                            to this webserver and all prediction models featured
                            on EMPP.{" "}
                            <a href={"https://doi.org/10.1002/cpz1.113"}>
                                10.1002/cpz1.113
                            </a>
                        </div>
                        <div>
                            <strong>ProtT5:</strong> computes protein embeddings
                            used as inputs for downstream prediction tasks.{" "}
                            <a
                                href={
                                    "https://ieeexplore.ieee.org/document/9477085"
                                }
                            >
                                10.1109/TPAMI.2021.3095381
                            </a>
                        </div>
                        <div>
                            <strong>ProtT5Cons:</strong> predicts the
                            conservation score for each residue in a sequence.{" "}
                            <a href="https://link.springer.com/article/10.1007/s00439-021-02411-y">
                                10.1007/s00439-021-02411-y
                            </a>
                        </div>
                        <div>
                            <strong>ProtT5Sec:</strong> predicts the secondary
                            structure assignment of each residue in a sequence.{" "}
                            <a
                                href={
                                    "https://ieeexplore.ieee.org/document/9477085"
                                }
                            >
                                10.1109/TPAMI.2021.3095381
                            </a>
                        </div>
                        <div>
                            <strong>Light Attention (LA):</strong> predicts
                            protein sub-cellular location in ten classes.{" "}
                            <a href="https://doi.org/10.1093/bioadv/vbab035">
                                10.1093/bioadv/vbab035
                            </a>
                        </div>
                        <div>
                            <strong>VESPAi:</strong> predicts the effect of
                            varying each residue in a sequence to all other
                            possible amino acids.{" "}
                            <a href="https://link.springer.com/article/10.1007/s00439-021-02411-y">
                                10.1007/s00439-021-02411-y
                            </a>
                        </div>
                        <div>
                            <strong>TMbed:</strong> predicts signal peptides and
                            transmembrane regions.{" "}
                            <a href="https://doi.org/10.1101/2022.06.12.495804">
                                10.1101/2022.06.12.495804
                            </a>
                        </div>
                        <div>
                            <strong>GoPredSim:</strong> predictions of Gene
                            Ontology (GO) terms.{" "}
                            <a href="https://www.nature.com/articles/s41598-020-80786-0">
                                10.1101/2022.06.12.495804
                            </a>
                        </div>
                        <div>
                            <strong>BindEmbedDL:</strong> predictions of ligand
                            binding residues in three classes.{" "}
                            <a href="https://www.nature.com/articles/s41598-021-03431-4">
                                10.1038/s41598-020-80786-0
                            </a>
                        </div>
                        <div>
                            <strong>ColabFold:</strong> predicts protein 3D
                            structure from an input sequence based on AlphaFold.{" "}
                            <a href="https://www.nature.com/articles/s41592-022-01488-1">
                                10.1038/s41592-022-01488-1
                            </a>
                        </div>
                        <div>
                            <strong>AlphaFold Database (AFDB):</strong> a large
                            collection of pre-computed predicted AlphaFold
                            structures.{" "}
                            <a href="https://academic.oup.com/nar/article/50/D1/D439/6430488">
                                10.1093/nar/gkab1061
                            </a>
                        </div>
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}
