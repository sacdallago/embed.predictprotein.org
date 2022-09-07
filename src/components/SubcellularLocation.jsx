import React from "react";
import {Col, ListGroup, Row} from "react-bootstrap";

import cytoplasm from "../assets/cytoplasm.PNG";
import plasmaMembrane from "../assets/plasmaMembrane.PNG";
import endoplasmicReticulum from "../assets/endoplasmicReticulum.PNG";
import golgiApparatus from "../assets/golgiApparatus.PNG";
import vacuole from "../assets/vacuole.PNG";
import mitochondrion from "../assets/mitochondrion.PNG";
import nucleus from "../assets/nucleus.PNG";
import peroxisome from "../assets/peroxisome.PNG";
import plastid from "../assets/plastid.PNG";
import secreted from "../assets/secreted.PNG";

const locations_mapping = {
    Cytoplasm: cytoplasm,
    "Cell-Membrane": plasmaMembrane,
    "Endoplasmic reticulum'": endoplasmicReticulum,
    "Golgi - Apparatus": golgiApparatus,
    "Lysosome / Vacuole": vacuole,
    Mitochondrion: mitochondrion,
    Nucleus: nucleus,
    Peroxisome: peroxisome,
    Plastid: plastid,
    "Extra - cellular": secreted,
};

export default function SubcellularLocalization(props) {
    let features = props.features;

    return <>
        <Row>
            <Col>
                <img
                    src={
                        locations_mapping[
                            features.predictedSubcellularLocalizations
                            ]
                    }
                    alt="Subcell Location"
                    height={390}
                />
            </Col>
            <Col>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        Subcellular location:{" "}
                        <b> {features.predictedSubcellularLocalizations} </b>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Membrane bound: <b>{features.predictedMembrane}</b>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
    </>

}
