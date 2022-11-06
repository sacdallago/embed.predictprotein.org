import React from "react";

import MethodDetails from "../MethodDetails";
import { proteinColorSchemes } from "../../lib/coloring";

export default function FeatureViewerDetail() {
    return (
        <MethodDetails
            citations={[
                "10.5281/zenodo.345324",
                "10.1007/s00439-021-02411-y",
                "10.1007/s00439-021-02411-y",
                "10.1186/s12859-022-04873-x",
                "10.1038/s41598-020-80786-0",
            ]}
        >
            <>
                <br />
                <p>
                    <b>Sequence</b>: the input sequence. You may need to zoom
                    into a region to render a visualization of the sequence
                    which is otherwise hidden for longer sequences.
                </p>
                <p>
                    <b>Topology</b>: the predicted topology using TMbed. For
                    instance, transmembrane regions or signal peptides. There
                    are five possible predictions{""}: beta strand (
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["transmembrane"].contrast[
                                    "B"
                                ],
                        }}
                    >
                        IN → OUT
                    </span>{" "}
                    or {""}
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["transmembrane"].contrast[
                                    "b"
                                ],
                        }}
                    >
                        IN ← OUT
                    </span>{" "}
                    orientation), {""}
                    alpha helix (
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["transmembrane"].contrast[
                                    "H"
                                ],
                        }}
                    >
                        IN → OUT
                    </span>{" "}
                    or {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["transmembrane"].contrast[
                                    "h"
                                ],
                        }}
                    >
                        IN ← OUT
                    </span>{" "}
                    orientation), and {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["transmembrane"].contrast[
                                    "S"
                                ],
                        }}
                    >
                        signal peptides
                    </span>
                    .
                </p>
                <p>
                    <b>Structure</b>: secondary structure predicted in three
                    states (
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["H"],
                        }}
                    >
                        alpha helix
                    </span>
                    , {""}
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["E"],
                        }}
                    >
                        beta strand
                    </span>
                    , and {""}
                    <span
                        style={{
                            backgroundColor:
                                proteinColorSchemes["dssp8"].contrast["C"],
                        }}
                    >
                        other
                    </span>
                    ) using the ProtT5Sec method.
                </p>
                <p>
                    <b>Disorder</b>: binary disorder prediction using ProtT5Sec.
                    Soon to be predicted using SETH.
                </p>
                <p>
                    <b>Binding</b>: prediction of residues' ability to bind {""}
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["metal"].contrast["M"],
                        }}
                    >
                        metal
                    </span>{" "}
                    or {""}
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["smallMolecules"].contrast[
                                    "S"
                                ],
                        }}
                    >
                        small
                    </span>{" "}
                    molecules, or {""}
                    <span
                        style={{
                            color: "white",
                            backgroundColor:
                                proteinColorSchemes["nucleicAcids"].contrast[
                                    "N"
                                ],
                        }}
                    >
                        nucleic
                    </span>{" "}
                    acids using the BindEmbedDL method.
                </p>
                <p>
                    <b>Conservation</b>: residue conservation from{" "}
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
                    </span>{" "}
                    (highly variable) , {""}
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
                    , {""}
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
                    </span>{" "}
                    {""}
                    (highly conserved) using the ProtT5cons method. The color
                    scheme applies to the overlay on the 3D structure below.
                </p>
                <p>
                    <b>μ variation</b>: pooled single amino acid variant effect
                    from 0 (mutations unlikely affect function) to 100
                    (mutations likely affect function) using the VESPAl method.{" "}
                    {""}
                    Note that pooled values may not give as clear of a picture
                    as per-substitution scores, which can be found in the
                    "Single amino acid variant effect" section in the main page.
                </p>
            </>
        </MethodDetails>
    );
}
