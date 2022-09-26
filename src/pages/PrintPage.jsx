import React from "react";
import SequenceHighlighter from "../components/SequenceHighlither";
import PropTypes from "prop-types";

import { proteinColorSchemes } from "../utils/Graphics";
import { useLocation, useParams } from "react-router-dom";
import { Container, Stack } from "react-bootstrap";

const PrintPage = (props) => {
    let { state } = useLocation();
    let { sequence } = useParams();

    let features = state.features;

    return (
        <Container>
            <Stack gap={3}>
                <div />

                <div>
                    <h4>Input Sequence</h4>
                    <div>
                        <SequenceHighlighter
                            string={sequence}
                            proteinColorScheme={proteinColorSchemes["mview"]}
                        />
                    </div>
                </div>

                <div />

                <div>
                    <h4>Secondary structure in three states (DSSP3)</h4>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <div>
                                <SequenceHighlighter
                                    string={features.predictedDSSP3}
                                    proteinColorScheme={
                                        proteinColorSchemes["dssp8"]
                                    }
                                />
                            </div>
                            <br />
                            Legend: {""}
                            <span
                                style={{
                                    backgroundColor:
                                        proteinColorSchemes["dssp8"].contrast[
                                            "H"
                                        ],
                                }}
                            >
                                H
                            </span>
                            elix, {""}
                            <span
                                style={{
                                    backgroundColor:
                                        proteinColorSchemes["dssp8"].contrast[
                                            "E"
                                        ],
                                }}
                            >
                                E
                            </span>
                            -Sheet, {""}
                            <span
                                style={{
                                    backgroundColor:
                                        proteinColorSchemes["dssp8"].contrast[
                                            "C"
                                        ],
                                }}
                            >
                                C
                            </span>
                            -Other {""}
                        </div>
                    </div>
                </div>

                <div>
                    <h4>Secondary structure in eight states (DSSP8)</h4>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <div>
                                <SequenceHighlighter
                                    string={features.predictedDSSP8}
                                    proteinColorScheme={
                                        proteinColorSchemes["dssp8"]
                                    }
                                />
                                <br />
                                Legend: {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["dssp8"]
                                                .contrast["H"],
                                    }}
                                >
                                    H
                                </span>
                                - α-helix, {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["dssp8"]
                                                .contrast["E"],
                                    }}
                                >
                                    E
                                </span>
                                - Extended strand, participates in β ladder,{" "}
                                {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["dssp8"]
                                                .contrast["C"],
                                    }}
                                >
                                    C
                                </span>
                                - Other, {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["dssp8"]
                                                .contrast["I"],
                                    }}
                                >
                                    I
                                </span>
                                - 5-helix, {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["dssp8"]
                                                .contrast["B"],
                                    }}
                                >
                                    B
                                </span>
                                - Residue in isolated β-bridge, {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["dssp8"]
                                                .contrast["S"],
                                    }}
                                >
                                    S
                                </span>
                                - Bend, {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["dssp8"]
                                                .contrast["T"],
                                    }}
                                >
                                    T
                                </span>
                                - Hydrogen bonded turn, {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["dssp8"]
                                                .contrast["G"],
                                    }}
                                >
                                    G
                                </span>
                                - 3-helix {""}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 tag="h4">Residue conservation</h4>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <div>
                                <SequenceHighlighter
                                    string={features.predictedConservation
                                        .map((e) => e + "")
                                        .join("")}
                                    proteinColorScheme={
                                        proteinColorSchemes["conservation"]
                                    }
                                />
                                <br />
                                Legend: {""}
                                <span
                                    style={{
                                        color: "white",
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["0"],
                                    }}
                                >
                                    0
                                </span>
                                - Highly variable, {""}
                                <span
                                    style={{
                                        color: "white",
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["1"],
                                    }}
                                >
                                    1
                                </span>
                                , {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["2"],
                                    }}
                                >
                                    2
                                </span>
                                , {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["3"],
                                    }}
                                >
                                    3
                                </span>
                                , {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["4"],
                                    }}
                                >
                                    4
                                </span>
                                , {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["5"],
                                    }}
                                >
                                    5
                                </span>
                                - Neutral, {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["6"],
                                    }}
                                >
                                    6
                                </span>
                                , {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["7"],
                                    }}
                                >
                                    7
                                </span>
                                , {""}
                                <span
                                    style={{
                                        color: "white",
                                        backgroundColor:
                                            proteinColorSchemes["conservation"]
                                                .contrast["8"],
                                    }}
                                >
                                    8
                                </span>
                                - Highly conserved {""}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4>Toplogy (transmembrane regions)</h4>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <div>
                                <SequenceHighlighter
                                    string={features.predictedTransmembrane}
                                    proteinColorScheme={
                                        proteinColorSchemes[
                                            "predictedTransmembrane"
                                        ]
                                    }
                                />
                                <br />
                                Legend: {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes[
                                                "predictedTransmembrane"
                                            ].contrast["B"],
                                    }}
                                >
                                    B
                                </span>
                                - Transmembrane beta strand (IN --&gt OUT
                                orientation), {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes[
                                                "predictedTransmembrane"
                                            ].contrast["b"],
                                    }}
                                >
                                    b
                                </span>
                                - Transmembrane beta strand (OUT --&gt IN
                                orientation), {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes[
                                                "predictedTransmembrane"
                                            ].contrast["H"],
                                    }}
                                >
                                    H
                                </span>
                                - Transmembrane alpha helix (IN --&gt OUT
                                orientation), {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes[
                                                "predictedTransmembrane"
                                            ].contrast["h"],
                                    }}
                                >
                                    h
                                </span>
                                - Transmembrane alpha helix (OUT --&gt IN
                                orientation), {""}
                                <span
                                    style={{
                                        backgroundColor:
                                            proteinColorSchemes[
                                                "predictedTransmembrane"
                                            ].contrast["S"],
                                    }}
                                >
                                    S
                                </span>
                                - Signal peptide {""}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4>Disordered residues</h4>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <div>
                                <SequenceHighlighter
                                    string={features.predictedDisorder}
                                    proteinColorScheme={
                                        proteinColorSchemes["disorder"]
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4>Metal binding residues</h4>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <div>
                                <SequenceHighlighter
                                    string={features.predictedBindingMetal}
                                    proteinColorScheme={
                                        proteinColorSchemes["metal"]
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4>Nucleic acids binding residues</h4>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <div>
                                <SequenceHighlighter
                                    string={
                                        features.predictedBindingNucleicAcids
                                    }
                                    proteinColorScheme={
                                        proteinColorSchemes["nucleicAcids"]
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4>Small molecule binding residues</h4>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <div>
                                <SequenceHighlighter
                                    string={
                                        features.predictedBindingSmallMolecules
                                    }
                                    proteinColorScheme={
                                        proteinColorSchemes["smallMolecules"]
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Stack>
        </Container>
    );
};

PrintPage.propTypes = {
    sequenceFeatureArray: PropTypes.object,
};

export default PrintPage;
