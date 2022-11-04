import create from "zustand";

export const useSelection = create((set) => ({
    selectionStart: undefined,
    selectionEnd: undefined,
    unselect: () => {
        set({ selectionStart: undefined, selectionEnd: undefined });
    },
    select: (start, end) => set({ selectionStart: start, selectionEnd: end }),
}));
