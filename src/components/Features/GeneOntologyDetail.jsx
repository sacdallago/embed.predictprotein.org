import React from "react";

import MethodDetails from "../MethodDetails";

export default function GeneOntologyDetail() {
    return (
        <MethodDetails citations={["10.1038/s41598-020-80786-0"]}>
            <p>
                The output of goPredSim is a list of Gene Ontology (GO) terms.
                GO thrives to capture the complexity of protein function and
                standardize the vocabulary used to describe those in a human-
                and machine-readable manner. GO separates different aspects of
                function into three hierarchies: MFO (Molecular Function
                Ontology), BPO (biological process ontology), and CCO (cellular
                component(s) or subcellular localization(s) in which the protein
                acts). Each ontology is a rooted graph in which each node
                represents a GO term and each link a functional relationship.
                Thus, the prediction of our method can be seen as three
                subgraphs of the full ontologies. These three subgraphs are
                displayed below the tabular result. Often, the tabular result
                only contain very specific functional terms not reflecting the
                more general role of the protein that can be inferred by going
                to the root of the ontology.
            </p>
        </MethodDetails>
    );
}
