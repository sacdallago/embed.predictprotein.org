import create from "zustand";

export const DEFAULT_MESSAGE = {
    id: 0,
    type: "info",
    body: <></>,
    header: <></>,
};

export const useNotifcationStore = create((set, get) => ({
    notifications: [],
    nextid: 0,
    pushNotification: (notification) => {
        notification["id"] = get().nextid;
        set((state) => ({
            nextid: state.nextid + 1,
            notifications: [...state.notifications, notification],
            update: true,
        }));
    },
    deleteNotification: (id) => {
        let notifications_data = get().notifications;
        const index = notifications_data.findIndex((e) => e.id === id);
        notifications_data.splice(index, 1);
        set({ notifications: [...notifications_data] });
    },
}));
