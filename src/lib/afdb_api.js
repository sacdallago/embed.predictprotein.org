import { fetchWithTimeout, APIException } from "./net_utils";

export async function structureFromAFDB(accession) {
    const response = await fetchWithTimeout(
        "https://www.alphafold.ebi.ac.uk/api/prediction/" + accession,
        {
            timeout: 5 * 60 * 100,
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
        }
    );

    if (!response.ok) {
        throw new APIException(response.statusText, response.status);
    }
    return response.json();
}
