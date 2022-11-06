import { range } from "d3";
import { proteinColorSchemes } from "./coloring";
import { fetchWithTimeout, APIException } from "./net_utils";

const ENDPOINT = "https://api.bioembeddings.com/api/";

export async function get_worker_status(worker_name) {
    const status_endpoint = ENDPOINT + "status/";
    const response = await fetchWithTimeout(status_endpoint + worker_name);
    if (!response.ok) {
        throw new APIException(response.statusText, response.status);
    }
    return response.json();
}

export class FeatureRequest {
    constructor(
        sequence,
        options = {
            model: "prottrans_t5_xl_u50",
            format: "full",
            only_closest_k: true,
        }
    ) {
        this.sequence = sequence;
        this.model = options.model;
        this.format = options.format;
        this.only_closest_k = options.only_closest_k;
    }

    get_body() {
        return {
            sequence: this.sequence,
            format: this.format,
            model: this.model,
            only_closest_k: this.only_closest_k,
        };
    }
}

export async function fetch_features(request) {
    const feature_endpoint = ENDPOINT + "annotations";

    let response = await fetchWithTimeout(feature_endpoint, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify(request.get_body()),
    });

    if (!response.ok) {
        throw new APIException(response.statusText, response.status);
    }

    return response.json();
}

export async function fetch_structure(
    sequence,
    retries = Infinity,
    timeout = 5 * 60 * 100
) {
    var sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    var fetch_structure = async () =>
        await fetchWithTimeout(ENDPOINT + "structure", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({
                sequence: sequence,
                predictor: "colabfold",
            }),
        });

    let iteration = 0;

    do {
        let response = await fetch_structure();

        if (!response.ok) {
            throw new APIException(response.statusText, response.status);
        }

        // Structure was found
        if (response.status === 200) return response.json();

        if (response.status !== 201 || response.status !== 202)
            throw new APIException(
                "Unexpected structure API response",
                response.status
            );
        await sleep(timeout);
    } while (iteration < retries);

    throw new APIException("Failed to fetch structure", 500);
}

/*******************************************************************************
 *                              Data Processing                                *
 *******************************************************************************/

export function findIndexes(string, letters) {
    let result = {};

    for (let j = 0; j < letters.length; j++) {
        let indices = [];
        for (let i = 0; i < string.length; i++) {
            if (string[i] === letters[j]) indices.push(i + 1);
        }
        result[letters[j]] = indices;
    }

    return result;
}

export function findRanges(array) {
    if (array.length < 1) {
        return [];
    }

    array.sort((e, i) => e - i);

    let ranges = [{ x: array[0], y: array[0] }];

    for (let i = 1; i < array.length; i++) {
        let currentRange = ranges[ranges.length - 1];

        if (array[i] <= currentRange.y + 1) {
            currentRange.y = array[i];
        } else {
            ranges.push({ x: array[i], y: array[i] });
        }
    }
    return ranges;
}

function data_to_rect_feature(
    prediction,
    predictionLabels,
    features,
    feature_desc
) {
    let ranges = findIndexes(prediction, predictionLabels);
    let data = Object.entries(ranges).map(([key, values]) => {
        let ranges = findRanges(values);
        return ranges.map((datum) => Object.assign({}, datum, features[key]));
    });
    feature_desc["data"] = data.flat();
    return feature_desc;
}

export function processGoPredSimResults(data) {
    // MAKE string for AMIGO viz
    // MFO
    let predictedMFOGraphData = { ...data.predictedMFO };

    Object.keys(predictedMFOGraphData).forEach((e) => {
        let score = predictedMFOGraphData[e];
        let newValue = {
            title: e + "<br/> score:" + score,
            fill: score >= 0.28 ? "#FFFF99" : "#E5E4E2",
        };

        predictedMFOGraphData[e] = newValue;
    });

    data["predictedMFOGraphDataString"] = encodeURIComponent(
        JSON.stringify(predictedMFOGraphData)
    );
    // CCO
    let predictedCCOGraphData = { ...data.predictedCCO };

    Object.keys(predictedCCOGraphData).forEach((e) => {
        let score = predictedCCOGraphData[e];
        let newValue = {
            title: e + "<br/> score:" + score,
            fill: score >= 0.29 ? "#FFFF99" : "#E5E4E2",
        };

        predictedCCOGraphData[e] = newValue;
    });

    data["predictedCCOGraphDataString"] = encodeURIComponent(
        JSON.stringify(predictedCCOGraphData)
    );
    // BPO
    let predictedBPOGraphData = { ...data.predictedBPO };

    Object.keys(predictedBPOGraphData).forEach((e) => {
        let score = predictedBPOGraphData[e];
        let newValue = {
            title: e + "<br/> score:" + score,
            fill: score >= 0.35 ? "#FFFF99" : "#E5E4E2",
        };

        predictedBPOGraphData[e] = newValue;
    });

    data["predictedBPOGraphDataString"] = encodeURIComponent(
        JSON.stringify(predictedBPOGraphData)
    );

    return data;
}

export function get_featureviewer_data(data) {
    return [
        _transmembrane_to_data(data),
        _dssp_to_data(data),
        _disorder_to_data(data),
        _binding_to_data(data),
        _conservation_to_data(data),
        _muvariantion_data(data),
    ];
}

function _transmembrane_to_data(data) {
    var prediction = data.predictedTransmembrane;
    var theme = proteinColorSchemes.transmembrane;
    var predictionLabels = ["B", "b", "H", "h", "S"];
    var features = {
        H: { description: "Helix - outwards" },
        h: { description: "Helix - inwards" },
        B: { description: "Sheet - outwards" },
        b: { description: "Sheet - inwards" },
        S: { description: "Signal peptide" },
    };
    Object.keys(features).forEach(
        (key) => (features[key]["color"] = theme.contrast[key])
    );

    var feature_desc = {
        name: "Topology",
        color: "#989898",
        type: "rect",
        height: 20,
    };

    return data_to_rect_feature(
        prediction,
        predictionLabels,
        features,
        feature_desc
    );
}

function _dssp_to_data(data) {
    var prediction = data.predictedDSSP3;
    var theme = proteinColorSchemes.dssp8;
    var predictionLabels = ["H", "E", "C"];
    var features = {
        H: { description: "Helix", level: 0 },
        E: { description: "Sheet", level: 1 },
        C: { description: "Other", level: 2 },
    };
    Object.keys(features).forEach(
        (key) => (features[key]["color"] = theme.contrast[key])
    );

    var feature_desc = {
        name: "Structure",
        color: "#989898",
        type: "rect",
        height: 20,
    };

    return data_to_rect_feature(
        prediction,
        predictionLabels,
        features,
        feature_desc
    );
}

function _disorder_to_data(data) {
    var prediction = data.predictedDisorder;
    var theme = proteinColorSchemes.disorder;
    var predictionLabels = ["X"];
    var features = {
        X: { description: "Disordered Region" },
    };
    Object.keys(features).forEach(
        (key) => (features[key]["color"] = theme.contrast[key])
    );

    var feature_desc = {
        name: "Disorder",
        color: "#989898",
        type: "rect",
        height: 20,
    };

    return data_to_rect_feature(
        prediction,
        predictionLabels,
        features,
        feature_desc
    );
}

// TODO this is a bit hacky; improve!
function _binding_to_data(data) {
    var get_data = (prediction, label, desc, color) => {
        var predictionLabels = [label];
        var features = {};
        features[label] = { description: desc, color: color };
        var feature_desc = {};
        return data_to_rect_feature(
            prediction,
            predictionLabels,
            features,
            feature_desc
        ).data;
    };

    var metal = get_data(
        data.predictedBindingMetal,
        "M",
        "Metal ion",
        proteinColorSchemes.metal.contrast.M
    );
    var nucleic = get_data(
        data.predictedBindingNucleicAcids,
        "N",
        "Nucleic Acids",
        proteinColorSchemes.nucleicAcids.contrast.N
    );
    var small = get_data(
        data.predictedBindingSmallMolecules,
        "S",
        "Small molecule",
        proteinColorSchemes.smallMolecules.contrast.S
    );
    data = [...small, ...nucleic, ...metal];
    return {
        data: data,
        name: "Binding",
        color: "#989898",
        type: "rect",
        height: 20,
    };
}

function _conservation_to_data(data) {
    return {
        data: data.predictedConservation.map((y, i) => {
            return {
                x: i,
                y: y,
            };
        }),
        name: "Conservation",
        color: "#008B8D",
        type: "line",
        height: 5,
    };
}

function _muvariantion_data(data) {
    let transposedVariation = data.predictedVariation.values[0].map(
        (_, colIndex) =>
            data.predictedVariation.values.map((row) => row[colIndex])
    );
    let averageVariation = transposedVariation.map(
        (e) => e.reduce((e, acc) => e + acc, 0) / e.length
    );

    return {
        data: averageVariation.map((y, i) => {
            return {
                x: i,
                y: y,
            };
        }),
        name: "μ variation",
        color: "#000000",
        type: "line",
        height: 5,
    };
}
