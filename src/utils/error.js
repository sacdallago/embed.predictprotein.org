import { pushNotification, Notification } from "../stores/notificationStore";
import { APIException } from "./api";

import { SequenceException } from "./sequence";

export function handleQueryError(error, query) {
    let header = "Error";
    if (error instanceof SequenceException) {
        header = "Error fetching sequence";
    } else if (error instanceof APIException) {
        header = "Error connection to bio_embeddings API";
    }
    pushNotification(new Notification(error.message, "error", header));
}
