import create from "zustand";

import {
    InputAlphabet,
    InputType,
    eval_input_type,
    get_sequence_for_type,
} from "../utils/sequence";

let abortController = null;

const invalid = {
    accession: undefined,
    sequence: undefined,
    type: InputType.invalid,
    alphabet: InputAlphabet.undefined,
    isValid: false,
};

const initial = {
    input: "",
    ...invalid,
};

const useInputStore = create((set, get) => ({
    ...initial,
    setInput: (new_input) => {
        get().invalidate();
        set({ input: new_input });
    },
    validate: () => {
        let [new_type, new_alphabet] = eval_input_type(get().input);
        set({
            type: new_type,
            alphabet: new_alphabet,
            isValid: new_type !== InputType.invalid,
        });
    },
    getSequence: async () => {
        abortController = new AbortController();
        let type = get().type;
        let input = get().input;
        if (!get().isValid && get().sequence === undefined) return;
        let [seq, acc] = await get_sequence_for_type(type, input);
        if (!abortController.signal.aborted) {
            abortController = null;
            set({ sequence: seq, accession: acc });
            console.log(seq, acc);
        } else {
            abortController = null;
        }
    },
    reset: () => {
        if (abortController) abortController.abort();
        set(initial);
    },
    invalidate: () => {
        if (abortController) abortController.abort();
        set(invalid);
    },
}));

export default useInputStore;
