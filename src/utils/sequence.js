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
    let inputValid = false;

    if (input.length <= 3) {
        return [type, alphabet, inputValid];
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
    inputValid = isValid(type);
    return [type, alphabet, inputValid];
}

function isValid(type) {
    return type !== InputType.invalid;
}
