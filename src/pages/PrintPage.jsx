import React from "react";
import Highlighter from "../components/Features/Highlighter";

import { Container, Stack } from "react-bootstrap";

import { useFeatures } from "../hooks/useFeatures";
import { proteinColorSchemes } from "../utils/Graphics";

const PrintInput = () => (
    // TODO take colorscheme aliView
    // TODO add legend
    <div>
        <h4>Input Sequence</h4>
        <div>
            <Highlighter
                dataFn={(data) => data.sequence}
                displayStyle={proteinColorSchemes["mview"]}
            />
        </div>
    </div>
);

const PrintDSSP3 = () => (
    <div>
        <h4>Secondary structure in three states (DSSP3)</h4>
        <div className="row mb-5">
            <div className="col-lg-12">
                <div>
                    <Highlighter
                        dataFn={(data) => data.predictedDSSP3}
                        displayStyle={proteinColorSchemes["dssp8"]}
                    />
                </div>
                <br />
                Legend: {""}
                <span
                    style={{
                        backgroundColor:
                            proteinColorSchemes["dssp8"].contrast["H"],
                    }}
                >
                    H
                </span>
                elix, {""}
                <span
                    style={{
                        backgroundColor:
                            proteinColorSchemes["dssp8"].contrast["E"],
                    }}
                >
                    E
                </span>
                -Sheet, {""}
                <span
                    style={{
                        backgroundColor:
                            proteinColorSchemes["dssp8"].contrast["C"],
                    }}
                >
                    C
                </span>
                -Other {""}
            </div>
        </div>
    </div>
);

const PrintDSSP8 = () => (
    <div>
        <h4>Secondary structure in eight states (DSSP8)</h4>
        <div className="row mb-5">
            <div className="col-lg-12">
                <div>
                    <Highlighter
                        dataFn={(data) => data.predictedDSSP8}
                        displayStyle={proteinColorSchemes["dssp8"]}
                    />
                    <br />
                    Legend: {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["H"],
                        }}
                    >
                        H
                    </span>
                    - α-helix, {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["E"],
                        }}
                    >
                        E
                    </span>
                    - Extended strand, participates in β ladder, {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["C"],
                        }}
                    >
                        C
                    </span>
                    - Other, {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["I"],
                        }}
                    >
                        I
                    </span>
                    - 5-helix, {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["B"],
                        }}
                    >
                        B
                    </span>
                    - Residue in isolated β-bridge, {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["S"],
                        }}
                    >
                        S
                    </span>
                    - Bend, {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["T"],
                        }}
                    >
                        T
                    </span>
                    - Hydrogen bonded turn, {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["G"],
                        }}
                    >
                        G
                    </span>
                    - 3-helix {""}
                </div>
            </div>
        </div>
    </div>
);

const PrintConservation = () => (
    <div>
        <h4 tag="h4">Residue conservation</h4>
        <div className="row mb-5">
            <div className="col-lg-12">
                <div>
                    <Highlighter
                        dataFn={(data) =>
                            data.predictedConservation
                                .map((e) => e + "")
                                .join("")
                        }
                        displayStyle={proteinColorSchemes["conservation"]}
                    />
                    <br />
                    Legend: {""}
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "0"
                                ],
                        }}
                    >
                        0
                    </span>
                    - Highly variable, {""}
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "1"
                                ],
                        }}
                    >
                        1
                    </span>
                    , {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "2"
                                ],
                        }}
                    >
                        2
                    </span>
                    , {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "3"
                                ],
                        }}
                    >
                        3
                    </span>
                    , {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "4"
                                ],
                        }}
                    >
                        4
                    </span>
                    , {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "5"
                                ],
                        }}
                    >
                        5
                    </span>
                    - Neutral, {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "6"
                                ],
                        }}
                    >
                        6
                    </span>
                    , {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "7"
                                ],
                        }}
                    >
                        7
                    </span>
                    , {""}
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["conservation"].contrast[
                                    "8"
                                ],
                        }}
                    >
                        8
                    </span>
                    - Highly conserved {""}
                </div>
            </div>
        </div>
    </div>
);

const PrintTopology = () => (
    <div>
        <h4>Toplogy (transmembrane regions)</h4>
        <div className="row mb-5">
            <div className="col-lg-12">
                <div>
                    <Highlighter
                        dataFn={(data) => data.predictedTransmembrane}
                        displayStyle={
                            proteinColorSchemes["predictedTransmembrane"]
                        }
                    />
                    <br />
                    Legend: {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["predictedTransmembrane"]
                                    .contrast["B"],
                        }}
                    >
                        B
                    </span>
                    - Transmembrane beta strand (IN --{">"} OUT orientation),{" "}
                    {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["predictedTransmembrane"]
                                    .contrast["b"],
                        }}
                    >
                        b
                    </span>
                    - Transmembrane beta strand (OUT --{">"} IN orientation),{" "}
                    {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["predictedTransmembrane"]
                                    .contrast["H"],
                        }}
                    >
                        H
                    </span>
                    - Transmembrane alpha helix (IN --{">"} OUT orientation),{" "}
                    {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["predictedTransmembrane"]
                                    .contrast["h"],
                        }}
                    >
                        h
                    </span>
                    - Transmembrane alpha helix (OUT --{">"} IN orientation),{" "}
                    {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["predictedTransmembrane"]
                                    .contrast["S"],
                        }}
                    >
                        S
                    </span>
                    - Signal peptide {""}
                </div>
            </div>
        </div>
    </div>
);
// TODO add legend

const PrintDisoreder = () => (
    <div>
        <h4>Disordered residues</h4>
        <div className="row mb-5">
            <div className="col-lg-12">
                <div>
                    <Highlighter
                        dataFn={(data) => data.predictedDisorder}
                        displayStyle={proteinColorSchemes["disorder"]}
                    />
                </div>
            </div>
        </div>
    </div>
);

// TODO merge
const PrintMetalBinding = () => (
    <div>
        <h4>Metal binding residues</h4>
        <div className="row mb-5">
            <div className="col-lg-12">
                <div>
                    <Highlighter
                        dataFn={(data) => data.predictedBindingMetal}
                        displayStyle={proteinColorSchemes["metal"]}
                    />
                </div>
            </div>
        </div>
    </div>
);

const PrintNucleicBinding = () => (
    <div>
        <h4>Nucleic acids binding residues</h4>
        <div className="row mb-5">
            <div className="col-lg-12">
                <div>
                    <Highlighter
                        dataFn={(data) => data.predictedBindingNucleicAcids}
                        displayStyle={proteinColorSchemes["nucleicAcids"]}
                    />
                </div>
            </div>
        </div>
    </div>
);

const PrintSmallBinding = () => (
    <div>
        <h4>Small molecule binding residues</h4>
        <div className="row mb-5">
            <div className="col-lg-12">
                <div>
                    <Highlighter
                        dataFn={(data) => data.predictedBindingSmallMolecules}
                        displayStyle={proteinColorSchemes["smallMolecules"]}
                    />
                </div>
            </div>
        </div>
    </div>
);

const PrintPage = () => {
    return (
        <Container>
            <Stack gap={3}>
                <PrintInput />
                <PrintDSSP3 />
                <PrintDSSP8 />
                <PrintConservation />
                <PrintTopology />
                <PrintDisoreder />
                <PrintMetalBinding />
                <PrintNucleicBinding />
                <PrintSmallBinding />
            </Stack>
        </Container>
    );
};

export default PrintPage;
