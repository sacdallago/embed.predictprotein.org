import React from "react";

const InputType = {
    fasta: Symbol("fasta"),
    residue: Symbol("residue"),
    uniprot_id: Symbol("uniprot"),
    uniprot_protein_name: Symbol("protein_name"),
};

const example_input = {
    [InputType.fasta]: `>My sequence
MGDWSALGKLLDKVQAYSTAGGKVWLSVLFIFRILLLGTAVESAWGDEQSAFRCNTQQPG
CENVCYDKSFPISHVRFWVLQIIFVSVPTLLYLAHVFYVMRKEEKLNKKEEELKVAQTDG
VNVDMHLKQIEIKKFKYGIEEHGKVKMRGGLLRTYIISILFKSIFEVAFLLIQWYIYGFS
LSAVYTCKRDPCPHQVDCFLSRPTEKTIFIIFMLVVSLVSLALNIIELFYVFFKGVKDRV
KGKSDPYHATSGALSPAKDCGSQKYAYFNGCSSPTAPLSPMSPPGYKLVTGDRNNSSCRN
YNKQASEQNWANYSAEQNRMGQAGSTISNSHAQPFDFPDDNQNSKKLAAGHELQPLAIVD
QRPSSRASSRASSRPRPDDLEI`,
    [InputType.residue]:
        "MGDWSALGKLLDKVQAYSTAGGKVWLSVLFIFRILLLGTAVESAWGDEQSAFRCNTQQPGCENVCYDKSFPISHVRFWVLQIIFVSVPTLLYLAHVFYVMRKEEKLNKKEEELKVAQTDGVNVDMHLKQIEIKKFKYGIEEHGKVKMRGGLLRTYIISILFKSIFEVAFLLIQWYIYGFSLSAVYTCKRDPCPHQVDCFLSRPTEKTIFIIFMLVVSLVSLALNIIELFYVFFKGVKDRVKGKSDPYHATSGALSPAKDCGSQKYAYFNGCSSPTAPLSPMSPPGYKLVTGDRNNSSCRNYNKQASEQNWANYSAEQNRMGQAGSTISNSHAQPFDFPDDNQNSKKLAAGHELQPLAIVDQRPSSRASSRASSRPRPDDLEI",
    [InputType.uniprot_id]: "A0A654IBU3",
    [InputType.uniprot_protein_name]: "A0A654IBU3_HUMAN",
};

export const SequenceInput = (props) => {
    const [sequence, setSequence] = React.useState("");

    if (props.sequence !== "") {
        setSequence(props.sequence);
    }

    const setExampleState = (type) => {
        let input = example_input[type];
        setSequence(input);
    };

    return (
        <form>
            <textarea id="w3review" name="w3review" rows="5" value={sequence} />
            <div>
                Input a sequence in either{" "}
                <span
                    className="clickable-example"
                    onClick={() => setExampleState(InputType.fasta)}
                >
                    FASTA format
                </span>
                , a {""}
                <span
                    className="clickable-example"
                    onClick={() => setExampleState(InputType.uniprot_id)}
                >
                    UniProt Accession
                </span>{" "}
                number or {""}
                <span
                    className="clickable-example"
                    onClick={() =>
                        setExampleState(InputType.uniprot_protein_name)
                    }
                >
                    UniProt Protein Name
                </span>
                , or {""}
                <span
                    className="clickable-example"
                    onClick={() => setExampleState(InputType.residue)}
                >
                    AA sequence
                </span>
                .
            </div>
        </form>
    );
};

export default SequenceInput;
