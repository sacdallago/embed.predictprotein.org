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
