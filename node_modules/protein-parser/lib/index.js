'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var md5 = _interopDefault(require('md5'));

const sequenceParser = (alphabet) => {
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

const FASTABodyParser = (alphabet) => {
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

const FASTAEndReadParser = (alphabet) => {
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

const validFasta = (fasta, alphabet) => {

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


const extractFASTAHeaderInfo = (header) => {

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

let request$1;

{
    request$1 = require('request');
}




// TODO: could use some more work...
const uniprotNameRegex = /[A-Z0-9]{3,20}_[A-Z0-9]{3,20}/;

let request;

{
    request = require('request');
}

// Private functions and constants
// From http://www.uniprot.org/help/accession_numbers
const accessionNumberRegex = /^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$/;


/**
 * Class Protein exports functions to parse specific text formats
 */
class Protein {

    constructor(sequence){
        this.sequence = sequence;
        this.hash = md5(sequence);
    }

    setUniprotData(uniprotData){
        this.uniprotData = uniprotData;
    }

    retrieveUniprotData(accession){
        let url = 'https://www.ebi.ac.uk/proteins/api/proteins/' + accession;
        let self = this;

        {
            return new Promise((resolve, reject) => {
                request
                    .get(url, (error, response, body) => {
                        if(error){
                            reject(error);
                        } else {
                            let protein = JSON.parse(body);

                            self.uniprotData = protein;
                            resolve(protein);
                        }
                    });
            });
        }
    }

    getUniprotData(){
        return this.uniprotData;
    }

    getUniprotAccession(){
        return this.uniprotData && this.uniprotData.accession
    }
}


/**
 * Get Protein objects from Fasta string.
 *
 *
 * @param           {String}    text        A string representing the FASTA input
 * @param           {Number}    alphabet    A string representing the alphabet to use for validation.
 *                                          Valid alphabets include ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html),
 *                                          ["IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["EXTENDED-IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["PSI-BLAST"](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp).
 *                                          Default is ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html).
 *
 * @return      {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being an array of Protein objects
 * (r) being an array containing the raw FASTA sequences parsed
 * Promise get's rejected (aka. `catch` clause) if some parsing error occurs.
 *
 */
function fromFasta(text, alphabet){
    if(typeof text !== 'string'){
        throw "Passed invalid object to parse function."
    }
    else if(text.length < 1){
        throw "Passed an empty string."
    }

    let sequences = [];

    // this flag get's updated when I'm reading a sequence. No comments should appear when I'm reading a sequence (see switch).
    let readingSequence = false;
    let readingHeaders = false;

    return new Promise((resolve, reject) => {
        text
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
                        sequences.push({
                            header: line.substring(1, line.length),
                            headerInfo: extractFASTAHeaderInfo(line),
                            sequence: '',
                            comments: ''
                        });

                        readingHeaders = true;
                        readingSequence = false;

                        break;

                    // Some sequences terminate in *. Get rid of that and update the reading sequence condition.
                    case FASTAEndReadParser(alphabet).test(line) && (
                        (readingSequence === false && readingHeaders === true) ||
                        (readingSequence === true && readingHeaders === false)
                    ):
                        sequences[sequences.length-1].sequence += line.substring(1, line.length-1);

                        readingSequence = false;

                        break;

                    // If repetition of characters, most likely sequence
                    // IMPORTANT!!! ONLY CAPITAL LETTERS!!!!
                    case FASTABodyParser(alphabet).test(line) && (
                        (readingSequence === false && readingHeaders === true) ||
                        (readingSequence === true && readingHeaders === false)
                    ):
                        sequences[sequences.length-1].sequence += line;

                        readingSequence = true;
                        readingHeaders = false;

                        break;

                    // If reading header and ; appears: it's a comment
                    case (/^;/.test(line) && readingSequence === false && readingHeaders === true):
                        sequences[sequences.length-1].comments += line.substring(1, line.length) + ' ';
                        break;

                    // Something weird happened!
                    default:
                        return reject("Could not parse one line of FASTA input:\n\n" + line);
                }
            });

        let promises = [];

        sequences.forEach(s => {
            promises.push(new Promise((resolve, reject) => {
                    let uniprotAccession = s.headerInfo.find(p => p.database === "sp");

                    if(uniprotAccession){
                        fromAccession(uniprotAccession.identifier)
                            .then(([proteins, _]) => {
                                resolve(proteins[0]);
                            })
                            .catch(() => resolve(new Protein(s.sequence)));
                    } else {
                        resolve(new Protein(s.sequence));
                    }
                })
            );
        });

        return Promise.all(promises)
            .then(proteins => resolve([proteins, sequences]))
            .catch(e => reject(e));
    });
}

/**
 * Get Protein object from Accession number (via UniProt).
 *
 *
 * @param           {String}    accession   A string representing the UniProt accession number (eg.: P12345)
 *
 * @return          {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being an array containing one Protein object
 * (r) being an array containing one entry, aka. the raw GET result from UniProt
 * Promise get's rejected (aka. `catch` clause) if 5** or 4** response from server.
 */
function fromAccession(accession) {
    if(!accessionNumberRegex.test(accession)){
        return new Promise((resolve, reject) => {
            return reject();
        });
    }

    let url = 'https://www.ebi.ac.uk/proteins/api/proteins/' + accession;

    {
        return new Promise((resolve, reject) => {
            request
                .get(url, (error, response, body) => {
                    if(error){
                        return reject(error);
                    } else {
                        let protein = JSON.parse(body);
                        let p = new Protein(protein.sequence.sequence);
                        p.setUniprotData(protein);

                        return resolve([[p], [protein]]);
                    }
                });
        });
    }
}

/**
 * Get Protein objects (via UniProt).
 *
 *
 * @param           {String}    query   A string representing a protein name, a gene name, or anything UniProt-queriable
 * @param           {Number}    limit   A number representing the max amount of returned sequences by the query. If omitted, defaults to 2. Set to `undefined` for no limit.
 *
 * @return      {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being an array of Protein objects
 * (r) being an array containing the raw FASTA sequences parsed
 * Promise get's rejected (aka. `catch` clause) if some parsing error occurs.
 */
function fromUniprotQuery(query, limit=2) {

    // Limit to two entries: if more than 1, you know: identifier is not unique!
    let url = 'https://www.uniprot.org/uniprot/?format=fasta&limit=' + limit + '&query=' + query;

    if(limit === undefined){
        url = 'https://www.uniprot.org/uniprot/?format=fasta&query=' + query;
    }

    {
        return new Promise((resolve, reject) => {
            request
                .get(url, (error, response, fastaProteins) => {
                    if(error){
                        return reject(error);
                    } else {
                        if(fastaProteins.length > 0){
                            return fromFasta(fastaProteins, alphabets.IUPAC2)
                                .then(result => {
                                    resolve(result);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        } else {
                            return reject("No sequences found");
                        }
                    }
                });
        });
    }
}

/**
 * Get Protein object from A-Z sequence
 *
 *
 * @param           {String}    sequence   A string representing a protein sequence (A-Z)
 * @param           {Number}    alphabet   A string representing the alphabet to use for validation.
 *                                          Valid alphabets include ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html),
 *                                          ["IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["EXTENDED-IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["PSI-BLAST"](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp).
 *                                          Default is ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html).
 *
 * @return          {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being an array containing one Protein object
 * (r) being an array containing one string representing the sequence matched
 * Promise get's rejected (aka. `catch` clause) if parsing doesn't identify candidates
 */
function fromSequence(sequence, alphabet) {
    return new Promise((resolve, reject) => {
        let match = sequence.match(sequenceParser(alphabet));
        if (match !== undefined && match !== null) {
            match = match.map(e => e.replace(/\n/g,""));

            return resolve([[new Protein(match[0])], [match[0]]]);
        } else {
            return reject('No sequence identified');
        }
    });
}


/**
 * Get Protein object from Accession number (via UniProt).
 *
 *
 * @param           {String}    text   A string representing a FASTA sequence, an UniProt accession or a sequence in A-Z format
 * @param           {Number}    alphabet   A string representing the alphabet to use for validation.
 *                                          Valid alphabets include ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html),
 *                                          ["IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["EXTENDED-IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["PSI-BLAST"](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp).
 *                                          Default is ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html).
 *
 * @return          {Object}   True if text can be parsed either as UniProt accession, AA sequence or FASTA file
 */
function validInput(text, alphabet) {
    switch(true){
        case (accessionNumberRegex.test(text)):
            return parsers.accession;
        case sequenceParser(alphabet).test(text):
            return parsers.aa;
        case validFasta(text, alphabet):
            return parsers.fasta;
        case (uniprotNameRegex.test(text)):
            return parsers.protein_name;
        default:
            return undefined;
    }
}


/**
 * Get Protein object from Accession number (via UniProt).
 *
 *
 * @param           {String}    text   A string representing a FASTA sequence, an UniProt accession or a sequence in A-Z format
 * @param           {Number}    alphabet   A string representing the alphabet to use for validation.
 *                                          Valid alphabets include ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html),
 *                                          ["IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["EXTENDED-IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["PSI-BLAST"](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp).
 *                                          Default is ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html).
 *
 * @return          {function}   Returns the correct function to parse the text passed or `undefined` if text doesn't conform to any standard (AA, FASTA, UniProt Accession).
 */
function autodetect(text, alphabet) {
    switch(true){
        case (accessionNumberRegex.test(text)):
        case (accessionNumberRegex.test(text.toUpperCase())):
            return fromAccession;
        case sequenceParser(alphabet).test(text):
            // Return nested function, so that alphabet is defined at this stage already (avoid inconsistency!)
            return (text) => fromSequence(text, alphabet);
        case validFasta(text, alphabet):
            // Return nested function, so that alphabet is defined at this stage already (avoid inconsistency!)
            return (text) => fromFasta(text, alphabet);
        case (uniprotNameRegex.test(text.toUpperCase())):
        case (uniprotNameRegex.test(text)):
            return fromUniprotQuery;
        default:
            return undefined;
    }
}

/**
 * Collection of alphabets to be passed to parsing functions.
 *
 */
const alphabets = {
    "PSI_BLAST" : 0,
    "EXTENDED_IUPAC2": 1,
    "IUPAC2": 2,
    "IUPAC": 3,
    "NATURAL": 4,
};

/**
 * Collection of available parsers.
 *
 */
const parsers = {
    fasta: 0,
    aa: 1,
    accession: 2,
    protein_name: 3,
    uniprot: 4
};

exports.Protein = Protein;
exports.fromFasta = fromFasta;
exports.fromAccession = fromAccession;
exports.fromUniprotQuery = fromUniprotQuery;
exports.fromSequence = fromSequence;
exports.validInput = validInput;
exports.autodetect = autodetect;
exports.alphabets = alphabets;
exports.parsers = parsers;
