import { fetchWithTimeout } from "./net_utils";

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
export const MAX_INPUT_LEN = 2000;

const IUPAC = "ACDEFGHIKLMNPQRSTVWYX";
const IUPAC_extended = IUPAC + "BZJUO";

const re_accessionNumber = new RegExp(
    "^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9](?:[A-Z][A-Z0-9]{2}[0-9]){1,2}$"
);
const re_uniprotName = new RegExp("^[A-Z0-9]{3,20}_[A-Z0-9]{3,20}$");
const re_invalid_aminoAcid = new RegExp("^$|[^" + IUPAC + "]");
const re_invalid_aminoAcid_extended = new RegExp(
    "^$|[^" + IUPAC_extended + "]"
);
const re_uniprot_fasta = new RegExp(
    "^>(?:tr|sp)\\|(?<id>" + re_accessionNumber.source.slice(1, -1) + ")\\|.*$"
);
const re_fasta_header = new RegExp("^>.*$");

export class SequenceException extends Error {
    constructor(message, error = null) {
        super(message);
        this.name = this.constructor.name;
        this.error = error;
    }
}

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

function get_seq_from_residue(input) {
    input = input.trim();
    return input.split("\n").join("");
}

function get_seq_from_fasta(input) {
    input = input.trim();
    let lines = input.split("\n");
    let accession = undefined;
    let uniprot_header = re_uniprot_fasta.exec(lines[0]);
    if (uniprot_header !== null) accession = uniprot_header.groups.id;
    return [lines.slice(1).join(""), accession];
}

async function get_seq_from_uniprot_id(input) {
    input = input.trim();

    return await get_seq_from_uniprot(
        "https://rest.uniprot.org/uniprotkb/" +
            input +
            "?fields=accession,sequence&format=json"
    );
}

export async function get_uniprot_status() {
    let seq_acc = "A0A654IBU3";
    let status_url = `https://rest.uniprot.org/uniprotkb/${seq_acc}?fields=accession&format=json`;
    let body = query_uniprot(status_url);
    let reportedAcession = body["primaryAccession"] ?? undefined;
    console.log(reportedAcession);
    if (reportedAcession !== seq_acc) {
        throw new SequenceException(
            "Oops... something went wrong contacting Uniprot; Please try again later"
        );
    }
    return reportedAcession;
}

async function get_seq_from_uniprot_name(input) {
    input = input.trim();

    return await get_seq_from_uniprot(
        "https://rest.uniprot.org/uniprotkb/search?query=id:" +
            input +
            "+OR+protein_name:" +
            input +
            "&fields=accession,sequence&format=json&size=1"
    );
}

async function query_uniprot(url) {
    let response = await fetchWithTimeout(url).catch((e) => {
        throw new SequenceException(
            "Oops... something went wrong contacting Uniprot; Please try again later",
            e
        );
    });
    if (response.status === 404) {
        throw new SequenceException(
            "Could not find a sequence with this identifier.",
            null
        );
    } else if (!response.ok) {
        throw new SequenceException(
            "Oops... something went wrong at Uniprot; Please try again later",
            null
        );
    } else {
        let body = await response.json();
        if ("results" in body) {
            if (body.results.length === 0)
                throw new SequenceException(
                    "Could not find a protein matching the criteria",
                    null
                );
            body = body.results[0];
        }
        return body;
    }
}

async function get_seq_from_uniprot(url) {
    let sequence = "";
    let accession = undefined;
    let body = await query_uniprot(url);
    accession = body["primaryAccession"] ?? undefined;
    sequence = body["sequence"]["value"] ?? undefined;

    return [sequence, accession];
}

export async function get_sequence_for_type(input_type, input) {
    let sequence = "";
    let accession = undefined;
    switch (input_type) {
        case InputType.fasta:
            [sequence, accession] = get_seq_from_fasta(input);
            break;
        case InputType.uniprot_id:
            [sequence, accession] = await get_seq_from_uniprot_id(input);
            break;
        case InputType.uniprot_protein_name:
            [sequence, accession] = await get_seq_from_uniprot_name(input);
            break;
        case InputType.residue:
            sequence = get_seq_from_residue(input);
            break;
        default:
            throw new SequenceException(
                "That should not have happened. Please reload.",
                { error: "Invalid Input type!", input_type: input_type }
            );
    }
    return { sequence: sequence, accession: accession };
}
