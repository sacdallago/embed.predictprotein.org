import create from "zustand";

import { InputAlphabet, InputType, eval_input_type } from "../lib/sequence";

const invalid = {
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
        return new_type !== InputType.invalid;
    },
    reset: () => {
        set(initial);
    },
    invalidate: () => {
        set(invalid);
    },
}));

export default useInputStore;
