import { alphabets } from './index';

export const sequenceParser = (alphabet) => {
    switch(alphabet){
        case alphabets.PSI_BLAST:
            return /^(([A-Z*\-])+\n{0,1})+$/;
        case alphabets.EXTENDED_IUPAC2:
            return /^(([ACDEFGHIKLMNPQRSTVWYBXZ*\-])+\n{0,1})+$/;
        case alphabets.IUPAC2:
            return /^(([ACDEFGHIKLMNPQRSTVWYBXZ])+\n{0,1})+$/;
        case alphabets.IUPAC:
        case alphabets.NATURAL:
        case undefined:
        default:
            return /^([ACDEFGHIKLMNPQRSTVWY])+$/;
    }
};

export const FASTABodyParser = (alphabet) => {
    switch(alphabet){
        case alphabets.PSI_BLAST:
            return /^([A-Z\-])+$/;
        case alphabets.EXTENDED_IUPAC2:
            return /^([ACDEFGHIKLMNPQRSTVWYBXZ\-])+$/;
        case alphabets.IUPAC2:
            return /^([ACDEFGHIKLMNPQRSTVWYBXZ])+$/;
        case alphabets.IUPAC:
        case alphabets.NATURAL:
        case undefined:
        default:
            return /^([ACDEFGHIKLMNPQRSTVWY])+$/;
    }
};

export const FASTAEndReadParser = (alphabet) => {
    switch(alphabet){
        case alphabets.PSI_BLAST:
            return /^([A-Z\-])+\*$/;
        case alphabets.EXTENDED_IUPAC2:
            return /^([ACDEFGHIKLMNPQRSTVWYBXZ*\-])+\*$/;
        case alphabets.IUPAC2:
            return /^([ACDEFGHIKLMNPQRSTVWYBXZ])+\*$/;
        case alphabets.IUPAC:
        case alphabets.NATURAL:
        case undefined:
        default:
            return /^([ACDEFGHIKLMNPQRSTVWY])+\*$/;
    }
};

export const validFasta = (fasta, alphabet) => {

    // sequences holds three stages
    // 0: no sequences parsed --> invalid fasta
    // 1: One sequence has been parsed header only (missing sequence part)
    // 2: all sequences in FASTA file have header AND sequence


    let sequences = 0;

    // this flags get updated when I'm reading a sequence. No comments should appear when I'm reading a sequence (see switch).
    let readingSequence = false;
    let readingHeaders = false;

    fasta
    // Split line by line
        .split("\n")
        // Get rid of lines only containing spaces or tabs (or nothing)
        .filter(s => s.replace(/[\s|\t]+/,'').length > 0)
        // Perform switch on line output
        .forEach((line) => {
            switch(true){
                // Marks beginning of sequence in common FASTA file
                case /^>/.test(line):
                // Comments can only appear in header. If ; appears while reading a sequence,
                // am most likely starting to read a new protein which laks the usual > beginning.
                // Be very strict about this condition.
                case (/^;/.test(line) && readingSequence === true && readingHeaders === false):
                // Case where ; sequence starts at beginning of file
                case (/^;/.test(line) && readingSequence === false && readingHeaders === false):
                    readingHeaders = true;
                    readingSequence = false;

                    sequences = 1;

                    break;

                // Some sequences terminate in *. Get rid of that and update the reading sequence condition.
                case FASTAEndReadParser(alphabet).test(line) && (
                    (readingSequence === false && readingHeaders === true) ||
                    (readingSequence === true && readingHeaders === false)
                ):
                    readingSequence = false;
                    sequences = 2;

                    break;

                // If repetition of characters, most likely sequence
                // IMPORTANT!!! ONLY CAPITAL LETTERS!!!!
                case FASTABodyParser(alphabet).test(line) && (
                    (readingSequence === false && readingHeaders === true) ||
                    (readingSequence === true && readingHeaders === false)
                ):
                    readingSequence = true;
                    readingHeaders = false;
                    sequences = 2;

                    break;

                // If reading header and ; appears: it's a comment
                case (/^;/.test(line) && readingSequence === false && readingHeaders === true):
                    break;

                // Something weird happened!
                default:
                    return false;
            }
        });

    return sequences === 2;
};


export const extractFASTAHeaderInfo = (header) => {

    // GenBank	gb|accession|locus
    let geneBank = /gb\|\w+(\.\w+)\|.*/;
    // EMBL Data Library	emb|accession|locus
    // DDBJ, DNA Database of Japan	dbj|accession|locus
    // NBRF PIR	pir||entry
    // Protein Research Foundation	prf||name
    // SWISS-PROT	sp|accession|entry name
    let swissProt = /sp\|\w+\|.*/;
    // Brookhaven Protein Data Bank	pdb|entry|chain
    // Patents	pat|country|number
    // GenInfo Backbone Id	bbs|number
    // General database identifier	gnl|database|identifier
    // NCBI Reference Sequence	ref|accession|locus
    // Local Sequence identifier	lcl|identifier

    let matchers = [geneBank, swissProt];

    return matchers
        .map(e => {
            let current = header.match(e);
            if (current !== undefined && current !== null) {
                current = current[0].split("|");

                return {
                    "database": current[0],
                    "identifier": current[1],
                    "locus": current[2]
                };
            } else {
                return undefined;
            }
        })
        .filter(e => e !== undefined);
};