const Endpoint = "https://api.bioembeddings.com/api/";

// See:
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 3000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
    });
    clearTimeout(id);
    return response;
}

export async function get_worker_status(worker_name) {
    const status_endpoint = Endpoint + "status/";
    const response = await fetchWithTimeout(status_endpoint + worker_name);
    if (!response.ok) {
        throw new Error("Worker status not okay.");
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
    const feature_endpoint = Endpoint + "annotations";

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
        throw new Error("Error" + response.status + ": " + response.statusText);
    }

    return response.json();
}

/*******************************************************************************
 *                              Data Processing                                *
 *******************************************************************************/

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
