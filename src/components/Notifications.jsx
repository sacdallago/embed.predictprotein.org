import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import { FaExclamationCircle } from "react-icons/fa";

import { useNotifcationStore } from "../stores/notificationStore";

function buildToastFromNotification(notification, deletefn) {
    let icon = <></>;
    switch (notification.type) {
        case "error":
            icon = notification.icon ?? (
                <FaExclamationCircle size="1.5em" className="me-1" />
            );
            break;
        default:
            icon = notification.icon ?? <></>;
            break;
    }

    return (
        <Toast
            autohide
            delay={4000}
            onClose={() => deletefn(notification.id)}
            key={notification.id}
        >
            <Toast.Header>
                {icon}
                <span className="me-auto">{notification.header}</span>
            </Toast.Header>
            <Toast.Body>{notification.body}</Toast.Body>
        </Toast>
    );
}

export default function Notifications() {
    const [notifications, deleteNotification] = useNotifcationStore((state) => [
        state.notifications,
        state.deleteNotification,
    ]);
    let DisplayedToasts = notifications.map((element) =>
        buildToastFromNotification(element, deleteNotification)
    );

    return (
        <ToastContainer
            className="position-fixed top-0 end-0 me-2 mt-2"
            position="top-end"
        >
            {DisplayedToasts}
        </ToastContainer>
    );
}
