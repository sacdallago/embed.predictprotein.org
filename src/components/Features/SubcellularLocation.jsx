import React from "react";
import { Col, Container, Row, ListGroup, Placeholder } from "react-bootstrap";
import { run as runHolder } from "holderjs/holder";

import cytoplasm from "../../assets/cytoplasm.PNG";
import plasmaMembrane from "../../assets/plasmaMembrane.PNG";
import endoplasmicReticulum from "../../assets/endoplasmicReticulum.PNG";
import golgiApparatus from "../../assets/golgiApparatus.PNG";
import vacuole from "../../assets/vacuole.PNG";
import mitochondrion from "../../assets/mitochondrion.PNG";
import nucleus from "../../assets/nucleus.PNG";
import peroxisome from "../../assets/peroxisome.PNG";
import plastid from "../../assets/plastid.PNG";
import secreted from "../../assets/secreted.PNG";
import { useFeatures } from "../../hooks/useFeatures";

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

export default function SubcellularLocation() {
    const { isSuccess, isLoading, isError, data } = useFeatures();

    const renderAction = () => {
        if (isLoading) return <SubcellularLocationLoading />;
        if (isError) return <SubcellularLocationError />;
        if (isSuccess)
            return (
                <SubcellularLocationLoaded
                    location={data.predictedSubcellularLocalizations}
                    membrane={data.predictedMembrane}
                />
            );
    };

    return (
        <>
            <p className="mb-5">
                LA ProtT5 predicts the sub-cellular localization of proteins in
                ten classes (nucleus, cytoplasm, extracellular space,
                mitochondrion, cell membrane, endoplasmatic reticulum, plastid,
                Golgi apparatus, lysosome/vacuole and peroxisome). {""}
                The method was trained and evaluated on eukaryotic proteins.
            </p>

            {renderAction()}
        </>
    );
}

function SubcellularLocationLoading() {
    React.useEffect(() => {
        runHolder("image-class-name");
    });
    return (
        <Container>
            <Row>
                <Col>
                    <img
                        src="holder.js/390x390?text=\n"
                        alt="Subcell Location"
                        height={390}
                    />
                </Col>
                <Col>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            Subcellular location:{" "}
                            <Placeholder style={{ width: "29ch" }} />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Membrane bound:{" "}
                            <Placeholder style={{ width: "30ch" }} />
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
}

function SubcellularLocationError() {}

function SubcellularLocationLoaded({ location, membrane }) {
    return (
        <Container>
            <Row>
                <Col>
                    <img
                        src={locations_mapping[location]}
                        alt="Subcell Location"
                        height={390}
                    />
                </Col>
                <Col>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            Subcellular location: <b> {location} </b>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Membrane bound: <b>{membrane}</b>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
}
