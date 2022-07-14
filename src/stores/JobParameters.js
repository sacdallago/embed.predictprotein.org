const status = {
    INVALID: 0,
    LOADING: 2,
    NULL: 3,

    // Protein input type
    MULTIPLESEQUENCES: 4,
    FASTA: 5,
    AA: 6,
    UNIPROT: 7,

    isValid: (incomingStatus) => {
        return incomingStatus === status.UNIPROT || incomingStatus === status.AA || incomingStatus === status.FASTA ||
            incomingStatus === status.MULTIPLESEQUENCES
    },
    needsIndexing: (incomingStatus) => {
        return incomingStatus === status.AA || incomingStatus === status.FASTA || incomingStatus === status.MULTIPLESEQUENCES
    },
};

const initial = {
    // sequenceInput component
    proteinStatus: status.NULL,
    protein: undefined,
    embedder: "prottrans_t5_xl_u50",
    predictor: "colabfold"
};


function JobParameters(state = initial, action) {
    switch (action.type) {
        case 'SET_PROTEIN_STATUS':
            return {
                ...state,
                proteinStatus: action.payload.proteinStatus
            };
        case 'SET_PROTEIN_OBJECT':
            return {
                ...state,
                protein: action.payload.protein
            };
        case 'SET_JOB_PARAMETERS':
            return {
                ...state,
                ...action.payload
            };
        case 'RESET_JOB_SUBMISSION':
            return initial;

        default:
            return state;
    }
}

export default JobParameters;

export const proteinStatus = status;