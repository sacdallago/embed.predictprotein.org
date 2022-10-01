const Endpoint = "https://api.bioembeddings.com/api/";

export async function get_worker_status(worker_name) {
    const status_endpoint = Endpoint + "status/";
    const response = await fetch(status_endpoint + worker_name);
    if (!response.ok) {
        throw new Error("Worker status not okay.");
    }
    return response.json();
}
