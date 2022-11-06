import { useStructure } from "../../hooks/useStructure";

import { FaCreativeCommonsBy, FaCreativeCommons } from "react-icons/fa";
import MethodDetails from "../MethodDetails";

export default function StructurePredictionDetail() {
    const { queryAFDB } = useStructure();

    var molstar_text = (
        <>
            The structure is displayed using the{" "}
            <a
                href="https://github.com/molstar/pdbe-molstar"
                target="_blank"
                rel="noreferrer"
                className="link-dark"
            >
                PDBe implementation
            </a>{" "}
            of{" "}
            <a
                href="https://molstar.org/"
                target="_blank"
                rel="noreferrer"
                className="link-dark"
            >
                Mol*
            </a>
            .
        </>
    );
    var citations = [];
    var method_text = undefined;
    if (queryAFDB) {
        citations.push("10.1038/s41586-021-03819-2", "10.1093/nar/gkab1061");
        method_text = (
            <>
                The structure was retrieved from{" "}
                <a
                    href="https://www.alphafold.ebi.ac.uk"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    Alphafold DB
                </a>{" "}
                and is available curtesy of{" "}
                <a
                    href="https://www.ebi.ac.uk/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    Deepmind
                </a>{" "}
                and{" "}
                <a
                    href="https://www.ebi.ac.uk/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    EMBL-EBI
                </a>
                . Details regarding the current precition pipeline can be found{" "}
                <a
                    href="https://www.alphafold.ebi.ac.uk/faq"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    here
                </a>{" "}
                <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    <FaCreativeCommons />
                    <FaCreativeCommonsBy />
                </a>
                . {molstar_text}
            </>
        );
    } else {
        citations.push("10.1038/s41592-022-01488-1");
        method_text = (
            <>
                The structure was predicted using the latest version of{" "}
                <a
                    href="https://github.com/sokrypton/ColabFold"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    ColabFold
                </a>
                . Implementation and model details in bioembeddings can be found{" "}
                <a
                    href="https://github.com/sacdallago/bio_embeddings/blob/efb9801f0de9b9d51d19b741088763a7d2d0c3a2/webserver/tasks/colabfold.py#L40-L58"
                    target="_blank"
                    rel="noreferrer"
                    className="link-dark"
                >
                    here
                </a>
                . {molstar_text}
            </>
        );
    }
    citations.push("10.1093/nar/gkab314"); //Add molstar ciataion last.

    return <MethodDetails citations={citations}>{method_text}</MethodDetails>;
}
