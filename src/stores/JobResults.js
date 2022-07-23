const status = {
    INVALID: 0,
    LOADING: 2,
    NULL: 3,
    DONE: 4,
};

export const annotationsPlaceholder = {
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

export const structurePlaceholder = {
    msa: "#3\t1\n>101\nSEQ\n>101\nSEQ",
    // pdb: "MODEL     1                                                                     \nATOM      1  N   SER A   1     -14.890   0.513  95.252  1.00 16.92           N  \nATOM      2  CA  SER A   1     -15.185   1.690  94.442  1.00 16.92           C  \nATOM      3  C   SER A   1     -15.007   1.398  92.956  1.00 16.92           C  \nATOM      4  CB  SER A   1     -14.290   2.861  94.850  1.00 16.92           C  \nATOM      5  O   SER A   1     -14.151   0.597  92.574  1.00 16.92           O  \nATOM      6  OG  SER A   1     -14.770   3.471  96.036  1.00 16.92           O  \nATOM      7  N   GLU A   2     -14.232  14.506  95.810  1.00 36.75           N  \nATOM      8  CA  GLU A   2     -14.790  13.314  96.441  1.00 36.75           C  \nATOM      9  C   GLU A   2     -13.691  12.442  97.042  1.00 36.75           C  \nATOM     10  CB  GLU A   2     -15.610  12.505  95.433  1.00 36.75           C  \nATOM     11  O   GLU A   2     -13.820  11.961  98.170  1.00 36.75           O  \nATOM     12  CG  GLU A   2     -17.115  12.647  95.609  1.00 36.75           C  \nATOM     13  CD  GLU A   2     -17.850  11.317  95.588  1.00 36.75           C  \nATOM     14  OE1 GLU A   2     -18.726  11.094  96.454  1.00 36.75           O  \nATOM     15  OE2 GLU A   2     -17.547  10.490  94.698  1.00 36.75           O  \nATOM     16  N   GLN A   3     -33.759  -2.311 137.930  1.00 53.71           N  \nATOM     17  CA  GLN A   3     -32.398  -2.124 138.421  1.00 53.71           C  \nATOM     18  C   GLN A   3     -31.471  -1.648 137.305  1.00 53.71           C  \nATOM     19  CB  GLN A   3     -31.863  -3.421 139.030  1.00 53.71           C  \nATOM     20  O   GLN A   3     -30.718  -0.689 137.483  1.00 53.71           O  \nATOM     21  CG  GLN A   3     -31.295  -3.253 140.433  1.00 53.71           C  \nATOM     22  CD  GLN A   3     -30.519  -4.469 140.902  1.00 53.71           C  \nATOM     23  NE2 GLN A   3     -30.197  -4.507 142.190  1.00 53.71           N  \nATOM     24  OE1 GLN A   3     -30.213  -5.369 140.113  1.00 53.71           O  \nTER      25      GLN A   3                                                      \nENDMDL                                                                          \nEND                                                                             \n",
    pdb: "MODEL     1                                                                     \nENDMDL                                                                          \nEND                                                                             \n",
    json: "{\"max_pae\": 31.75, \"pae\": [[26.26, 21.22, 28.72], [26.62, 24.74, 26.19], [29.59, 29.9, 26.67]], \"plddt\": [16.92, 36.75, 53.71], \"ptm\": 0.0}",
    meta: {
        "msa": "ColabFold, https://www.nature.com/articles/s41592-022-01488-1",
        "pdb": "ColabFold, https://www.nature.com/articles/s41592-022-01488-1",
        "json": "ColabFold:, https://www.nature.com/articles/s41592-022-01488-1"
    },
    status: status.NULL
};

const initial = {
    prottrans_t5_xl_u50: annotationsPlaceholder,
    colabfold: structurePlaceholder
};

function JobResults(state = initial, action) {
    switch (action.type) {
        case 'SET_ANNOTATIONS':
            return {
                ...state,
                [action.payload.embedder]: {
                    ...annotationsPlaceholder,
                    ...action.payload.result
                }
            };

        case 'SET_STRUCTURE':
            return {
                ...state,
                [action.payload.predictor]: {
                    ...structurePlaceholder,
                    ...action.payload.result
                }
            };

        case 'RESET_RESULTS':
            return initial;

        default:
            return state;
    }
}

export default JobResults;

export const resultStatus = status;