import { pushNotification, Notification } from "../stores/notificationStore";

export function handleQueryError(error, query) {
    pushNotification(
        new Notification(error.message, "error", "Error fetching Features")
    );
}
