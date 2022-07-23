const initial = {
    selectionStart: null,
    selectionEnd: null
};


function FeatureSelection(state = initial, action) {
    switch (action.type) {
        case 'SET_REGION':
            return {
                selectionStart: action.payload.selectionStart,
                selectionEnd: action.payload.selectionEnd
            };
        case 'RESET_JOB_SUBMISSION':
            return initial;
        default:
            return state;
    }
}

export default FeatureSelection;
