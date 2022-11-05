export class APIException extends Error {
    constructor(message, code = 0) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
    }
}

export async function fetchWithTimeout(resource, options = {}) {
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

export function download_data(data, filename) {
    if (data !== null) {
        let t = new Blob([data], {
            type: "text/plain",
        });
        let link = window.URL.createObjectURL(t);
        download_link(link, filename);
        window.URL.revokeObjectURL(link);
    }
}

export function download_link(link, filename) {
    let c = document.createElement("a");
    c.download = filename;
    c.href = link;
    c.click();
}

function convertToQueryUrl(obj) {
    let params = new URLSearchParams(obj);
    let entries = Object.entries(obj);

    for (let entry in entries) {
        let key = entries[entry][0];
        let value = entries[entry][1];

        if (Array.isArray(value)) {
            params.delete(key);
            value.forEach(function (v) {
                return params.append(key + "[]", v);
            });
        }
    }

    return params.toString();
}

export async function request(method, url, body) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            }

            reject([xhr.status, xhr.statusText]);
        };

        xhr.open(method, url);
        xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        if (typeof body != "undefined") {
            xhr.send(convertToQueryUrl(body));
        } else {
            xhr.send();
        }
    });
}
