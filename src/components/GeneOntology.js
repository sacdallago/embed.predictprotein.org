import React from "react";
import {Col, Row, Table} from "react-bootstrap";

export default function GeneOntology(props) {

    let features = props.features;

    return <>
        <Row>
            <Col>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th colSpan="3">Biological process (BPO)</th>
                    </tr>
                    <tr>
                        <th>Reference Seq.</th>
                        <th>GO Name</th>
                        <th>Reliability Index</th>
                    </tr>
                    </thead>
                    <tbody>
                    {features.predictedBPO.map((value, index) => {
                        return (
                            <tr key={"" + index}>
                                <td>
                                    <a
                                        href={
                                            "https://www.uniprot.org/uniprot/" +
                                            features.predictedBPO[index]
                                                ?.identifier
                                        }
                                    >
                                        <div>
                                            {
                                                features.predictedBPO[index]
                                                    ?.identifier
                                            }
                                        </div>
                                    </a>
                                </td>

                                <td>
                                    <a
                                        href={
                                            "http://amigo.geneontology.org/amigo/term/" +
                                            features.predictedBPO[index]?.GO_Term
                                        }
                                    >
                                        <div>
                                            {
                                                features.predictedBPO[index]
                                                    ?.GO_Name
                                            }
                                        </div>
                                    </a>
                                </td>

                                <td>
                                    {features.predictedBPO[index]?.RI.toFixed(
                                        2
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </Col>
            <Col>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th colSpan="3">Molecular function (MFO)</th>
                    </tr>
                    <tr>
                        <th>Reference Seq.</th>
                        <th>GO Name</th>
                        <th>Reliability Index</th>
                    </tr>
                    </thead>
                    <tbody>
                    {features.predictedMFO.map((value, index) => {
                        return (
                            <tr key={"" + index}>
                                <td>
                                    <a
                                        href={
                                            "https://www.uniprot.org/uniprot/" +
                                            features.predictedMFO[index]
                                                ?.identifier
                                        }
                                    >
                                        <div>
                                            {
                                                features.predictedMFO[index]
                                                    ?.identifier
                                            }
                                        </div>
                                    </a>
                                </td>

                                <td>
                                    <a
                                        href={
                                            "http://amigo.geneontology.org/amigo/term/" +
                                            features.predictedMFO[index]?.GO_Term
                                        }
                                    >
                                        <div>
                                            {
                                                features.predictedMFO[index]
                                                    ?.GO_Name
                                            }
                                        </div>
                                    </a>
                                </td>

                                <td>
                                    {features.predictedMFO[index]?.RI.toFixed(
                                        2
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th colSpan="3">Cellular Component (CCO)</th>
                    </tr>
                    <tr>
                        <th>Reference Seq.</th>
                        <th>GO Name</th>
                        <th>Reliability Index</th>
                    </tr>
                    </thead>
                    <tbody>
                    {features.predictedCCO.map((value, index) => {
                        return (
                            <tr key={"" + index}>
                                <td>
                                    <a
                                        href={
                                            "https://www.uniprot.org/uniprot/" +
                                            features.predictedCCO[index]?.identifier
                                        }
                                    >
                                        <div>
                                            {
                                                features.predictedCCO[index]
                                                    ?.identifier
                                            }
                                        </div>
                                    </a>
                                </td>

                                <td>
                                    <a
                                        href={
                                            "http://amigo.geneontology.org/amigo/term/" +
                                            features.predictedCCO[index]?.GO_Term
                                        }
                                    >
                                        <div>
                                            {features.predictedCCO[index]?.GO_Name}
                                        </div>
                                    </a>
                                </td>

                                <td>
                                    {features.predictedCCO[index]?.RI.toFixed(
                                        2
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    </>
}
