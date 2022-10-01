const Endpoint = "https://api.bioembeddings.com/api/";

export async function get_worker_status(worker_name) {
    const status_endpoint = Endpoint + "status/";
    const response = await fetch(status_endpoint + worker_name);
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
    const feature_endpoint = Endpoint + "annotations/";

    let response = await fetch(feature_endpoint, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
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
