import React from "react";
import { Col, Row, Table } from "react-bootstrap";

import { useFeatures } from "../../hooks/useFeatures";

function GOEntry({ go_term_data }) {
    return (
        <tr>
            <td>
                <a
                    href={
                        "https://www.uniprot.org/uniprot/" +
                        go_term_data?.identifier
                    }
                >
                    <div>{go_term_data?.identifier}</div>
                </a>
            </td>

            <td>
                <a
                    href={
                        "http://amigo.geneontology.org/amigo/term/" +
                        go_term_data?.GO_Term
                    }
                >
                    <div>{go_term_data?.GO_Name}</div>
                </a>
            </td>

            <td>{go_term_data?.RI.toFixed(2)}</td>
        </tr>
    );
}

export default function GeneOntology() {
    const { isSuccess, isLoading, isError, data } = useFeatures();

    if (isLoading) return <GeneOntologyLoading />;
    if (isError) return <GeneOntologyError />;
    if (isSuccess)
        return (
            <GeneOntologyLoaded
                predictedBPO={data.predictedBPO}
                predictedCCO={data.predictedCCO}
                predictedMFO={data.predictedMFO}
            />
        );
}

function GeneOntologyLoading() {}

function GeneOntologyError() {}

function GeneOntologyLoaded({ predictedBPO, predictedCCO, predictedMFO }) {
    return (
        <>
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
                            {predictedBPO.map((value, index) => {
                                return (
                                    <GOEntry
                                        go_term_data={value}
                                        key={`BPO-${index}`}
                                    />
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
                            {predictedMFO.map((value, index) => {
                                return (
                                    <GOEntry
                                        go_term_data={value}
                                        key={`MFO-${index}`}
                                    />
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
                            {predictedCCO.map((value, index) => {
                                return (
                                    <GOEntry
                                        go_term_data={value}
                                        key={`CCO-${index}`}
                                    />
                                );
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}
