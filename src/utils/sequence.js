export const InputType = {
    fasta: Symbol("fasta"),
    residue: Symbol("residue"),
    uniprot_id: Symbol("uniprot"),
    uniprot_protein_name: Symbol("protein_name"),
    invalid: Symbol("invalid"),
};

export const InputAlphabet = {
    iupac: Symbol("iupac"),
    iupac_extended: Symbol("extended"),
    undefined: Symbol("undefined"),
};

export const MIN_INPUT_LEN = 3;
export const MAX_INPUT_LEN = 5000;

const IUPAC = "ACDEFGHIKLMNPQRSTVWYX";
const IUPAC_extended = IUPAC + "BZJUO";

const re_accessionNumber = new RegExp(
    "[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$"
);
const re_uniprotName = new RegExp("[A-Z0-9]{3,20}_[A-Z0-9]{3,20}");
const re_invalid_aminoAcid = new RegExp("^$|[^" + IUPAC + "]");
const re_invalid_aminoAcid_extended = new RegExp(
    "^$|[^" + IUPAC_extended + "]"
);
const re_fasta_header = new RegExp("^>.*$");

const NON_DESCRIPT_ERROR =
    "An error fetching your sequence occured; please try again later";

function get_sequence_details(input) {
    let alphabet = InputAlphabet.undefined;
    let type = InputType.invalid;

    if (!re_invalid_aminoAcid.test(input)) {
        alphabet = InputAlphabet.iupac;
        type = InputType.residue;
    } else if (!re_invalid_aminoAcid_extended.test(input)) {
        alphabet = InputAlphabet.iupac_extended;
        type = InputType.residue;
    }
    return [type, alphabet];
}

export function eval_input_type(input) {
    let test_str = input.toUpperCase();
    let type = InputType.invalid;
    let alphabet = InputAlphabet.undefined;

    if (input <= MIN_INPUT_LEN || MAX_INPUT_LEN < input) {
        return [type, alphabet];
    }

    if (re_uniprotName.test(test_str)) {
        type = InputType.uniprot_protein_name;
    } else if (re_accessionNumber.test(test_str)) {
        type = InputType.uniprot_id;
    } else {
        [type, alphabet] = get_sequence_details(test_str);
        if (type === InputType.invalid) {
            let lines = test_str.split(/\r?\n/);
            if (lines.length > 1 && re_fasta_header.test(lines[0])) {
                [, alphabet] = get_sequence_details(lines.slice(1).join(""));
                if (alphabet !== InputAlphabet.undefined)
                    type = InputType.fasta;
            }
        }
    }
    return [type, alphabet];
}

function get_seq_from_fasta(input) {
    let lines = input.split("\n");
    return lines.slice(1).join("");
}

async function get_seq_from_uniprot_id(input) {
    let error = "";
    let sequence = "";
    input = input.trim();
    let response = await fetch(
        "https://rest.uniprot.org/uniprotkb/" +
            input +
            "?fields=accession,sequence"
    ).catch((e) => {
        error = NON_DESCRIPT_ERROR;
        console.error(e);
    });
    if (response.status === 404) {
        error = "Sequence could not be found.";
    } else if (!response.ok) {
        error = NON_DESCRIPT_ERROR;
        console.error("Error ", response.status, ": ", response.statusText);
    } else {
        let body = await response.json();
        sequence = body["sequence"]["value"];
    }
    return [sequence, error];
}

export async function get_sequence_for_type(input_type, input) {
    let seq = "";
    let error = undefined;
    switch (input_type) {
        case InputType.fasta:
            seq = get_seq_from_fasta(input);
            break;
        case InputType.uniprot_id:
            [seq, error] = await get_seq_from_uniprot_id(input);
            break;
        default:
            error = true;
    }
    console.log(seq, error);
    return [seq, error];
}
