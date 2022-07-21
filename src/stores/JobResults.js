const status = {
    INVALID: 0,
    LOADING: 2,
    NULL: 3,
    DONE: 4
};

const placeholder = {
    sequence: "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    predictedSubcellularLocalizations: " ",
    predictedMembrane: " ",
    predictedBPO: [],
    predictedBPOGraphDataString: "",
    predictedCCO: [],
    predictedCCOGraphDataString: "",
    predictedMFO: [],
    predictedMFOGraphDataString: "",
    predictedDSSP3: " ",
    predictedDSSP8: " ",
    predictedDisorder: " ",
    predictedBindingMetal: " ",
    predictedBindingNucleicAcids: " ",
    predictedBindingSmallMolecules: " ",
    status: status.NULL
};

const initial = {
    prottrans_t5_xl_u50: placeholder,
    colabfold: {
        status: 0,
        structure: {}
    }
};

function JobResults(state = initial, action) {
    switch (action.type) {
        case 'SET_RESULT':
            return {
                ...state,
                [action.payload.embedder]: action.payload.result,
                [action.payload.predictor]: action.payload.result
            };

        case 'RESET_RESULTS':
            return initial;

        default:
            return state;
    }
}

export default JobResults;

export const resultStatus = status;